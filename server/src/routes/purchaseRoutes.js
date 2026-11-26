
const express = require("express");
const router = express.Router();

const {
  createPurchase,
  getPurchases,
  getPurchase
} = require("../controllers/purchaseController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Get all purchases
router.get("/", protect, getPurchases);

// Get single purchase
router.get("/:id", protect, getPurchase);

// Create purchase
router.post(
  "/",
  protect,
  authorize("admin", "inventory_manager"),
  createPurchase
);

module.exports = router;
