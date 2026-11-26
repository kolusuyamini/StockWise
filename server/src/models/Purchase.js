
const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    purchaseNumber: {
      type: String,
      required: true,
      unique: true
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        costPrice: {
          type: Number,
          required: true,
          min: 0
        },

        subtotal: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["pending", "received", "cancelled"],
      default: "pending"
    },

    purchaseDate: {
      type: Date,
      default: Date.now
    },

    notes: {
      type: String,
      default: ""
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

purchaseSchema.index({ purchaseDate: -1 });

module.exports = mongoose.model("Purchase", purchaseSchema);
