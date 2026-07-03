import React from 'react';

export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl'
  };
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl focus:ring-indigo-500',
    secondary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl focus:ring-amber-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl focus:ring-red-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl focus:ring-green-500',
    ghost: 'bg-transparent text-slate-700 hover:bg-white/80 hover:text-slate-900 border border-slate-300 hover:border-slate-400 focus:ring-slate-500',
    outline: 'bg-transparent border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-600 focus:ring-indigo-500'
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
