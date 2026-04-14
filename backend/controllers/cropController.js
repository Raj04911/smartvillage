const Crop = require("../models/Crop");

exports.createCrop = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    const crop = await Crop.create({
      name,
      price,
      stock
    });

    res.status(201).json({
      success: true,
      crop
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find();

    res.status(200).json(crops);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};