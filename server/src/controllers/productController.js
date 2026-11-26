
const Product = require("../models/Product");

// ADD PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product added successfully",
      product
    });
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message: error.code === 11000
        ? "SKU already exists"
        : error.message
    });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const { search, category, lowStock, page = 1, limit = 10 } = req.query;

    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } }
      ];
    }

    if (lowStock === "true") {
      filter.$expr = { $lte: ["$stock", "$minStock"] };
    }

    const currentPage = Math.max(1, Number(page));
    const pageSize = Math.min(100, Math.max(1, Number(limit)));

    const products = await Product.find(filter)
      .populate("supplier", "name company")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      total,
      page: currentPage,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    }).populate("supplier", "name company");

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({ product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      "name", "description", "category",
      "price", "costPrice", "stock",
      "minStock", "supplier", "image"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE PRODUCT (SOFT DELETE)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
