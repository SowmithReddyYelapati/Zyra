const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      productId: {
        type: String
      },
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  paymentMethod: String, // 'Razorpay' or 'Cash on Delivery'
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);