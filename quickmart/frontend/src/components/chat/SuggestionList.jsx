import React from 'react';
import { useCart } from '../../context/CartContext';

export default function SuggestionList({ suggestions }) {
  const { addToCart } = useCart();

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '10px',
      alignItems: 'flex-start'
    }}>
      {suggestions.map(item => (
        <div 
          key={item._id}
          onClick={() => addToCart(item)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            padding: '8px 12px',
            cursor: 'pointer',
            width: '85%',
            transition: 'transform 0.2s, background 0.2s',
          }}
          onMouseOver={(e) => {
             e.currentTarget.style.transform = 'scale(1.02)';
             e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
          onMouseOut={(e) => {
             e.currentTarget.style.transform = 'scale(1)';
             e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
          }}
          title="Add this suggestion to cart"
        >
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹{item.price}</p>
          </div>
          <div style={{
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            +
          </div>
        </div>
      ))}
    </div>
  );
}
