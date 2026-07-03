import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    setLoading(true);
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      const { data } = await API.get('/cart');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch cart', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) throw new Error('Not authenticated');
    await API.post('/cart/add', { product_id: productId, quantity });
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    // Immediately clear local state for instant UI update
    setItems([]);
    try {
      await API.post('/cart/clear');
    } catch (err) {
      console.error('Failed to clear cart on server', err);
      // If server clear fails, refetch to restore correct state
      await fetchCart();
    }
  };

  const removeFromCart = async (cart_id) => {
    if (!user) return;
    await API.post('/cart/remove', { cart_id });
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ items, loading, fetchCart, addToCart, clearCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
