
const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: ""
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      default: ""
    },

    city: {
      type: String,
      default: ""
    },

    notes: {
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

supplierSchema.index({ name: 1 });

module.exports = mongoose.model("Supplier", supplierSchema);
