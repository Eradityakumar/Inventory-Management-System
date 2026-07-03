import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Brands from './pages/Brands';
import Providers from './pages/Providers';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Invoice from './pages/Invoice';
import Invoices from './pages/Invoices';

import Navbar from './components/Navbar';
import { AuthContext } from './context/AuthContext';

/**
 * Protected route wrapper
 * If user not logged in, redirect to /login
 */
const Protected = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>
      <Navbar />
      <main className="container mx-auto p-6 animate-fade-in relative z-10">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected / App */}
          <Route
            path="/"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="/products"
            element={
              <Protected>
                <Products />
              </Protected>
            }
          />
          <Route
            path="/products/add"
            element={
              <Protected>
                <AddProduct />
              </Protected>
            }
          />
          <Route
            path="/brands"
            element={
              <Protected>
                <Brands />
              </Protected>
            }
          />
          <Route
            path="/categories"
            element={
              <Protected>
                <Categories />
              </Protected>
            }
          />
          <Route
            path="/providers"
            element={
              <Protected>
                <Providers />
              </Protected>
            }
          />
          <Route
            path="/cart"
            element={
              <Protected>
                <Cart />
              </Protected>
            }
          />
          <Route
            path="/invoices"
            element={
              <Protected>
                <Invoices />
              </Protected>
            }
          />
          <Route
            path="/invoice/:id"
            element={
              <Protected>
                <Invoice />
              </Protected>
            }
          />

          {/* Fallback — redirect unknown routes to dashboard if logged in, otherwise to /login */}
          <Route
            path="*"
            element={
              <Protected>
                <Navigate to="/" replace />
              </Protected>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
