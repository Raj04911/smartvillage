const Crop = require("../models/Crop");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalOrders, totalCrops, users, orders, crops] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Crop.countDocuments(),
      User.find().sort({ createdAt: -1 }),
      Order.find().sort({ createdAt: -1 }),
      Crop.find().sort({ aiScore: -1 })
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const activeUsers = users.filter((user) => user.status === "Active").length;
    const pendingOrders = orders.filter((order) => order.status !== "Delivered").length;
    const districtDemandMap = crops.reduce((acc, crop) => {
      acc[crop.district] = (acc[crop.district] || 0) + (crop.aiScore || 0);
      return acc;
    }, {});

    const districtDemand = Object.entries(districtDemandMap)
      .map(([district, score]) => ({ district, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const topCrops = crops.slice(0, 5).map((crop) => ({
      _id: crop._id,
      name: crop.name,
      district: crop.district,
      state: crop.state,
      price: crop.price,
      stock: crop.stock,
      aiScore: crop.aiScore
    }));

    const recentOrders = orders.slice(0, 6).map((order) => ({
      _id: order._id,
      userName: order.userName,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      primaryCrop: order.items?.[0]?.name || "Mixed Basket"
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalCrops,
        totalRevenue,
        activeUsers,
        pendingOrders,
        districtDemand,
        topCrops,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [users, orders, crops] = await Promise.all([
      User.find().sort({ createdAt: 1 }),
      Order.find().sort({ createdAt: 1 }),
      Crop.find().sort({ createdAt: 1 })
    ]);

    const growthByMonth = {};
    const revenueByMonth = {};

    users.forEach((user) => {
      const key = user.createdAt.toISOString().slice(0, 7);
      growthByMonth[key] = (growthByMonth[key] || 0) + 1;
    });

    orders.forEach((order) => {
      const key = order.createdAt.toISOString().slice(0, 7);
      revenueByMonth[key] = (revenueByMonth[key] || 0) + (order.totalAmount || 0);
    });

    const cropPerformance = crops.slice(0, 8).map((crop) => ({
      label: `${crop.name} (${crop.district})`,
      value: crop.aiScore
    }));

    res.status(200).json({
      success: true,
      analytics: {
        growthLabels: Object.keys(growthByMonth),
        growthValues: Object.values(growthByMonth),
        revenueLabels: Object.keys(revenueByMonth),
        revenueValues: Object.values(revenueByMonth),
        cropPerformance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
