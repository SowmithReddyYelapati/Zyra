import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: "🎙️", title: "Voice Shopping", desc: "Add items hands-free with AI speech recognition" },
    { icon: "📷", title: "Visual Search", desc: "Snap a photo to find matching products instantly" },
    { icon: "🔁", title: "Smart Reorder", desc: "AI predicts what you need before you run out" },
    { icon: "💳", title: "Fast Checkout", desc: "UPI, card, or cash on delivery in seconds" },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 overflow-hidden py-16 md:py-24">
      {/* Ambient Glows - Balanced */}
      <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-sky-600/10 blur-[130px] rounded-full pointer-events-none animate-pulse duration-[8s]"></div>
      <div className="absolute bottom-[10%] right-[15%] w-[600px] h-[600px] bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none"></div>

      {/* Hero Content */}
      <div className="max-w-4xl w-full text-center relative z-10 animate-fade-in-up">
        {/* Live badge - Centered & Polished */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-800/80 border border-white/10 mb-10 shadow-2xl backdrop-blur-md">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.8)]"></span>
          </span>
          <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">AI-Powered Shopping Active</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95] text-white">
          Smarter grocery,<br className="hidden md:block" />
          <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            faster delivery.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Experience the future of shopping. Voice commands, visual search, and AI reorder predictions all built into one seamless platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button
            onClick={() => navigate("/products")}
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center gap-4 px-12 py-5 rounded-2xl font-bold text-lg shadow-[0_0_50px_rgba(14,165,233,0.3)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 group"
          >
            Explore Market <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-2 px-12 py-5 rounded-2xl font-bold text-lg border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Feature Cards Grid - Perfectly Symmetrical */}
      <div className="relative z-10 w-full max-w-5xl mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up [animation-delay:200ms]">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-4 p-7 bg-slate-800/40 backdrop-blur-sm border border-white/5 rounded-[2rem] hover:border-sky-500/30 hover:bg-slate-800/60 transition-all duration-300 group shadow-lg">
            <div className="w-16 h-16 flex items-center justify-center bg-slate-900 rounded-2xl border border-white/5 shadow-inner group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-300">
               <span className="text-3xl">{f.icon}</span>
            </div>
            <div>
              <p className="text-white font-black text-sm tracking-wide mb-1">{f.title}</p>
              <p className="text-slate-500 text-xs leading-relaxed font-medium px-2">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Category Section - New */}
      <div className="relative z-10 w-full max-w-6xl mt-32 animate-fade-in-up [animation-delay:400ms]">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-white mb-2">Shop by Category</h2>
            <p className="text-slate-500 font-medium">Explore our curated aisles for your daily needs.</p>
          </div>
          <button 
            onClick={() => navigate("/products")}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-2xl border border-sky-500/20 transition-all"
          >
            View All Aisles
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: "Dairy", icon: "🥛", color: "from-blue-500/20" },
            { name: "Bakery", icon: "🥐", color: "from-amber-500/20" },
            { name: "Fruits", icon: "🍎", color: "from-rose-500/20" },
            { name: "Vegetables", icon: "🥦", color: "from-emerald-500/20" },
            { name: "Snacks", icon: "🍿", color: "from-purple-500/20" },
            { name: "Beverages", icon: "🥤", color: "from-cyan-500/20" }
          ].map((cat, i) => (
            <div 
              key={i}
              onClick={() => navigate(`/products?category=${cat.name}`)}
              className={`group flex flex-col items-center gap-4 p-8 bg-gradient-to-b ${cat.color} to-slate-800/40 border border-white/5 rounded-[2.5rem] cursor-pointer hover:border-sky-500/30 hover:-translate-y-2 transition-all duration-300 shadow-xl`}
            >
              <span className="text-4xl group-hover:scale-125 transition-transform">{cat.icon}</span>
              <span className="text-white font-bold text-sm tracking-wide">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}