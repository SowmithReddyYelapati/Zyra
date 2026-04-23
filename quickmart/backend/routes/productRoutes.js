const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

/* GET ALL PRODUCTS + FILTER BY CATEGORY */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let products;

    if (category) {
      products = await Product.find({ category });
    } else {
      products = await Product.find();
    }

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;