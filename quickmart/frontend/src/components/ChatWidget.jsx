import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hey! What groceries are you looking for today?", isBot: true }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { addToCart } = useCart();
  const messagesEndRef = useRef(null);

  const keywords = {
    "breakfast": [{ _id: "b1", name: "Bread", price: 40 }, { _id: "b2", name: "Milk", price: 60 }, { _id: "b3", name: "Eggs", price: 80 }],
    "snack": [{ _id: "s1", name: "Potato Chips", price: 20 }, { _id: "s2", name: "Biscuits", price: 30 }],
    "fruits": [{ _id: "f1", name: "Apples", price: 150 }, { _id: "f2", name: "Bananas", price: 60 }]
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = () => {
    if(!input.trim()) return;
    const userMsg = input.toLowerCase();
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let found = false;
      Object.keys(keywords).forEach(key => {
        if(userMsg.includes(key)) {
           setMessages(prev => [...prev, { 
             text: `I found some great ${key} items for you!`, 
             isBot: true,
             suggestions: keywords[key]
           }]);
           found = true;
        }
      });

      if(!found) {
        setMessages(prev => [...prev, { 
          text: "I couldn't find exactly that. Try asking for 'breakfast', 'snack', or 'fruits'.", 
          isBot: true 
        }]);
      }
      setIsTyping(false);
    }, 1000);
  };

  if(!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-sky-500 hover:bg-sky-400 text-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(14,165,233,0.5)] transform hover:scale-110 transition-all z-[999] hover:rotate-12"
      >
        <span className="text-3xl">🤖</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-96 max-w-[90vw] h-[550px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl z-[999] flex flex-col overflow-hidden animate-fade-in">
       {/* Header */}
       <div className="bg-slate-800 p-4 border-b border-white/5 flex justify-between items-center px-6">
         <div className="flex items-center gap-3">
           <span className="bg-sky-500/20 text-sky-400 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner border border-sky-500/30">🤖</span>
           <div>
             <h3 className="font-bold text-white text-lg leading-tight">Zyra Copilot</h3>
             <span className="text-xs text-sky-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> Online</span>
           </div>
         </div>
         <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700">✕</button>
       </div>

       {/* Messages */}
       <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-slate-900/50">
         {messages.map((m, i) => (
           <div key={i} className={`flex flex-col max-w-[85%] ${m.isBot ? "self-start" : "self-end"}`}>
             <div className={`p-4 rounded-2xl shadow-sm text-sm ${m.isBot ? "bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5" : "bg-sky-500 text-slate-900 rounded-tr-sm font-medium"}`}>
               {m.text}
             </div>
             
             {/* Product Suggestions Rendering */}
             {m.suggestions && (
               <div className="mt-2 flex flex-col gap-2">
                 {m.suggestions.map(s => (
                   <div key={s._id} className="bg-slate-800 border border-white/5 p-3 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white">{s.name}</span>
                        <span className="text-xs text-green-400">₹{s.price}</span>
                      </div>
                      <button 
                        onClick={() => addToCart(s)}
                        className="bg-sky-500 hover:bg-sky-400 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        Add
                      </button>
                   </div>
                 ))}
               </div>
             )}
           </div>
         ))}
         
         {isTyping && (
           <div className="self-start bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1 items-center w-16 shadow-sm">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
           </div>
         )}
         <div ref={messagesEndRef} />
       </div>

       {/* Input */}
       <div className="p-4 bg-slate-800 border-t border-white/5 flex gap-2 w-full">
         <input 
           type="text" 
           value={input} 
           onChange={e => setInput(e.target.value)}
           onKeyPress={e => e.key === 'Enter' && handleSend()}
           placeholder="I need something sweet..." 
           className="flex-1 bg-slate-900 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
         />
         <button onClick={handleSend} className="bg-sky-500 hover:bg-sky-400 text-slate-900 p-3 w-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md transform hover:scale-105 active:scale-95 transition-all">
           ↑
         </button>
       </div>
    </div>
  );
}
