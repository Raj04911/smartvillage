const Order = require("../models/Order");
const Crop = require("../models/Crop");
const Notification = require("../models/Notification");

const districtCoordinates = {
  Ludhiana: { lat: 30.900965, lng: 75.857277 },
  Meerut: { lat: 28.984461, lng: 77.706413 },
  Kolar: { lat: 13.1362, lng: 78.1291 },
  Nashik: { lat: 19.9975, lng: 73.7898 },
  Kolhapur: { lat: 16.705, lng: 74.2433 },
  Hooghly: { lat: 22.9007, lng: 88.3897 },
  Rajkot: { lat: 22.3039, lng: 70.8022 },
  Purnia: { lat: 25.7771, lng: 87.4753 }
};

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
    const {
      userId,
      userName,
      userEmail,
      items,
      totalAmount,
      state,
      district,
      deliveryAddress
    } = req.body;

    if (!userId || !userEmail) {
      return res.status(400).json({ message: "User data missing" });
    }

    if (!deliveryAddress?.addressLine || !deliveryAddress?.district || !deliveryAddress?.state) {
      return res.status(400).json({ message: "Delivery address, district, and state are required" });
    }

    const primaryCrop = items?.[0];
    const sourceCoordinates =
      districtCoordinates[primaryCrop?.district] ||
      districtCoordinates[district] ||
      { lat: 20.5937, lng: 78.9629 };
    const destinationCoordinates =
      districtCoordinates[deliveryAddress.district] ||
      districtCoordinates[district] ||
      { lat: 20.5937, lng: 78.9629 };

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
      trackingTimeline: getTrackingTemplate(0),
      deliveryAddress,
      routeMap: {
        source: {
          label: `${primaryCrop?.district || district}, ${primaryCrop?.state || state}`,
          ...sourceCoordinates
        },
        destination: {
          label: `${deliveryAddress.district}, ${deliveryAddress.state}`,
          lat: destinationCoordinates.lat,
          lng: destinationCoordinates.lng
        }
      }
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

    await Notification.create([
      {
        audience: "user",
        userId,
        title: "Order placed",
        message: `Order #${order._id.toString().slice(-5)} has been placed successfully.`,
        type: "order"
      },
      {
        audience: "admin",
        userId: null,
        title: "New order received",
        message: `${userName} placed a new order worth Rs ${totalAmount}.`,
        type: "order"
      }
    ]);

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

    if (order) {
      await Notification.create([
        {
          audience: "user",
          userId: order.userId,
          title: `Order ${status}`,
          message: `Order #${order._id.toString().slice(-5)} is now ${status}.`,
          type: "order"
        },
        {
          audience: "admin",
          userId: null,
          title: "Order status updated",
          message: `Order #${order._id.toString().slice(-5)} moved to ${status}.`,
          type: "order"
        }
      ]);
    }

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

    if (order) {
      await Notification.create([
        {
          audience: "admin",
          userId: null,
          title: "New review submitted",
          message: `${order.userName} reviewed order #${order._id.toString().slice(-5)} with ${rating}/5.`,
          type: "review"
        }
      ]);
    }

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

exports.getOrderReviews = async (req, res) => {
  try {
    const orders = await Order.find({
      "review.rating": { $ne: null }
    }).sort({ "review.createdAt": -1 });

    const reviews = orders.map((order) => ({
      _id: order._id,
      userName: order.userName,
      rating: order.review.rating,
      comment: order.review.comment,
      createdAt: order.review.createdAt,
      cropName: order.items?.[0]?.name || "Crop order"
    }));

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
