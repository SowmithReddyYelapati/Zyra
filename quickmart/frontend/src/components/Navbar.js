import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const token   = localStorage.getItem("token");
  const role    = localStorage.getItem("role");
  const email   = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || email.split("@")[0] || "User";
  const initials = userName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-[100] flex items-center justify-between px-6 md:px-12 py-3 lg:py-5 bg-slate-900/95 backdrop-blur-xl border-b border-white/5 shadow-sm w-full">
      <Link to="/home" className="text-2xl lg:text-4xl font-black bg-gradient-to-br from-sky-400 via-sky-500 to-sky-700 bg-clip-text text-transparent hover:scale-105 transition-all duration-300 tracking-tighter shrink-0 flex items-center">
        Zyra
      </Link>



      {/* Right Actions */}
      <div className="flex items-center gap-4 lg:gap-6">
        <Link to="/home" className="text-sm font-semibold text-slate-400 hover:text-sky-400 transition-colors hidden md:block">Home</Link>
        <Link to="/products" className="text-sm font-semibold text-slate-400 hover:text-sky-400 transition-colors">Shop</Link>

        {/* Cart */}
        <div className="relative cursor-pointer group flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 transition-colors" onClick={() => navigate("/products")}>
          <span className="text-xl">🛒</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-900 text-xs font-black min-w-[20px] min-h-[20px] flex items-center justify-center rounded-full shadow-lg shadow-emerald-500/30">
              {cart.length}
            </span>
          )}
        </div>

        {/* Auth Section */}
        {!token ? (
          <div className="flex gap-3 items-center">
            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Log in</Link>
            <Link to="/register" className="bg-sky-500 hover:bg-sky-400 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition-all">Sign Up</Link>
          </div>
        ) : (
          <div className="relative">
            {/* Avatar trigger */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 transition-all group"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-inner ${role === "admin" ? "bg-purple-600" : "bg-sky-600"}`}>
                {initials}
              </div>
              <span className="text-sm font-semibold text-slate-300 capitalize hidden sm:block max-w-[80px] truncate">{userName}</span>
              <span className={`text-slate-400 text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                <div className="absolute right-0 top-[calc(100%+10px)] w-60 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-fade-in">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-white/5 bg-slate-900/50">
                    <p className="text-white font-bold capitalize truncate">{userName}</p>
                    <p className="text-slate-400 text-xs truncate mt-0.5">{email}</p>
                    {role === "admin" && <span className="text-purple-400 text-xs font-bold">👑 Admin Access</span>}
                  </div>

                  {/* Menu Items */}
                  {[
                    { icon: "👤", label: "My Profile",      path: "/profile" },
                    { icon: "📦", label: "My Orders",       path: "/profile" },
                    { icon: "📊", label: "Dashboard",       path: "/dashboard" },
                    { icon: "🛍️", label: "Shop Market",     path: "/products" },
                  ].map(item => (
                    <button
                      key={item.path + item.label}
                      onClick={() => { navigate(item.path); setDropdownOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-colors"
                    >
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}

                  <div className="border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 w-full text-left text-rose-400 hover:bg-rose-500/10 text-sm transition-colors font-medium"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}