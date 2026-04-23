const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    audience: {
      type: String,
      enum: ["user", "admin"],
      required: true
    },
    userId: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "info"
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
