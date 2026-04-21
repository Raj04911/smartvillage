const express = require("express");
const router = express.Router();
const { getAdminStats, getAnalytics } = require("../controllers/adminController");

router.get("/stats", getAdminStats);
router.get("/analytics", getAnalytics);

module.exports = router;
