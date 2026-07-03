// frontend/src/pages/Cart.jsx
// Project spec (uploaded): /mnt/data/dbprojj8.docx

import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Cart() {
  const [checkingOut, setCheckingOut] = useState(false);
  const nav = useNavigate();
  const { items, loading, fetchCart, clearCart, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (cart_id) => {
    if (!confirm('Remove item from cart?')) return;
    try {
      await removeFromCart(cart_id);
    } catch (err) {
      console.error('Remove failed', err?.response?.data || err);
      alert(err?.response?.data?.message || 'Remove failed');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Clear all items from cart?')) return;
    try {
      await clearCart();
    } catch (err) {
      console.error('Clear cart failed', err?.response?.data || err);
      alert(err?.response?.data?.message || 'Clear cart failed');
    }
  };

  const updateQty = async (cart_id, newQty) => {
    // simple client-side update: remove / re-add pattern or create an endpoint to update quantity.
    // We'll call the add endpoint with positive or negative quantity to adjust, but ideally backend should have update endpoint.
    if (newQty < 1) {
      // remove item if quantity less than 1
      return removeItem(cart_id);
    }
    try {
      // Use the /cart/update endpoint which sets quantity for a cart item.
      await API.post('/cart/update', { cart_id, quantity: newQty });
      // If backend ignores set_quantity flag, implement proper /cart/update endpoint. After change, refresh:
      fetchCart();
    } catch (err) {
      console.error('Update qty failed', err?.response?.data || err);
      alert(err?.response?.data?.message || 'Update quantity failed');
    }
  };

  const checkout = async () => {
    if (!confirm('Proceed to checkout?')) return;
    setCheckingOut(true);
    try {
      const { data } = await API.post('/invoice/checkout', { notes: '' });
      // successful checkout returns invoice_id and total
      if (data?.invoice_id) {
        // Clear the cart in context since backend cleared it
        await clearCart();
        // navigate to invoice view
        nav(`/invoice/${data.invoice_id}`);
      } else {
        // if API returned success but no invoice id, just refresh cart
        fetchCart();
        alert('Checkout completed');
      }
    } catch (err) {
      // show real server message (not generic)
      console.error('Checkout error:', err?.response?.data || err);
      const serverMessage = err?.response?.data?.message || err.message || 'Checkout failed';
      alert(serverMessage);
    } finally {
      setCheckingOut(false);
    }
  };

  const total = items.reduce((sum, it) => {
    const price = Number(it.price || 0);
    const qty = Number(it.quantity || 0);
    return sum + price * qty;
  }, 0);

  return (
    <div>
      <h2 className="text-2xl mb-4">Cart</h2>

      {loading ? (
        <div>Loading cart...</div>
      ) : items.length === 0 ? (
        <div className="card">Your cart is empty.</div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.cart_id} className="card flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{it.product_name}</h3>
                  <div className="text-sm text-slate-600">Price: ₹{Number(it.price).toFixed(2)}</div>
                  <div className="text-sm text-slate-600">Qty: {it.quantity}</div>

                  {/* Optional: quantity controls (if backend supports update) */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQty(it.cart_id, Number(it.quantity) - 1)}
                      className="px-3 py-1 bg-slate-200 rounded"
                    >
                      -
                    </button>
                    <input
                      value={it.quantity}
                      onChange={(e) => {
                        const v = Number(e.target.value || 0);
                        // optimistic local update for UX (but will be overwritten after fetch)
                        setItems((prev) =>
                          prev.map((p) => (p.cart_id === it.cart_id ? { ...p, quantity: v } : p))
                        );
                      }}
                      onBlur={(e) => {
                        const v = Number(e.target.value || 0);
                        if (v < 1) {
                          // restore original from server after blur if invalid
                          fetchCart();
                        } else {
                          updateQty(it.cart_id, v);
                        }
                      }}
                      className="w-16 p-1 border rounded text-center"
                      type="number"
                      min="1"
                    />
                    <button
                      onClick={() => updateQty(it.cart_id, Number(it.quantity) + 1)}
                      className="px-3 py-1 bg-slate-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-sm">Subtotal: ₹{(Number(it.price) * Number(it.quantity)).toFixed(2)}</div>
                  <button
                    onClick={() => removeItem(it.cart_id)}
                    className="px-3 py-2 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="text-lg mb-3">Total: ₹{total.toFixed(2)}</div>
            <div className="flex gap-3">
              <button
                onClick={checkout}
                disabled={checkingOut}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
              >
                {checkingOut ? 'Processing…' : 'Checkout'}
              </button>

              <button onClick={handleClearCart} className="px-4 py-2 bg-amber-500 text-white rounded">
                Clear Cart
              </button>
              <button onClick={() => nav('/invoices')} className="px-4 py-2 bg-indigo-600 text-white rounded">
                View Invoices
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
