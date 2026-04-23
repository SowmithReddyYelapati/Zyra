const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  const { items, totalAmount, paymentMethod } = req.body;

  const order = await Order.create({
    userId: req.user.id,
    items,
    totalAmount,
    paymentMethod
  });

  res.json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("userId", "email");
  res.json(orders);
};