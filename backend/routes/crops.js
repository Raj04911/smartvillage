const express = require("express");
const router = express.Router();

const cropController = require("../controllers/cropController");

router.post("/create", cropController.createCrop);
router.get("/", cropController.getCrops);

module.exports = router;