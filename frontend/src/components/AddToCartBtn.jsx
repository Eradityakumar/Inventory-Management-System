// frontend/src/components/AddToCartBtn.jsx
import React, { useState, useContext } from 'react';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import Button from './Button';

export default function AddToCartBtn({ productId, stock = 999, onAdded }) {
  const [loading, setLoading] = useState(false);
  const cartCtx = useContext(CartContext);

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock < 5;

  const add = async () => {
    if (isOutOfStock) return;

    try {
      setLoading(true);
      // Prefer using CartContext if provider is present to update local state/counts
      if (cartCtx && cartCtx.addToCart) {
        await cartCtx.addToCart(productId, 1);
      } else {
        await API.post('/cart/add', { product_id: productId, quantity: 1 });
      }
      if (onAdded) onAdded();
      // small user feedback
      alert('Added to cart');
    } catch (err) {
      console.error('Add to cart failed', err);
      alert(err?.response?.data?.message || 'Add to cart failed');
    } finally {
      setLoading(false);
    }
  };

  if (isOutOfStock) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="opacity-60 cursor-not-allowed"
      >
        ❌ Out of Stock
      </Button>
    );
  }

  return (
    <Button
      variant={isLowStock ? "secondary" : "success"}
      size="sm"
      onClick={add}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? '⏳ Adding…' : `🛒 Add to Cart ${isLowStock ? '(Low Stock)' : ''}`}
    </Button>
  );
}
