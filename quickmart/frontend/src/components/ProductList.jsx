import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CATEGORY_ICONS = {
  "All": "🏪", "Dairy": "🥛", "Bakery": "🥐", "Fruits": "🍎",
  "Vegetables": "🥦", "Snacks": "🍿", "Beverages": "🥤",
  "Staples": "🌾", "Household": "🧹", "Personal Care": "🧴"
};

export default function ProductList({ products }) {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || "All";
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart, addToCart, updateQty } = useCart();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = products.filter(p => {
    const matchesCategory = category === "All" || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full animate-fade-in flex flex-col gap-6">

      {/* ── Header + Search ── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🛍️</span> Explore Aisles
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">{filtered.length} products available</p>
          </div>

          {/* Live Search Bar */}
          <div className="relative sm:w-80 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-800 border border-white/10 text-white text-sm rounded-2xl pl-10 pr-4 py-3
                         placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30
                         transition-all duration-200 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0
                         ${category === cat
                           ? "bg-sky-500 text-slate-900 shadow-lg shadow-sky-500/25"
                           : "bg-slate-800 text-slate-400 border border-white/5 hover:border-white/15 hover:text-white"}`}
            >
              <span className="text-base leading-none">{CATEGORY_ICONS[cat] || "📦"}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty / No results ── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <span className="text-6xl">{searchQuery ? "🔍" : "📦"}</span>
          <h3 className="text-lg font-bold text-slate-300">
            {searchQuery ? `No results for "${searchQuery}"` : "No products in this aisle"}
          </h3>
          <p className="text-slate-500 text-sm">
            {searchQuery ? "Try a different search term or browse another aisle." : "Check back soon!"}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="mt-1 px-5 py-2 bg-slate-800 text-sky-400 border border-sky-500/20 rounded-xl text-sm font-bold hover:bg-sky-500 hover:text-slate-900 transition-all">
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* ── Product Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filtered.map(p => {
          const item = cart.find(i => i._id === p._id);
          const imgSrc = p.image || p.img || `https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80`;

          return (
            <div
              key={p._id}
              className="group flex flex-col bg-slate-800 rounded-3xl border border-white/5 hover:border-sky-500/25
                         shadow-lg hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full h-44 bg-slate-900/60 overflow-hidden">
                <img
                  src={imgSrc}
                  alt={p.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80"; }}
                />
                {/* Category chip */}
                {p.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                    {p.category}
                  </span>
                )}
                {/* Highlight search match */}
                {searchQuery && p.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-sky-400 rounded-full shadow-lg shadow-sky-400/50" />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                <h3 className="text-sm font-bold text-slate-100 leading-snug line-clamp-2 flex-1">
                  {/* Highlight matching term */}
                  {searchQuery
                    ? p.name.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                        part.toLowerCase() === searchQuery.toLowerCase()
                          ? <mark key={i} className="bg-sky-500/25 text-sky-300 rounded px-0.5">{part}</mark>
                          : part
                      )
                    : p.name}
                </h3>

                {/* Price + Add button */}
                <div className="flex items-center justify-between gap-3 mt-auto">
                  <span className="text-xl font-black text-white">₹{p.price}</span>

                  {!item ? (
                    <button
                      onClick={() => addToCart(p)}
                      className="px-4 py-2 bg-slate-700/60 hover:bg-sky-500 text-sky-400 hover:text-slate-900 text-sm font-bold rounded-xl transition-all duration-200 border border-sky-500/20 hover:border-transparent shrink-0"
                    >
                      + Add
                    </button>
                  ) : (
                    <div className="flex items-center bg-sky-500 text-slate-900 font-bold rounded-xl overflow-hidden shrink-0 shadow-md shadow-sky-500/20">
                      <button onClick={() => updateQty(p._id, "dec")} className="w-9 h-9 flex items-center justify-center text-lg hover:bg-black/10 transition-colors">−</button>
                      <span className="w-7 text-center text-sm select-none">{item.qty}</span>
                      <button onClick={() => updateQty(p._id, "inc")} className="w-9 h-9 flex items-center justify-center text-lg hover:bg-black/10 transition-colors">+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
