const express = require("express");
const router = express.Router();

const cropController = require("../controllers/cropController");

router.post("/create", cropController.createCrop);
router.get("/", cropController.getCrops);
router.get("/filters", cropController.getCropFilters);
router.get("/recommendations", cropController.getDistrictRecommendations);
router.get("/price-insights", cropController.getPriceInsights);
router.get("/market-overview", cropController.getMarketOverview);
router.get("/:cropId/predict", cropController.getPrediction);

module.exports = router;
