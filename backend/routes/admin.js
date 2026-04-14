const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");
const Crop = require("../models/Crop");

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCrops = await Crop.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalCrops,
        totalRevenue
      }
    });

  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats"
    });
  }
});

module.exports = router;