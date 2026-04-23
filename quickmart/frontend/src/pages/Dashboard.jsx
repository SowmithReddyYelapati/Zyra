import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [spent, setSpent] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (role === "admin") {
          setIsAdmin(true);
          // Admins fetch ALL orders globally
          const res = await API.get("/orders");
          setOrders(res.data);
        } else if (userId) {
          // Users fetch ONLY personal orders
          const res = await API.get(`/orders/my-orders/${userId}`);
          setOrders(res.data);
          const totalExp = res.data.reduce((sum, order) => sum + order.totalAmount, 0);
          setSpent(totalExp);
        }
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [userId, role]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 w-full animate-fade-in relative">
       {/* Ambient Global Glow */}
       <div className={`absolute top-0 right-0 w-96 h-96 opacity-10 blur-[100px] rounded-full pointer-events-none ${isAdmin ? 'bg-purple-500' : 'bg-sky-500'}`}></div>

       <div className="mb-10 relative z-10">
          <h1 className="text-4xl font-black text-white">{isAdmin ? "Admin Command Center" : "Your Insights"}</h1>
          <p className="text-slate-400">{isAdmin ? "Global platform analytics and active order streams." : "Monitor your grocery spending and order history."}</p>
       </div>

       {isAdmin ? <AdminPanel orders={orders} /> : <ConsumerPanel orders={orders} spent={spent} />}

    </div>
  );
}

// ============================================
// ADMIN COMMAND CENTER (GLOBAL METRICS)
// ============================================
function AdminPanel({ orders }) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const successfulOrders = orders.filter(o => o.status === "SUCCESS" || o.status === "DELIVERED");
  const avgOrderValue = successfulOrders.length > 0 ? (totalRevenue / successfulOrders.length).toFixed(0) : 0;

  return (
    <div className="flex flex-col gap-8 relative z-10">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 group-hover:scale-110 transition-transform">📈</div>
             <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-2">Total Platform Revenue</p>
             <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-rose-400">₹{totalRevenue.toLocaleString()}</h2>
          </div>
          <div className="bg-slate-800 p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 group-hover:-rotate-12 transition-transform">📦</div>
             <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-2">Total Gross Orders</p>
             <h2 className="text-5xl font-black text-white">{orders.length}</h2>
          </div>
          <div className="bg-slate-800 p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 group-hover:translate-x-2 transition-transform">🎯</div>
             <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-2">Avg. Order Value</p>
             <h2 className="text-5xl font-black text-white">₹{avgOrderValue}</h2>
          </div>
       </div>

        <div className="bg-slate-800 rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] pointer-events-none"></div>
           <h3 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
              <span className="text-2xl">📑</span> Recent Global Transactions
           </h3>
           <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/10 text-slate-500 text-[11px] tracking-[0.2em] uppercase font-black">
                       <th className="pb-4 pl-4 font-black">Order ID</th>
                       <th className="pb-4 font-black">Gateway</th>
                       <th className="pb-4 font-black">Status</th>
                       <th className="pb-4 pr-4 font-black text-right">Amount</th>
                    </tr>
                 </thead>
                 <tbody className="text-white text-sm">
                    {orders.slice().reverse().slice(0, 10).map((order) => (
                       <tr key={order._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                          <td className="py-5 pl-4 font-mono text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                          <td className="py-5 font-medium text-slate-300">{order.paymentMethod}</td>
                          <td className="py-5">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${order.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : order.status === 'FAILED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                {order.status}
                             </span>
                          </td>
                          <td className="py-5 pr-4 font-black text-right text-base">₹{order.totalAmount}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {orders.length === 0 && <p className="text-center text-slate-500 py-20 font-medium">No active streams detected. Re-syncing...</p>}
           </div>
        </div>
     </div>
  );
}

// ============================================
// CONSUMER DASHBOARD (PERSONAL WALLET)
// ============================================
function ConsumerPanel({ orders, spent }) {
  const budget = 5000;
  const percentage = Math.min((spent / budget) * 100, 100);
  const color = percentage > 85 ? 'bg-rose-500' : percentage > 60 ? 'bg-amber-400' : 'bg-sky-500';
  const shadow = percentage > 85 ? 'shadow-rose-500/50' : percentage > 60 ? 'shadow-amber-400/50' : 'shadow-sky-500/50';

  // Extract real purchased items to find Top Purchases
  const purchasedItems = orders.flatMap(order => order.items || []);
  const topItemsMap = {};
  purchasedItems.forEach(item => {
      topItemsMap[item.name] = (topItemsMap[item.name] || 0) + (item.quantity || 1);
  });
  const topItemsList = Object.entries(topItemsMap).sort((a,b) => b[1] - a[1]).slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 items-start">
       <div className="bg-slate-800 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl col-span-1 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full group-hover:bg-sky-500/10 transition-colors duration-700"></div>
          <div className="flex justify-between items-start mb-12 relative z-10">
             <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                   <span className="w-12 h-12 flex items-center justify-center bg-slate-900 rounded-2xl border border-white/10 shadow-2xl text-xl">💳</span> 
                   Monthly Spending
                </h3>
             </div>
             <span className="text-[10px] font-black text-sky-400 px-4 py-1.5 bg-sky-500/10 rounded-full border border-sky-500/20 tracking-widest uppercase">Live Tracking</span>
          </div>

          <div className="flex flex-col sm:flex-row items-baseline gap-3 mb-12 relative z-10">
             <div className="flex flex-col">
                <span className="text-slate-500 font-black mb-2 uppercase tracking-[0.2em] text-[10px]">Utilized Capital</span>
                <span className="text-6xl font-black text-white tracking-tighter shadow-sky-500/10 drop-shadow-2xl">₹{spent.toLocaleString()}</span>
             </div>
             <span className="text-2xl text-slate-600 font-bold">/ ₹{budget.toLocaleString()}</span>
          </div>

          <div className="w-full bg-slate-900/60 h-8 rounded-2xl overflow-hidden border border-white/5 relative z-10 shadow-inner p-1">
             <div 
                className={`h-full rounded-xl ${color} ${shadow} shadow-2xl transition-all duration-1000 ease-out flex items-center justify-end pr-4`}
                style={{ width: `${percentage}%` }}
             >
                {percentage > 10 && <span className="text-[11px] font-black text-slate-900 tracking-tighter">{Math.round(percentage)}%</span>}
             </div>
          </div>
       </div>

       <div className="bg-slate-800 rounded-3xl p-6 border border-white/5 shadow-2xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Your Top Purchases</h3>
          <div className="flex-1 flex flex-col gap-3">
             {topItemsList.length > 0 ? topItemsList.map(([name, qty], idx) => (
                <div key={idx} className="flex justify-between items-center text-sm p-4 bg-slate-900/50 rounded-2xl border border-white/5 transition-colors hover:bg-slate-900">
                   <span className="text-slate-300 truncate max-w-[180px]">{name}</span>
                   <span className="font-bold text-sky-400 bg-sky-500/10 px-2 py-1 rounded-lg">x{qty}</span>
                </div>
             )) : (
                <div className="text-center p-6 text-slate-500 text-sm">No purchase history yet. Start shopping!</div>
             )}
          </div>
       </div>
    </div>
  );
}
