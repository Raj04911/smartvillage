const Order = require("../models/Order");
exports.createOrder = async (req, res) => {
  try {
    const { userId, userName, userEmail, items, totalAmount } = req.body;

    if (!userId || !userEmail) {
      return res.status(400).json({ message: "User data missing" });
    }

    const order = await Order.create({
      userId,
      userName,
      userEmail,
      items,
      totalAmount
    });

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { returnDocument: "after" }
    );

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await require("../models/Order")
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};