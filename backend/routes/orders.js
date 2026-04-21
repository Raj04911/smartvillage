const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

router.post("/create", orderController.createOrder);
router.get("/user/:userId", orderController.getUserOrders);
router.get("/all", orderController.getAllOrders);
router.put("/update/:orderId", orderController.updateOrderStatus);
router.put("/review/:orderId", orderController.addReview);

module.exports = router;
