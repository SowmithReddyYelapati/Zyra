import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password });
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed. Email might exist.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center px-4 animate-fade-in relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-2xl p-10 rounded-3xl border border-white/5 shadow-2xl relative z-10">
        <div className="text-center mb-10">
           <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Create Account</h2>
           <p className="text-sm text-slate-400">Join Zyra to access AI-powered grocery shopping.</p>
        </div>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Full Name</label>
             <input type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 placeholder:text-slate-600 shadow-inner" 
                placeholder="John Doe" />
          </div>
          <div className="flex flex-col gap-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 placeholder:text-slate-600 shadow-inner" 
                placeholder="name@example.com" />
          </div>
          <div className="flex flex-col gap-2 mb-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Password</label>
             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 placeholder:text-slate-600 shadow-inner" 
                placeholder="••••••••" />
          </div>
          
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-sm tracking-wide uppercase py-4 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transform hover:-translate-y-1 active:scale-95 transition-all duration-300">
            Join Now →
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
           Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">Log in back</Link>
        </p>
      </div>
    </div>
  );
}
export default Register;