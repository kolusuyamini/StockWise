
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// CREATE SALE
exports.createSale = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      customerName,
      customerPhone,
      items,
      paymentMethod
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "At least one sale item is required"
      });
    }

    let sale;

    await session.withTransaction(async () => {
      const saleItems = [];
      let totalAmount = 0;

      for (const item of items) {
        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error("Invalid sale quantity");
        }

        const product = await Product.findOneAndUpdate(
          {
            _id: item.product,
            isActive: true,
            stock: { $gte: quantity }
          },
          {
            $inc: { stock: -quantity }
          },
          {
            new: true,
            session
          }
        );

        if (!product) {
          throw new Error(
            "Product not found or insufficient stock"
          );
        }

        const unitPrice = product.price;
        const subtotal = quantity * unitPrice;

        totalAmount += subtotal;

        saleItems.push({
          product: product._id,
          quantity,
          unitPrice,
          subtotal
        });
      }

      const invoiceNumber = `INV-${Date.now()}`;

      const created = await Sale.create(
        [{
          invoiceNumber,
          customerName: customerName || "Walk-in Customer",
          customerPhone: customerPhone || "",
          items: saleItems,
          totalAmount,
          paymentMethod: paymentMethod || "cash",
          paymentStatus: "paid",
          saleDate: new Date(),
          soldBy: req.user.id
        }],
        { session }
      );

      sale = created[0];
    });

    res.status(201).json({
      message: "Sale completed and stock updated successfully",
      sale
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    await session.endSession();
  }
};

// GET ALL SALES
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("items.product", "name sku")
      .populate("soldBy", "name email")
      .sort({ saleDate: -1 });

    res.json({
      count: sales.length,
      sales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE SALE
exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("items.product", "name sku")
      .populate("soldBy", "name email");

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found"
      });
    }

    res.json({ sale });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
