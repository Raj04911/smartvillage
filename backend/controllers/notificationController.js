const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const { audience, userId } = req.query;

    const query = { audience };

    if (audience === "user" && userId) {
      query.$or = [{ userId }, { userId: null }];
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
