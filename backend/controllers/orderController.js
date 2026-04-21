const Order = require("../models/Order");
const Crop = require("../models/Crop");

const getTrackingTemplate = (stage = 0) => {
  const steps = [
    {
      label: "Ordered",
      note: "Your crop basket has been confirmed.",
      completedAt: stage >= 0 ? new Date() : null
    },
    {
      label: "Shipped",
      note: "The seller has dispatched the order.",
      completedAt: stage >= 1 ? new Date() : null
    },
    {
      label: "Delivered",
      note: "The order has reached the customer.",
      completedAt: stage >= 2 ? new Date() : null
    }
  ];

  return steps;
};

const statusToStageMap = {
  Ordered: 0,
  Shipped: 1,
  Delivered: 2
};

exports.createOrder = async (req, res) => {
  try {
    const { userId, userName, userEmail, items, totalAmount, state, district } = req.body;

    if (!userId || !userEmail) {
      return res.status(400).json({ message: "User data missing" });
    }

    const order = await Order.create({
      userId,
      userName,
      userEmail,
      state,
      district,
      items,
      totalAmount,
      status: "Ordered",
      trackingStage: 0,
      trackingTimeline: getTrackingTemplate(0)
    });

    await Promise.all(
      (items || []).map(async (item) => {
        if (!item.cropId || !item.quantity) {
          return null;
        }

        return Crop.findByIdAndUpdate(item.cropId, {
          $inc: { stock: -Math.abs(item.quantity) }
        });
      })
    );

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

    const orders = await Order.find({
      $or: [{ userId }, { userEmail: userId }]
    }).sort({ createdAt: -1 });

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
    const trackingStage = statusToStageMap[status] ?? 0;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        trackingStage,
        trackingTimeline: getTrackingTemplate(trackingStage)
      },
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

exports.addReview = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, comment } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        review: {
          rating,
          comment,
          createdAt: new Date()
        }
      },
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
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
