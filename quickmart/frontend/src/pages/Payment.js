import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from 'react-hot-toast';

function Payment() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const userId = localStorage.getItem("userId");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 1. Dynamic Script Loader for Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleTransaction = async (e) => {
    e.preventDefault();
    if(cart.length === 0) return toast.error("Cart is empty");
    setIsProcessing(true);

    try {
       // --- CASH ON DELIVERY LOGIC (Bypass Gateway) ---
       if (method === "cod") {
           try {
              await API.post("/orders", {
                 userId: userId || null,
                 items: cart.map(i => ({ _id: String(i._id), name: i.name, qty: i.qty, price: i.price })),
                 totalAmount: total,
                 paymentMethod: "Cash on Delivery"
              });
              toast.success("Order Placed via Cash on Delivery!", { icon: '📦', duration: 3000 });
              clearCart();
              navigate("/profile");
           } catch (codErr) {
              console.error("COD order error:", codErr);
              toast.error("Failed to place COD order. Please try again.");
           } finally {
              setIsProcessing(false);
           }
           return;
       }

       // --- RAZORPAY GATEWAY LOGIC (UPI/Card) ---
       
       // Step 1: Tell Backend to Create a secure Order ID natively
       const initRes = await API.post("/orders/create-razorpay-order", { amount: total });
       const { order: rzpOrder } = initRes.data;

       // Step 2: Save the MongoDB "Pending" state linked to this cart
       const dbRes = await API.post("/orders", {
         userId: userId || null,
         items: cart.map(i => ({ _id: String(i._id), name: i.name, qty: i.qty, price: i.price })),
         totalAmount: total,
         paymentMethod: "Razorpay initialized"
       });
       const dbOrderId = dbRes.data.order._id;

       const rzpKey = process.env.REACT_APP_RAZORPAY_KEY;
       if (!rzpKey) {
           toast.error("Razorpay API Key is missing in environment variables.");
           setIsProcessing(false);
           return;
       }

       // Step 3: Configure Razorpay UI overlay options (IF REAL KEYS EXIST)
       const options = {
          key: rzpKey, 
          amount: rzpOrder.amount,
          currency: "INR",
          name: "Zyra Premium",
          description: "Grocery Order",
          order_id: rzpOrder.id, // The critical secure id from Node.js
          handler: async function (response) {
             // Step 4: Razorpay returns sensitive tokens onSuccess
             try {
                const verifyRes = await API.post("/orders/verify-payment", {
                   razorpay_order_id: response.razorpay_order_id,
                   razorpay_payment_id: response.razorpay_payment_id,
                   razorpay_signature: response.razorpay_signature,
                   dbOrderId
                });
                if (verifyRes.data.success) {
                   toast.success("Payment Verified Cryptographically!", { icon: '🎓' });
                   clearCart(); navigate("/profile");
                }
             } catch (err) {
                toast.error("Signature tampering detected OR invalid mock keys.");
             }
          },
          prefill: { 
             name: "Test User", 
             email: "user@example.com", 
             contact: "9999999999" 
          },
          theme: { color: "#0ea5e9" } // Matches our sky-500 aesthetic
       };

       // Step 5: Launch Gateway native window
       const rzpGateway = new window.Razorpay(options);
       rzpGateway.on('payment.failed', function (response){
          toast.error("Payment Gateway Rejected Transaction.");
          setIsProcessing(false);
       });
       rzpGateway.open();
       setIsProcessing(false);

    } catch (err) {
       toast.error("Banking systems offline. Try again.");
       setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center px-4 animate-fade-in py-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/10 via-slate-900 to-slate-900 -z-10"></div>
      
      <div className="w-full max-w-4xl bg-slate-800/90 backdrop-blur-3xl p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl relative transition-all grid grid-cols-1 lg:grid-cols-2 gap-12">
         
         <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-12">
            <h2 className="text-3xl font-black text-white flex items-center gap-3 mb-2">Checkout <span className="text-2xl">🔒</span></h2>
            <p className="text-slate-400 text-sm mb-10">Select your preferred transaction method. Encrypted via 256-bit protocols.</p>

            <div className="flex flex-col gap-4">
               {/* UPI Button */}
               <button type="button" onClick={() => setMethod("upi")} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ${method === "upi" ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.15)]' : 'border-white/5 bg-slate-900/50 hover:bg-slate-900 hover:border-white/20'}`}>
                  <span className="w-12 h-8 rounded bg-white flex items-center justify-center font-black text-xs text-sky-600">UPI</span>
                  <div className="flex flex-col text-left"><span className="font-bold text-white text-lg">UPI Platforms</span><span className="text-xs text-slate-400">GPay, PhonePe, Paytm</span></div>
                  {method === "upi" && <span className="ml-auto text-sky-400 text-2xl">✓</span>}
               </button>

               {/* Card Button */}
               <button type="button" onClick={() => setMethod("card")} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ${method === "card" ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.15)]' : 'border-white/5 bg-slate-900/50 hover:bg-slate-900 hover:border-white/20'}`}>
                  <span className="w-12 h-8 rounded bg-slate-700 flex items-center justify-center font-black text-xl text-white">💳</span>
                  <div className="flex flex-col text-left"><span className="font-bold text-white text-lg">Credit / Debit Card</span><span className="text-xs text-slate-400">Visa, Mastercard, RuPay</span></div>
                  {method === "card" && <span className="ml-auto text-sky-400 text-2xl">✓</span>}
               </button>

               {/* COD Button */}
               <button type="button" onClick={() => setMethod("cod")} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ${method === "cod" ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.15)]' : 'border-white/5 bg-slate-900/50 hover:bg-slate-900 hover:border-white/20'}`}>
                  <span className="w-12 h-8 rounded bg-emerald-500/20 flex items-center justify-center font-black text-xl text-emerald-400">💵</span>
                  <div className="flex flex-col text-left"><span className="font-bold text-white text-lg">Cash on Delivery</span><span className="text-xs text-slate-400">Pay physically at doorstep</span></div>
                  {method === "cod" && <span className="ml-auto text-sky-400 text-2xl">✓</span>}
               </button>
            </div>
         </div>

         <div className="flex flex-col justify-center">
             <div className="bg-slate-900/80 p-8 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-3">Total Amount Due</span>
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-sky-600 mb-8 drop-shadow-xl">₹{total}</span>
                
                <button 
                  onClick={handleTransaction}
                  disabled={isProcessing}
                  className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl tracking-wide flex justify-center items-center gap-3 transition-all duration-300 ${isProcessing ? 'bg-slate-700 text-slate-400 cursor-not-allowed transform-none' : 'bg-sky-500 hover:bg-sky-400 text-slate-900 hover:scale-[1.02] active:scale-95 shadow-sky-500/30'}`}
                >
                  {isProcessing ? (
                    <><span className="w-5 h-5 border-4 border-slate-400 border-t-white rounded-full animate-spin"></span> Authorizing...</>
                  ) : (
                    method === 'cod' ? `Confirm Order ₹${total}` : `Proceed with ${method.toUpperCase()}`
                  )}
                </button>
                <span className="mt-4 text-xs text-slate-500 font-medium">Secured by Razorpay Gateways</span>
             </div>
         </div>

      </div>
    </div>
  );
}

export default Payment;