const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  items: [
    {
      cropId: String,
      name: String,
      price: Number,
      quantity: Number,
      total: Number
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);