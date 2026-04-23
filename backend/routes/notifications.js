const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markNotificationRead
} = require("../controllers/notificationController");

router.get("/", getNotifications);
router.put("/:notificationId/read", markNotificationRead);

module.exports = router;
