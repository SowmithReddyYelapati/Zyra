const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  category: String,
  img: String,
  image: String,
  tags: [String]
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);