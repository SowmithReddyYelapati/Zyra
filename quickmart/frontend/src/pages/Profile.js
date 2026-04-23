 import { useState, useEffect } from "react";
 import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

/* ─── Status display config ─── */
const STATUS = {
  SUCCESS: { label: "Confirmed",  color: "text-emerald-400", ring: "ring-emerald-500/30", bg: "bg-emerald-500/10", dot: "bg-emerald-500", icon: "✓", stripe: "from-emerald-500 to-green-400" },
  PENDING: { label: "Processing", color: "text-amber-400",   ring: "ring-amber-500/30",   bg: "bg-amber-500/10",   dot: "bg-amber-400",   icon: "⏳", stripe: "from-amber-500 to-yellow-400" },
  FAILED:  { label: "Failed",     color: "text-rose-400",    ring: "ring-rose-500/30",    bg: "bg-rose-500/10",    dot: "bg-rose-500",    icon: "✕", stripe: "from-rose-500 to-pink-500" },
  DELIVERED: { label: "Delivered", color: "text-purple-400", ring: "ring-purple-500/30", bg: "bg-purple-500/10", dot: "bg-purple-500", icon: "📦", stripe: "from-purple-500 to-fuchsia-400" },
};

const TABS = [
  { id: "orders",  emoji: "📦", label: "My Orders"  },
  { id: "account", emoji: "👤", label: "Account"    },
  { id: "address", emoji: "📍", label: "Addresses"  },
];

export default function Profile() {
  const navigate = useNavigate();
  const [tab, setTab]     = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [expanded, setExpanded] = useState(null);

  const token     = localStorage.getItem("token");
  const userId    = localStorage.getItem("userId");
  const role      = localStorage.getItem("role");
  const userEmail = localStorage.getItem("userEmail") || "shopper@zyra.com";
  const userName  = localStorage.getItem("userName")  || userEmail.split("@")[0];
  const initials  = userName.slice(0, 2).toUpperCase();
  const isAdmin   = role === "admin";

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    (async () => {
      try {
        let url;
        if (isAdmin)                            url = "/orders";
        else if (userId && userId !== "null")   url = `/orders/my-orders/${userId}`;
        else { setOrders([]); setLoading(false); return; }

        const { data } = await API.get(url);
        setOrders(Array.isArray(data) ? data : []);
      } catch { setError("Could not connect to the backend. Make sure the server is running."); }
      finally  { setLoading(false); }
    })();
  }, [userId, role, token, navigate, isAdmin]);

  const totalSpent  = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const delivered   = orders.filter(o => o.status === "SUCCESS").length;
  const avgOrder    = orders.length ? Math.round(totalSpent / orders.length) : 0;

  const logout = () => { localStorage.clear(); toast.success("Signed out"); navigate("/login"); };

  if (!token) return null;

  /* ── helpers ── */
  const fmt = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
         + " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-x-hidden">
      {/* ── Ambient glows ── */}
      <div className={`absolute -top-60 ${isAdmin ? "-right-40" : "-left-40"} w-[700px] h-[700px] blur-[160px] rounded-full pointer-events-none opacity-60 ${isAdmin ? "bg-purple-600/10" : "bg-sky-600/10"}`} />
      <div className="absolute -bottom-60 right-0 w-[500px] h-[500px] bg-slate-700/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 animate-fade-in relative z-10">

        {/* ════════════════════════════════
            HERO CARD
        ════════════════════════════════ */}
        <div className="relative mb-8 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-slate-800/90 backdrop-blur-xl">
          {/* Gradient top bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${isAdmin ? "from-purple-500 via-fuchsia-400 to-rose-500" : "from-sky-400 via-cyan-400 to-emerald-400"}`} />

          {/* Decorative background shape */}
          <div className={`absolute top-0 right-0 w-96 h-56 blur-[80px] opacity-20 rounded-full pointer-events-none ${isAdmin ? "bg-purple-500" : "bg-sky-500"}`} />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-[88px] h-[88px] rounded-[1.5rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl
                                 ${isAdmin ? "bg-gradient-to-br from-purple-500 via-fuchsia-500 to-rose-500 shadow-purple-500/30"
                                           : "bg-gradient-to-br from-sky-400 via-cyan-500 to-emerald-500 shadow-sky-500/30"}`}>
                  {initials}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-400 rounded-full border-[3px] border-slate-800 shadow-lg shadow-emerald-500/30" />
              </div>

              {/* Identity block */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-black text-white capitalize leading-tight">{userName}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border
                                   ${isAdmin ? "bg-purple-500/15 border-purple-500/30 text-purple-300" : "bg-sky-500/10 border-sky-500/20 text-sky-400"}`}>
                    {isAdmin ? "👑 Administrator" : "✦ Zyra Member"}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-6">{userEmail}</p>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Orders",     value: orders.length,              sub: "total placed" },
                    { label: "Delivered",  value: delivered,                  sub: "successfully" },
                    { label: "Lifetime",   value: `₹${totalSpent.toLocaleString()}`, sub: "spent" },
                    { label: "Avg. Order", value: avgOrder ? `₹${avgOrder}` : "—", sub: "per order" },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-900/60 rounded-2xl px-4 py-3 border border-white/5">
                      <p className="text-white font-black text-lg leading-none">{s.value}</p>
                      <p className="text-slate-400 text-xs mt-1.5 font-medium">{s.label}</p>
                      <p className="text-slate-600 text-[10px] mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <button onClick={logout}
                className="shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold self-start sm:self-center
                           text-rose-400 bg-rose-500/10 border border-rose-500/20
                           hover:bg-rose-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-lg shadow-rose-900/10">
                <span className="text-xl">🚪</span> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════
            TAB NAV
        ════════════════════════════════ */}
        <div className="flex gap-1 p-2 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] mb-10 w-fit mx-auto sm:mx-0 shadow-2xl">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                         ${tab === t.id
                           ? `${isAdmin ? "bg-purple-500 shadow-purple-500/20" : "bg-sky-500 shadow-sky-500/20"} text-slate-900 shadow-lg`
                           : "text-slate-400 hover:text-white hover:bg-white/5"}`}
            >
              <span>{t.emoji}</span>
              <span className="hidden sm:inline">{t.label}</span>
              {t.id === "orders" && orders.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black
                                  ${tab === t.id ? "bg-slate-900/30" : "bg-slate-700 text-slate-300"}`}>
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════
            ORDERS TAB
        ════════════════════════════════ */}
        {tab === "orders" && (
          <div className="space-y-4">
            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-sm">
                <span className="text-xl">⚠️</span> {error}
              </div>
            )}

            {/* Skeleton loaders */}
            {loading && [...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-800/60 rounded-2xl border border-white/5 overflow-hidden animate-pulse">
                <div className="h-0.5 bg-slate-700" />
                <div className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-700 rounded-lg w-1/3" />
                    <div className="h-3 bg-slate-700 rounded-lg w-1/2" />
                  </div>
                  <div className="w-16 h-8 bg-slate-700 rounded-xl shrink-0" />
                </div>
              </div>
            ))}

            {/* Empty state */}
            {!loading && orders.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
                <div className="w-28 h-28 rounded-[2rem] bg-slate-800 border border-white/5 flex items-center justify-center text-6xl shadow-inner">🛒</div>
                <div>
                  <h3 className="text-xl font-black text-white">No orders yet</h3>
                  <p className="text-slate-400 text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">Add items to your cart and place an order — it'll show up here instantly.</p>
                </div>
                <Link to="/products"
                  className="px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold rounded-2xl
                             shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition-all text-sm">
                  Browse Products →
                </Link>
              </div>
            )}

            {/* Order cards */}
            {!loading && orders.map(order => {
              const cfg  = STATUS[order.status] || STATUS.PENDING;
              const isEx = expanded === order._id;

              return (
                <div key={order._id}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 shadow-lg
                              ${isEx ? `border-white/15 shadow-xl ring-1 ${cfg.ring}` : "border-white/5 hover:border-white/10"} bg-slate-800/80 backdrop-blur`}>

                  {/* Top color stripe */}
                  <div className={`h-[3px] bg-gradient-to-r ${cfg.stripe}`} />

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 cursor-pointer select-none"
                    onClick={() => setExpanded(isEx ? null : order._id)}>

                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 font-bold ${cfg.bg} border border-white/5`}>
                        {cfg.icon}
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <span className="text-white font-black text-sm tracking-wide">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.bg} border-white/10 ${cfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                          &nbsp;·&nbsp;{order.paymentMethod || "Online"}
                          &nbsp;·&nbsp;{fmt(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-5 shrink-0">
                      <div className="text-right">
                        <p className="text-xl font-black text-white">₹{order.totalAmount}</p>
                        <p className="text-xs text-slate-500 mt-0.5">total paid</p>
                      </div>
                      <div className={`w-8 h-8 rounded-xl bg-slate-700/50 border border-white/5 flex items-center justify-center text-slate-400 text-[10px] transition-transform duration-300 ${isEx ? "rotate-180" : ""}`}>
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isEx && (
                    <div className="border-t border-white/5 px-5 pt-5 pb-6 space-y-5 animate-fade-in">

                      {/* Item list */}
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Items Ordered</p>
                        <div className="space-y-2">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-900/60 border border-white/5">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center text-base shrink-0">🛍️</div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                                  <p className="text-xs text-slate-500">Qty: {item.quantity || 1}</p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-sky-400 shrink-0">
                                ₹{((item.price || 0) * (item.quantity || 1)).toFixed(0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bill summary */}
                      <div className="rounded-2xl bg-slate-900/50 border border-white/5 overflow-hidden">
                        <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Bill Summary</p>
                        </div>
                        <div className="px-5 py-4 text-sm space-y-2.5">
                          <div className="flex justify-between text-slate-400">
                            <span>Item Total</span><span>₹{order.totalAmount}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Delivery</span><span className="text-emerald-400 font-bold">FREE 🎉</span>
                          </div>
                          <div className="flex justify-between text-white font-black text-base border-t border-white/10 pt-3">
                            <span>Grand Total</span><span>₹{order.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button onClick={() => navigate("/products")}
                          className="flex-1 py-3 rounded-2xl text-sm font-bold border
                                     bg-sky-500/10 text-sky-400 border-sky-500/20
                                     hover:bg-sky-500 hover:text-slate-900 hover:border-transparent transition-all">
                          🔁 Reorder
                        </button>
                        {order.status === "FAILED" && (
                          <button onClick={() => navigate("/payment")}
                            className="flex-1 py-3 rounded-2xl text-sm font-bold border
                                       bg-rose-500/10 text-rose-400 border-rose-500/20
                                       hover:bg-rose-500 hover:text-white hover:border-transparent transition-all">
                            ↩ Retry Payment
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════
            ACCOUNT TAB
        ════════════════════════════════ */}
        {tab === "account" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Personal Info */}
            <Card title="Personal Info">
              <div className="space-y-3">
                {[
                  { icon: "👤", label: "Full Name",     value: userName  },
                  { icon: "📧", label: "Email",         value: userEmail },
                  { icon: "🏷️", label: "Account Type", value: isAdmin ? "Administrator" : "Consumer" },
                  { icon: "📅", label: "Member Since",  value: "April 2024" },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors group">
                    <span className="text-2xl w-9 text-center shrink-0">{r.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{r.label}</p>
                      <p className={`font-semibold mt-0.5 capitalize truncate ${r.label === "Account Type" && isAdmin ? "text-purple-400" : "text-white"}`}>{r.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Spending Stats */}
            <Card title="Spending Overview">
              <div className="space-y-3">
                {[
                  { label: "Total Orders",     value: orders.length,  color: "bg-sky-500",    pct: Math.min((orders.length / 20) * 100, 100) },
                  { label: "Delivered",         value: delivered,      color: "bg-emerald-500", pct: orders.length ? (delivered / orders.length) * 100 : 0 },
                  { label: "Spending",          value: `₹${totalSpent.toLocaleString()}`, color: "bg-purple-500", pct: Math.min((totalSpent / 10000) * 100, 100) },
                  { label: "Avg. Order Value",  value: avgOrder ? `₹${avgOrder}` : "—", color: "bg-amber-400", pct: Math.min((avgOrder / 2000) * 100, 100) },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">{s.label}</span>
                      <span className="text-white font-black">{s.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                      <div className={`h-full rounded-full ${s.color} transition-all duration-1000`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Danger zone */}
            <div className="md:col-span-2 rounded-2xl overflow-hidden border border-rose-500/15 bg-rose-500/[0.03]">
              <div className="px-6 py-4 border-b border-rose-500/10 bg-rose-500/[0.04]">
                <h3 className="font-bold text-rose-400 flex items-center gap-2 text-sm">⚠️ Danger Zone</h3>
              </div>
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white font-semibold">Sign out of Zyra</p>
                  <p className="text-slate-500 text-sm mt-0.5">You will need to log in again to access your account.</p>
                </div>
                <button onClick={logout}
                  className="shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-lg shadow-rose-900/30">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            ADDRESSES TAB
        ════════════════════════════════ */}
        {tab === "address" && (
          <div className="space-y-4">
            {/* Default address */}
            <div className="relative rounded-2xl overflow-hidden border border-sky-500/20 bg-slate-800/80 shadow-xl">
              <div className="h-[3px] bg-gradient-to-r from-sky-400 to-cyan-400" />
              <div className="p-6 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-2xl shrink-0">🏠</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-white">Home</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/20 uppercase tracking-wide">Default</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">123, Sample Street, Sector 12<br />City, State — 600 001</p>
                  <div className="flex gap-2 mt-4">
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500 hover:text-slate-900 hover:border-transparent transition-all">Edit</button>
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-900/50 border border-white/10 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all">Remove</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved work address */}
            <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-slate-800/60 shadow-lg opacity-60 hover:opacity-100 transition-opacity">
              <div className="p-6 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-700 border border-white/5 flex items-center justify-center text-2xl shrink-0">🏢</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">Work</h3>
                  <p className="text-slate-500 text-sm italic">No address saved yet</p>
                  <button className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-900/50 border border-white/10 hover:text-white transition-colors">Add work address</button>
                </div>
              </div>
            </div>

            {/* Add address CTA */}
            <button className="w-full group py-7 rounded-2xl border-2 border-dashed border-white/10
                               hover:border-sky-500/30 hover:bg-sky-500/[0.03]
                               flex items-center justify-center gap-3
                               text-slate-500 hover:text-sky-400 font-semibold text-sm
                               transition-all duration-200">
              <span className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-sky-500/15 flex items-center justify-center text-lg transition-colors">+</span>
              Add New Address
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Reusable card wrapper ── */
function Card({ title, children }) {
  return (
    <div className="bg-slate-800/80 backdrop-blur rounded-2xl border border-white/5 shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
        <h3 className="font-bold text-white text-sm">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
