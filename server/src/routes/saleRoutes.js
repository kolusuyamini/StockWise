
const express = require("express");
const router = express.Router();

const {
  createSale,
  getSales,
  getSale
} = require("../controllers/saleController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Get all sales
router.get("/", protect, getSales);

// Get single sale
router.get("/:id", protect, getSale);

// Create sale
router.post(
  "/",
  protect,
  authorize("admin", "inventory_manager", "sales_staff"),
  createSale
);

module.exports = router;
