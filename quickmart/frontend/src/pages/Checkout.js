import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

function Checkout() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handlePayment = () => {
    navigate("/payment");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center px-4 py-10 animate-fade-in relative overflow-hidden">
      
      {/* Premium Ambient Aesthetics */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-slate-800/80 backdrop-blur-2xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative z-10 transition-all">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
           <div>
             <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
               <span className="bg-sky-500/20 text-sky-400 p-2 rounded-xl text-xl border border-sky-500/30">🧾</span> 
               Order Summary
             </h2>
             <p className="text-slate-400 text-sm mt-2 font-medium">Verify your items before confirming the transaction.</p>
           </div>
           <Link to="/products" className="text-sm text-sky-400 font-bold hover:text-sky-300 hover:underline">Edit Cart</Link>
        </div>

        {cart.length === 0 ? (
           <div className="text-center py-10">
              <span className="text-5xl mb-4 block">🛒</span>
              <h3 className="text-xl font-bold text-slate-300">Your basket is empty.</h3>
              <p className="text-slate-500 mt-2">Add items via the shop to checkout.</p>
           </div>
        ) : (
           <div className="flex flex-col gap-4 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-white/5 shadow-sm group hover:border-sky-500/30 transition-colors">
                  <div className="flex flex-col">
                    <h4 className="text-slate-200 font-bold">{item.name}</h4>
                    <span className="text-xs text-slate-400 font-medium">Qty: <span className="text-white bg-slate-800 px-2 py-0.5 rounded-md border border-white/10 ml-1">{item.qty}</span></span>
                  </div>
                  <span className="font-black text-sky-400 text-lg">₹{item.price * item.qty}</span>
                </div>
              ))}
           </div>
        )}

        <div className="bg-slate-900/80 p-8 rounded-2xl border border-white/10 flex justify-between items-center mb-8 shadow-inner ring-1 ring-white/5">
           <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Total Amount Payable</span>
           <span className="text-4xl font-black text-white drop-shadow-2xl">₹{total}</span>
        </div>

        <button
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-lg tracking-wide py-4 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.25)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          onClick={handlePayment}
          disabled={cart.length === 0}
        >
          Confirm & Proceed to Payment <span className="text-xl">💳</span>
        </button>
        <p className="text-center text-xs text-slate-500 font-medium mt-4">Transactions are encrypted with 256-bit bank-grade security.</p>
      </div>

    </div>
  );
}

export default Checkout;