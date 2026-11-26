
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    minStock: {
      type: Number,
      default: 5,
      min: 0
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier"
    },

    image: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", sku: "text" });
productSchema.index({ category: 1 });

module.exports = mongoose.model("Product", productSchema);
