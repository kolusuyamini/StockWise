
const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Get all products
router.get("/", protect, getProducts);

// Get single product
router.get("/:id", protect, getProduct);

// Add product
router.post(
  "/",
  protect,
  authorize("admin", "inventory_manager"),
  createProduct
);

// Update product
router.put(
  "/:id",
  protect,
  authorize("admin", "inventory_manager"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProduct
);

module.exports = router;
