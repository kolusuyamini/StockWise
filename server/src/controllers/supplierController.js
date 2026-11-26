
const Supplier = require("../models/Supplier");

// ADD SUPPLIER
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);

    res.status(201).json({
      message: "Supplier added successfully",
      supplier
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL SUPPLIERS
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      isActive: true
    }).sort({ createdAt: -1 });

    res.json({
      count: suppliers.length,
      suppliers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE SUPPLIER
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found"
      });
    }

    res.json({ supplier });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE SUPPLIER
exports.updateSupplier = async (req, res) => {
  try {
    const allowedFields = [
      "name", "company", "email",
      "phone", "address", "city", "notes"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      updates,
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found"
      });
    }

    res.json({
      message: "Supplier updated successfully",
      supplier
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE SUPPLIER (SOFT DELETE)
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found"
      });
    }

    res.json({
      message: "Supplier deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
