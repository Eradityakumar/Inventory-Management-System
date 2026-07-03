import React from 'react';

export default function Card({ className = '', children, variant = 'default' }) {
  const variants = {
    default: 'bg-white/90 backdrop-blur-sm border border-white/20',
    gradient: 'bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md border border-white/30',
    glass: 'bg-white/10 backdrop-blur-lg border border-white/20',
    elevated: 'bg-white shadow-2xl border-0'
  };

  return (
    <div className={(`rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${variants[variant]} ${className}`).trim()}>
      {children}
    </div>
  );
}
