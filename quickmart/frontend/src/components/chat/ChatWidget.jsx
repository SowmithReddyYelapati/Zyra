import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API from '../../services/api';
import MessageBubble from './MessageBubble';
import SuggestionList from './SuggestionList';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi there! 👋 I am your AI Shopping Assistant. Looking for breakfast ideas, healthy snacks, or specific items?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch products once to enable fast, seamless local keyword matching
    API.get("/api/products")
      .then(res => setAllProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Scroll to bottom seamlessly whenever messages are added
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Expandable rule-based NLP dictionary
  const rulesMap = {
    breakfast: ['milk', 'bread', 'eggs', 'cornflakes', 'oats'],
    dinner: ['rice', 'dal', 'paneer', 'vegetables', 'chicken', 'roti'],
    lunch: ['rice', 'dal', 'paneer', 'vegetables', 'chicken'],
    snacks: ['chips', 'biscuits', 'soft drinks', 'cola', 'soda'],
    healthy: ['fruits', 'oats', 'juice', 'milk', 'eggs', 'vegetables'],
    fastfood: ['pizza', 'burger', 'chips', 'cola'],
    spicy: ['sauce', 'maggi']
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI network request processing time
    setTimeout(() => {
      const lowerInput = userText.toLowerCase();
      let matchedKeywords = [];

      // Pattern matching across our defined NLP rules
      Object.entries(rulesMap).forEach(([ruleKey, targets]) => {
         if (lowerInput.includes(ruleKey)) {
            matchedKeywords = [...matchedKeywords, ...targets];
         }
      });

      // Fallback: If no explicit category matched, search for direct product names
      if (matchedKeywords.length === 0) {
         allProducts.forEach(p => {
           if (lowerInput.includes(p.name.toLowerCase())) {
              matchedKeywords.push(p.name.toLowerCase());
           }
         });
      }

      if (matchedKeywords.length > 0) {
        // Find corresponding products in our active database
        const uniqueKeys = [...new Set(matchedKeywords)];
        const matchedProducts = [];
        uniqueKeys.forEach(key => {
           const found = allProducts.find(p => p.name.toLowerCase().includes(key));
           if (found && !matchedProducts.includes(found)) {
              matchedProducts.push(found);
           }
        });

        if (matchedProducts.length > 0) {
           setMessages(prev => [
             ...prev, 
             { id: Date.now() + 1, sender: 'bot', text: `I found some great options for that! Here are my recommendations:` },
             { id: Date.now() + 2, sender: 'bot', suggestions: matchedProducts.slice(0, 4) }
           ]);
        } else {
           setMessages(prev => [
             ...prev, 
             { id: Date.now() + 1, sender: 'bot', text: `Sorry, we don't seem to have exactly that in stock right now.` }
           ]);
        }
      } else {
        setMessages(prev => [
          ...prev, 
          { id: Date.now() + 1, sender: 'bot', text: `I'm not quite sure about that. Try asking for "breakfast", "dinner", or "healthy snacks"!` }
        ]);
      }
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        title="Open AI Shopping Assistant"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--secondary), var(--secondary-hover))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(34, 197, 94, 0.4)',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '24px',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(90deg) scale(0)' : 'rotate(0deg) scale(1)'
        }}
      >
        💬
      </div>

      <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '350px',
          height: '500px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          zIndex: 10000,
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease',
          transformOrigin: 'bottom right',
          transform: isOpen ? 'scale(1)' : 'scale(0)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
           padding: '15px 20px', 
           borderBottom: '1px solid var(--glass-border)', 
           display: 'flex', 
           justifyContent: 'space-between', 
           alignItems: 'center',
           background: 'rgba(0,0,0,0.3)',
        }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>AI Assistant</h3>
           </div>
           <button 
             onClick={() => setIsOpen(false)}
             style={{ 
               background: 'transparent', border: 'none', color: 'var(--text-main)', 
               fontSize: '1.5rem', cursor: 'pointer', transition: 'color 0.2s', padding: '0 5px'
             }}
             onMouseOver={(e) => e.target.style.color = 'var(--primary)'}
             onMouseOut={(e) => e.target.style.color = 'var(--text-main)'}
           >
             &times;
           </button>
        </div>

        {/* Chat Messages Log */}
        <div style={{
           flex: 1,
           padding: '15px',
           overflowY: 'auto',
           display: 'flex',
           flexDirection: 'column'
        }}>
           {messages.map(msg => (
             <React.Fragment key={msg.id}>
               {msg.text && <MessageBubble message={msg} />}
               {msg.suggestions && <SuggestionList suggestions={msg.suggestions} />}
             </React.Fragment>
           ))}
           {isTyping && (
             <div style={{
                color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '10px', fontStyle: 'italic', marginBottom: '10px',
                animation: 'pulse 1.5s infinite'
             }}>
                Bot is typing...
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* User Input Area */}
        <div style={{ 
           padding: '15px', 
           borderTop: '1px solid var(--glass-border)',
           display: 'flex',
           gap: '10px',
           background: 'rgba(0,0,0,0.1)'
        }}>
           <input 
             type="text" 
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
             placeholder="Need breakfast ideas?"
             style={{
               flex: 1,
               background: 'rgba(0,0,0,0.3)',
               border: '1px solid var(--glass-border)',
               borderRadius: '10px',
               padding: '10px 15px',
               color: 'var(--text-main)',
               outline: 'none',
               fontSize: '0.95rem'
             }}
           />
           <button 
             onClick={handleSend}
             style={{
               background: 'linear-gradient(135deg, var(--secondary), var(--secondary-hover))',
               border: 'none',
               borderRadius: '10px',
               padding: '10px 18px',
               color: 'white',
               fontWeight: 'bold',
               cursor: 'pointer',
               boxShadow: '0 4px 15px rgba(34, 197, 94, 0.25)',
               transition: 'transform 0.2s ease'
             }}
             onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
             onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
           >
             Send
           </button>
        </div>
      </div>
    </>
  );
}
