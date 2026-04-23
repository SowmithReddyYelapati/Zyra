import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMode, setLoginMode] = useState("user");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mock portfolio bypass if they don't have a DB admin configured
      if (loginMode === "admin" && email === "admin@zyra.com") {
         toast.success("Admin Authorization Granted", { icon: '🛡️' });
         localStorage.setItem("token", "dummy_admin_jwt");
         localStorage.setItem("role", "admin");
         localStorage.setItem("userEmail", email);
         localStorage.setItem("userName", email.split("@")[0]);
         window.location.href = "/dashboard";
         return;
      }

      const res = await API.post("/auth/login", { email, password });
      
      // Enforce the Role-Based Redirects
      const assignedRole = res.data.role;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", assignedRole);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", res.data.name || email.split("@")[0]);
      
      if (assignedRole === "admin" || loginMode === "admin") {
         toast.success("Admin Authorization Granted", { icon: '🛡️' });
         // Force local role to admin if selected via UI for demo purposes
         localStorage.setItem("role", "admin");
         window.location.href = "/dashboard";
      } else {
         toast.success("Welcome back to Zyra!", { icon: '👋' });
         window.location.href = "/home";
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Security System: Invalid credentials.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center px-4 animate-fade-in relative overflow-hidden">
      <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none transition-colors duration-700 ${loginMode === 'admin' ? 'bg-purple-500/10' : 'bg-sky-500/10'}`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none transition-colors duration-700 ${loginMode === 'admin' ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}></div>
      
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-2xl p-10 rounded-[2rem] border border-white/5 shadow-2xl relative z-10 transition-all duration-500">
        
        {/* Role Toggle Switch */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl mb-8 border border-white/5 relative z-20">
           <button 
             type="button" 
             onClick={() => setLoginMode("user")}
             className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${loginMode === "user" ? "bg-sky-500 text-slate-900 shadow-md shadow-sky-500/20" : "text-slate-400 hover:text-white"}`}
           >
             Consumer
           </button>
           <button 
             type="button" 
             onClick={() => setLoginMode("admin")}
             className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${loginMode === "admin" ? "bg-purple-500 text-white shadow-md shadow-purple-500/20" : "text-slate-400 hover:text-white"}`}
           >
             Administrator
           </button>
        </div>

        <div className="text-center mb-8">
           <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
             {loginMode === "admin" ? "Command Center" : "Welcome Back"}
           </h2>
           <p className="text-sm text-slate-400">
             {loginMode === "admin" ? "Access corporate analytics and overrides." : "Enter your credentials to access your smart cart."}
           </p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-300 placeholder:text-slate-600 shadow-inner" 
                placeholder="name@example.com" />
          </div>
          <div className="flex flex-col gap-2 mb-2">
             <div className="flex justify-between items-center pl-1 pr-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <span className="text-xs text-sky-400 font-semibold cursor-pointer hover:underline">Forgot?</span>
             </div>
             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-300 placeholder:text-slate-600 shadow-inner" 
                placeholder="••••••••" />
          </div>
          
          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-slate-900 font-black text-sm tracking-wide uppercase py-4 rounded-2xl shadow-[0_10px_30px_rgba(14,165,233,0.3)] transform hover:-translate-y-1 active:scale-95 transition-all duration-300 flex justify-center items-center gap-2">
            Secure Login 
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
           Don't have an account? <Link to="/register" className="text-sky-400 hover:text-sky-300 transition-colors">Sign up instantly</Link>
        </p>
      </div>
    </div>
  );
}
export default Login;