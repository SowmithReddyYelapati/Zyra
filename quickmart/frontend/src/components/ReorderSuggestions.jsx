import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useCart } from '../context/CartContext';

export default function ReorderSuggestions() {
  const [predictions, setPredictions] = useState([]);
  const { addToCart } = useCart();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    API.get(`/orders/reorder/${userId}`)
      .then(res => setPredictions(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  if (!userId || predictions.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-rose-500/5 border border-amber-500/20 rounded-3xl p-6 h-full flex flex-col items-start gap-4 shadow-xl">
      <div className="flex items-center gap-3">
         <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 text-xl">🔄</span>
         <h3 className="text-lg font-bold text-amber-400">Stock Running Low</h3>
      </div>
      
      <p className="text-sm text-slate-400 leading-relaxed pr-4">
         Based on your algorithmic purchase history, these items usually run out around now.
      </p>

      <div className="flex flex-col gap-3 w-full mt-auto pt-4">
        {predictions.slice(0, 3).map(item => (
          <div key={item.productId} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-2xl border border-white/5">
            <div className="pr-2">
               <h4 className="text-sm font-semibold text-slate-200 truncate">{item.name}</h4>
               <span className="text-xs text-amber-500/80 font-bold">Recommended</span>
            </div>
            <button 
              onClick={() => addToCart({ ...item, _id: item.productId })}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-colors whitespace-nowrap"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
