import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart({ products }) {
  const { cart, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="flex flex-col bg-slate-800 rounded-3xl border border-white/5 shadow-2xl overflow-hidden max-h-[calc(100vh-100px)]">

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Cart</h2>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${cart.length > 0 ? 'bg-sky-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
            {cart.length} {cart.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
            <span className="text-5xl">🛒</span>
            <p className="text-slate-400 text-sm font-medium">Your cart is empty</p>
            <p className="text-slate-600 text-xs">Add items to get started</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map(item => (
              <div key={item._id} className="flex flex-col gap-2.5 p-4 bg-slate-900/60 rounded-2xl border border-white/5 group">
                {/* Name + price row */}
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-semibold text-slate-200 text-sm leading-snug flex-1 line-clamp-2">{item.name}</h4>
                  <span className="font-bold text-sky-400 text-sm shrink-0">₹{item.price * item.qty}</span>
                </div>

                {/* Qty controls + remove row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0 bg-slate-700/70 rounded-xl overflow-hidden border border-white/5">
                    <button onClick={() => updateQty(item._id, "dec")} className="w-8 h-8 flex items-center justify-center text-base hover:bg-slate-600 transition-colors text-slate-300">−</button>
                    <span className="w-7 text-center text-sm font-bold text-white">{item.qty}</span>
                    <button onClick={() => updateQty(item._id, "inc")} className="w-8 h-8 flex items-center justify-center text-base hover:bg-slate-600 transition-colors text-slate-300">+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-slate-500 hover:text-rose-400 text-xs font-semibold transition-colors px-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-white/5 bg-slate-800 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Total</span>
          <span className="text-2xl font-black text-white">₹{total}</span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          disabled={cart.length === 0}
          className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 text-white disabled:cursor-not-allowed font-bold text-base rounded-2xl shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition-all disabled:transform-none disabled:shadow-none"
        >
          Checkout →
        </button>
      </div>
    </div>
  );
}
