import React from 'react';

const ComingSoon = ({ title = 'Feature', description = 'This feature is under development.' }) => {
  return (
    <div className="coming-soon" style={{
      padding: '40px',
      textAlign: 'center',
      background: '#0b132b',
      color: '#e0e6f6',
      borderRadius: '12px',
      border: '1px solid #243b55'
    }}>
      <h2 style={{ margin: '0 0 12px' }}>{title}</h2>
      <p style={{ opacity: 0.9, margin: 0 }}>{description}</p>
    </div>
  );
};

export default ComingSoon;


