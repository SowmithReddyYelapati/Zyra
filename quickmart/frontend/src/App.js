import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from "./context/CartContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="bg-slate-900 min-h-screen text-slate-100 font-sans antialiased selection:bg-sky-500/30 flex flex-col">
           <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)' } }} />
           <Navbar />
           <main className="flex-1 w-full">
             <Routes>
               <Route path="/" element={<Navigate to="/home" />} />
               <Route path="/home" element={<Home />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/products" element={<Products />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/checkout" element={<Checkout />} />
               <Route path="/payment" element={<Payment />} />
               <Route path="/profile" element={<Profile />} />
             </Routes>
           </main>
           <Footer />
           <ChatWidget />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;