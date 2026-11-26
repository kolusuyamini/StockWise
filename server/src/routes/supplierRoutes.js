
const express = require("express");
const router = express.Router();

const {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier
} = require("../controllers/supplierController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Get all suppliers
router.get("/", protect, getSuppliers);

// Get single supplier
router.get("/:id", protect, getSupplier);

// Add supplier
router.post(
  "/",
  protect,
  authorize("admin", "inventory_manager"),
  createSupplier
);

// Update supplier
router.put(
  "/:id",
  protect,
  authorize("admin", "inventory_manager"),
  updateSupplier
);

// Delete supplier
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteSupplier
);

module.exports = router;
