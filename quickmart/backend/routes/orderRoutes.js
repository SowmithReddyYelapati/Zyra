const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

// Razorpay Instance
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// ================= CREATE ORDER (COD / DIRECT) =================
router.post("/", async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, userId } = req.body;
    const mongoose = require("mongoose");

    // Only store userId if it is a real MongoDB ObjectId — never store strings like "guest"
    const safeUserId = (userId && userId !== "guest" && mongoose.Types.ObjectId.isValid(userId))
      ? userId
      : null;

    const formattedItems = items.map(item => ({
      productId: item._id,
      name: item.name,
      quantity: item.qty || 1,
      price: item.price
    }));

    const order = await Order.create({
      userId: safeUserId,
      items: formattedItems,
      totalAmount,
      paymentMethod,
      status: "PENDING"
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
});

// ================= RAZORPAY: INITIATE ORDER =================
router.post("/create-razorpay-order", async (req, res) => {
   try {
      const { amount } = req.body; 
      
      if (!razorpay) {
          return res.status(400).json({ error: "Razorpay keys not configured on server" });
      }

      const options = {
         amount: Math.round(amount * 100),
         currency: "INR",
         receipt: `receipt_order_${Date.now()}`
      };
      
      const rzpOrder = await razorpay.orders.create(options);
      res.json({ success: true, order: rzpOrder });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to initialize Razorpay Gateway" });
   }
});

// ================= RAZORPAY: CRYPTO VERIFICATION =================
router.post("/verify-payment", async (req, res) => {
   try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;
      
      if (!process.env.RAZORPAY_KEY_SECRET) {
          return res.status(400).json({ error: "Razorpay keys not configured on server" });
      }

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
         .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
         .update(sign.toString())
         .digest("hex");

      if (razorpay_signature === expectedSign) {
         // Verification PASSES! Money is authentic. Update MongoDB safely.
         const updatedOrder = await Order.findByIdAndUpdate(dbOrderId, {
             paymentMethod: "Razorpay (Card/UPI)",
             razorpay_order_id,
             razorpay_payment_id,
             razorpay_signature,
             status: "SUCCESS"
         }, { new: true });
         
         return res.json({ success: true, message: "Payment verified securely", order: updatedOrder });
      } else {
         // Signature Forged Warning!
         await Order.findByIdAndUpdate(dbOrderId, { status: "FAILED" });
         return res.status(400).json({ success: false, message: "Invalid Signature. Possible Tampering." });
      }
   } catch (error) {
      res.status(500).json({ error: "Verification server error" });
   }
});


// ================= GET ALL ORDERS (ADMIN) =================
router.get("/", async (req, res) => {
  try {
    // Avoid populate() — some orders may have null/invalid userId which causes CastError
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    console.error("Admin fetch orders error:", err);
    res.status(500).json({ message: "Error fetching orders", detail: err.message });
  }
});


// ================= GET USER ORDERS =================
router.get("/my-orders/:userId", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const { userId } = req.params;

    // Guard: return empty array for invalid / missing userId
    if (!userId || userId === "null" || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.json([]);
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: "Error fetching user orders" });
  }
});


// ================= UPDATE ORDER STATUS =================
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});


// ================= DELETE ORDER =================
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ================= SMART REORDER PREDICTION =================
router.get("/reorder/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: 1 });
    
    const itemHistory = {};
    orders.forEach(o => {
       const oDate = new Date(o.createdAt).getTime();
       o.items.forEach(i => {
           if(!itemHistory[i.productId]) itemHistory[i.productId] = { item: i, dates: [] };
           itemHistory[i.productId].dates.push(oDate);
       });
    });

    const predictions = [];
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;

    Object.values(itemHistory).forEach(data => {
       if (data.dates.length > 1) {
          let totalGap = 0;
          for (let i = 1; i < data.dates.length; i++) {
             totalGap += (data.dates[i] - data.dates[i-1]);
          }
          const avgGap = totalGap / (data.dates.length - 1);
          const lastDate = data.dates[data.dates.length - 1];
          const daysSinceLast = (now - lastDate) / ONE_DAY;
          const avgGapDays = avgGap / ONE_DAY;

          // ML Logic: If expected interval reached (exceeded 80% of gap)
          if (daysSinceLast >= avgGapDays * 0.8) {
             // De-duplicate if needed
             predictions.push({
               product: data.item,
               urgency: daysSinceLast - avgGapDays
             });
          }
       }
    });

    predictions.sort((a,b) => b.urgency - a.urgency);
    
    // Fallback Mock Logic: If practically no past tracking exists for demo
    if (predictions.length === 0 && orders.length > 0) {
        // Find most frequent item overall
        const allItems = orders.flatMap(o => o.items);
        if (allItems.length > 0) {
            predictions.push({ product: allItems[0], urgency: 1 });
            if (allItems[1]) predictions.push({ product: allItems[1], urgency: 0.5 });
        }
    }

    // We only need multiple distinct products, avoiding duplicates
    const uniquePredictions = [];
    const idsMap = new Set();
    predictions.forEach(p => {
       if (!idsMap.has(p.product.productId.toString())) {
          idsMap.add(p.product.productId.toString());
          uniquePredictions.push(p);
       }
    });

    res.json(uniquePredictions.map(p => p.product));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;