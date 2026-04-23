import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 border-t border-white/5 py-12 px-6 md:px-12 mt-auto">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6 col-span-1 md:col-span-1">
             <Link to="/home" className="text-3xl font-black bg-gradient-to-br from-sky-400 to-sky-600 bg-clip-text text-transparent w-fit">
               Zyra
             </Link>
             <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
               Next-gen AI grocery shopping experience. Voice command enabled, visual search ready, and predictive reorder logic built-in.
             </p>
             <div className="flex gap-4">
               {['🐦', '📸', '💼', '🐙'].map((icon, i) => (
                 <span key={i} className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl border border-white/5 hover:border-sky-500/30 transition-colors cursor-pointer text-sm">
                   {icon}
                 </span>
               ))}
             </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Marketplace</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'All Products', path: '/products' },
                { label: 'Daily Essentials', path: '/products?category=Staples' },
                { label: 'Fresh Produce', path: '/products?category=Vegetables' },
                { label: 'Personal Care', path: '/products?category=Personal%20Care' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-slate-500 text-sm hover:text-sky-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Account</h4>
            <ul className="flex flex-col gap-3">
              {['Your Profile', 'Order History', 'Dashboards', 'Secure Login'].map(link => (
                <li key={link}>
                  <Link to="/profile" className="text-slate-500 text-sm hover:text-sky-400 transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <div className="flex flex-col gap-4">
               <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                  <p className="text-xs text-slate-400 font-bold mb-1">Status</p>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    All Systems Operational
                  </p>
               </div>
               <p className="text-[10px] text-slate-600 font-medium">Built with React, Node.js, and MongoDB Atlas.</p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-xs text-slate-600 font-medium">© 2026 Zyra Technologies. All rights reserved.</p>
           <div className="flex gap-8">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(link => (
                <span key={link} className="text-[10px] text-slate-600 hover:text-slate-400 cursor-pointer transition-colors uppercase font-bold tracking-widest">
                  {link}
                </span>
              ))}
           </div>
        </div>
      </div>
    </footer>
  );
}
