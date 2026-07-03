// frontend/src/pages/Products.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import AddToCartBtn from '../components/AddToCartBtn';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Products(){
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const remove = async (id) => {
    if(!confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) return;
    try {
      await API.delete(`/products/${id}`);
      fetch();
      alert('Product deleted permanently');
    } catch (err) {
      console.error('Delete product failed', err?.response?.data || err);
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  // called when AddToCartBtn finishes adding
  const onAddedToCart = () => {
    // small toast/refresh behavior — currently we just refetch to update stock if needed
    fetch();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📦 Products
          </h1>
          <p className="text-gray-600 text-lg">Manage your inventory items with ease</p>
        </div>
        <div className="relative">
          <Link to="/products/add">
            <Button variant="primary" size="lg" className="flex items-center gap-2 shadow-lg hover:shadow-xl">
              ➕ Add Product
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 font-medium">⏳ Loading products...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(p => (
            <Card key={p.product_id} variant="gradient" className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] border-0">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                  {p.product_name}
                </h3>
                <p className="text-sm text-gray-600 flex flex-wrap gap-2">
                  {p.brand_name && (
                    <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-300">
                      🏷️ {p.brand_name}
                    </span>
                  )}
                  {p.category_name && (
                    <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-300">
                      📂 {p.category_name}
                    </span>
                  )}
                  {p.provider_name && (
                    <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-medium border border-purple-300">
                      🚚 {p.provider_name}
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    💰 ₹{Number(p.price).toFixed(2)}
                  </p>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    p.stock < 5 ? 'bg-red-100 text-red-800 border border-red-300' :
                    p.stock < 10 ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                    'bg-green-100 text-green-800 border border-green-300'
                  }`}>
                    📦 {p.stock} {p.stock < 5 && '⚠️'}
                  </div>
                </div>
                {p.description && (
                  <p className="text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
                    {p.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => remove(p.product_id)}
                  className="flex items-center gap-2 flex-1 justify-center"
                >
                  🗑️ Delete
                </Button>
                {user ? (
                  <AddToCartBtn productId={p.product_id} stock={p.stock} onAdded={onAddedToCart} />
                ) : (
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 w-full">
                      🔐 Login to add
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
