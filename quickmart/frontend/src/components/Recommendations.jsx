import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';

const suggestionMap = {
  milk: ["bread", "eggs", "cornflakes", "sugar"],
  maggi: ["sauce", "vegetables", "chips", "ketchup", "coke"],
  bread: ["butter", "jam", "eggs", "cheese", "milk"],
  eggs: ["bread", "butter", "milk", "bacon"],
  coffee: ["sugar", "biscuits", "milk"],
  tea: ["biscuits", "sugar", "milk"],
  cola: ["chips", "pizza", "burger", "fries"],
  pizza: ["cola", "chips", "ketchup", "garlic bread"],
  burger: ["cola", "fries", "ketchup"],
  chips: ["cola", "soda", "dip"],
};

export default function Recommendations({ products }) {
  const { cart, addToCart } = useCart();

  const recommendedItems = useMemo(() => {
    if (!cart || cart.length === 0) return [];

    let suggestions = [];
    
    // Aggregate all suggestions based on items currently in cart
    cart.forEach(cartItem => {
      // Basic matching. e.g. "Amul Milk" -> includes "milk"
      const name = cartItem.name.toLowerCase();
      const matchedKey = Object.keys(suggestionMap).find(key => name.includes(key));
      
      if (matchedKey) {
        suggestions = [...suggestions, ...suggestionMap[matchedKey]];
      }
    });

    // Remove duplicates from aggregated suggestions
    const uniqueSuggestionNames = [...new Set(suggestions)];

    // Map string names back to actual products from the database
    const finalProducts = [];
    uniqueSuggestionNames.forEach(suggestedName => {
      const match = products.find(p => p.name.toLowerCase().includes(suggestedName));
      
      // Ensure product exists and is NOT already in the cart
      if (match && !cart.some(c => c._id === match._id)) {
         finalProducts.push(match);
      }
    });

    // Provide top 4 recommendations to keep the UI clean
    return finalProducts.slice(0, 4); 
  }, [cart, products]);

  if (recommendedItems.length === 0) return null;

  return (
    <div className="recommendations" style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--text-muted)' }}>✨ Recommended for you</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {recommendedItems.map(item => (
          <div 
            key={item._id} 
            className="sidebar-item" 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px',
              cursor: 'pointer',
              border: '1px dashed var(--glass-border)',
              transition: 'background 0.3s ease'
            }}
            onClick={() => addToCart(item)}
            title="Click to add this suggestion to your cart"
          >
            <div>
              <p style={{ fontSize: '0.9rem', marginBottom: '4px', fontWeight: '500' }}>{item.name}</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹{item.price}</span>
            </div>
            <button 
               onClick={(e) => {
                 e.stopPropagation(); // prevent double clicking if parent is clicked
                 addToCart(item);
               }}
               style={{ 
                 background: 'var(--primary)', border: 'none', 
                 borderRadius: '50%', width: '28px', height: '28px', 
                 color: '#fff', cursor: 'pointer',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontSize: '1rem', fontWeight: 'bold',
                 transition: 'transform 0.2s ease'
               }}
               onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
               onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
               +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
