import React from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '10px'
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '10px 14px',
        borderRadius: isUser ? '16px 16px 0px 16px' : '16px 16px 16px 0px',
        background: isUser ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
        color: '#fff',
        border: isUser ? 'none' : '1px solid var(--glass-border)',
        fontSize: '0.9rem',
        lineHeight: '1.4'
      }}>
        {message.text}
      </div>
    </div>
  );
}
