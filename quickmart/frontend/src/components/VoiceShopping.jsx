import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function VoiceShopping({ products }) {
  const { cart, addToCart } = useCart();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return (
      <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl border border-rose-500/20 text-sm">
         ❌ Voice shopping not supported in this browser. Try Chrome.
      </div>
    );
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  const startListening = () => {
    setFeedback('');
    setTranscript('');
    try { recognition.start(); setIsListening(true); } catch(err) { console.error(err); }
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    setTranscript(text); processCommand(text); setIsListening(false);
  };
  recognition.onerror = () => { setIsListening(false); setFeedback('Could not detect speech. Please try again.'); };
  recognition.onend = () => setIsListening(false);

  const processCommand = (text) => {
    let addedItems = [];
    products.forEach(p => {
       const pName = p.name.toLowerCase();
       if (text.includes(pName)) {
           if (!cart.find(c => c._id === p._id)) {
              addToCart(p); addedItems.push(p.name);
           }
       }
    });

    if (addedItems.length > 0) setFeedback(`✅ Added: ${addedItems.join(', ')}`);
    else setFeedback(`🤷 No matches found for: "${text}"`);
  };

  return (
    <div className="bg-slate-800 rounded-3xl p-6 border border-white/5 h-full flex flex-col shadow-xl">
       <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 text-xl">🎙️</span>
          <h4 className="text-lg font-bold text-sky-400">Voice Cart</h4>
       </div>

       <p className="text-sm text-slate-400 mb-6 flex-1">
          Say <span className="text-slate-200">"I need milk and bread"</span> to instantly add items.
       </p>

       <div className="flex items-center gap-4 mt-auto">
           <button 
             onClick={startListening}
             disabled={isListening}
             className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${isListening ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-slate-700 text-sky-400 hover:bg-sky-500 hover:text-slate-900 border border-white/10'}`}
           >
             {isListening ? '🎧' : '🎤'}
           </button>
           
           <div className="flex flex-col">
              {isListening && <span className="text-rose-400 text-sm font-semibold animate-pulse">Listening...</span>}
              {transcript && !isListening && <span className="text-slate-500 text-xs truncate max-w-[150px]">Heard: {transcript}</span>}
              {feedback && !isListening && <span className="text-sm font-medium text-slate-200 mt-1 line-clamp-2">{feedback}</span>}
           </div>
       </div>
    </div>
  );
}
