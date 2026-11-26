
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const mongoose = require("mongoose");

// CREATE PURCHASE
exports.createPurchase = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { supplier, items, notes } = req.body;

    if (!supplier || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Supplier and purchase items are required"
      });
    }

    let purchase;

    await session.withTransaction(async () => {
      const supplierExists = await Supplier.findOne({
        _id: supplier,
        isActive: true
      }).session(session);

      if (!supplierExists) {
        throw new Error("Supplier not found");
      }

      const purchaseItems = [];
      let totalAmount = 0;

      for (const item of items) {
        const quantity = Number(item.quantity);
        const costPrice = Number(item.costPrice);

        if (!Number.isInteger(quantity) || quantity < 1 ||
            !Number.isFinite(costPrice) || costPrice < 0) {
          throw new Error("Invalid purchase quantity or cost price");
        }

        const product = await Product.findOne({
          _id: item.product,
          isActive: true
        }).session(session);

        if (!product) {
          throw new Error("Product not found");
        }

        const subtotal = quantity * costPrice;
        totalAmount += subtotal;

        purchaseItems.push({
          product: product._id,
          quantity,
          costPrice,
          subtotal
        });

        await Product.updateOne(
          { _id: product._id },
          { $inc: { stock: quantity } },
          { session }
        );
      }

      const purchaseNumber = `PUR-${Date.now()}`;

      const created = await Purchase.create(
        [{
          purchaseNumber,
          supplier,
          items: purchaseItems,
          totalAmount,
          status: "received",
          purchaseDate: new Date(),
          notes,
          createdBy: req.user.id
        }],
        { session }
      );

      purchase = created[0];
    });

    res.status(201).json({
      message: "Purchase recorded and stock updated successfully",
      purchase
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    await session.endSession();
  }
};

// GET ALL PURCHASES
exports.getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "name company")
      .populate("items.product", "name sku")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: purchases.length,
      purchases
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PURCHASE
exports.getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier", "name company")
      .populate("items.product", "name sku")
      .populate("createdBy", "name email");

    if (!purchase) {
      return res.status(404).json({
        message: "Purchase not found"
      });
    }

    res.json({ purchase });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
