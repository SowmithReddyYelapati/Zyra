const Order = require("../models/Order");
const Expense = require("../models/Expense");

// Add expense
exports.addExpense = async (req, res) => {
  const expense = await Expense.create(req.body);
  res.json(expense);
};

// Get dashboard stats
exports.getDashboard = async (req, res) => {
  const orders = await Order.find();
  const expenses = await Expense.find();

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const profit = totalRevenue - totalExpenses;

  res.json({
    totalRevenue,
    totalExpenses,
    profit,
    totalOrders: orders.length
  });
};