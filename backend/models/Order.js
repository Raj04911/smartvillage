const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  state: {
    type: String,
    default: ""
  },
  district: {
    type: String,
    default: ""
  },
  items: [
    {
      cropId: String,
      name: String,
      district: String,
      state: String,
      price: Number,
      quantity: Number,
      total: Number
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    default: "Ordered"
  },
  trackingStage: {
    type: Number,
    default: 0
  },
  trackingTimeline: [
    {
      label: String,
      note: String,
      completedAt: Date
    }
  ],
  review: {
    rating: {
      type: Number,
      default: null
    },
    comment: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: null
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
