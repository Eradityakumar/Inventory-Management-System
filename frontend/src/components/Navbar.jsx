import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50 animate-slide-up backdrop-blur-md bg-opacity-95 border-b border-white/20">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* Logo / App name */}
        <Link to="/" className="text-3xl font-bold text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            📦
          </div>
          <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            Inventory
          </span>
        </Link>

        {/* Right side navigation */}
        <div className="flex items-center gap-8">

          {/* Links when logged in */}
          {user && (
            <>
              <Link
                to="/"
                className="text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm flex items-center gap-2"
              >
                🏠 Dashboard
              </Link>
              <Link
                to="/products"
                className="text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm flex items-center gap-2"
              >
                📦 Products
              </Link>

              <Link
                to="/brands"
                className="text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm flex items-center gap-2"
              >
                🏷️ Brands
              </Link>

              <Link
                to="/categories"
                className="text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm flex items-center gap-2"
              >
                📂 Categories
              </Link>

              <Link
                to="/providers"
                className="text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm flex items-center gap-2"
              >
                🚚 Providers
              </Link>

              <Link
                to="/cart"
                className="text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm flex items-center gap-2 relative"
              >
                🛒 Cart
                {items?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {items.length}
                  </span>
                )}
              </Link>
              <Link
                to="/invoices"
                className="text-white hover:text-yellow-200 transition-all duration-300 transform hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm flex items-center gap-2"
              >
                📄 Invoices
              </Link>

              {/* User Name */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-yellow-200 text-sm">
                  👤 <strong>{user.username}</strong>
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/20"
              >
                🚪 Logout
              </button>
            </>
          )}

          {/* Links when logged OUT */}
          {!user && (
            <>
              <Link
                to="/login"
                className="px-6 py-3 text-white rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 hover:border-white/50 shadow-lg flex items-center gap-2 font-medium"
              >
                🔐 Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/20 flex items-center gap-2 font-medium"
              >
                📝 Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
