
const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },

    customerName: {
      type: String,
      default: "Walk-in Customer"
    },

    customerPhone: {
      type: String,
      default: ""
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

        unitPrice: {
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

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "other"],
      default: "cash"
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "paid"
    },

    saleDate: {
      type: Date,
      default: Date.now
    },

    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

saleSchema.index({ saleDate: -1 });

module.exports = mongoose.model("Sale", saleSchema);
