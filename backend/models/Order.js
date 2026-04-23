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
  deliveryAddress: {
    addressLine: {
      type: String,
      default: ""
    },
    district: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
    pincode: {
      type: String,
      default: ""
    }
  },
  routeMap: {
    source: {
      label: String,
      lat: Number,
      lng: Number
    },
    destination: {
      label: String,
      lat: Number,
      lng: Number
    }
  },
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
