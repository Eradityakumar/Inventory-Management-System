// frontend/src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AddToCartBtn from './AddToCartBtn';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Card from './Card';
import Button from './Button';

export default function ProductCard({ product, onRemoved, onAdded }) {
  const { user } = useContext(AuthContext);
  // product fields: product_id, product_name, price, stock, description, brand_name, category_name
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.product_name}</h3>
        <p className="text-sm text-gray-600 flex flex-wrap gap-1">
          {product.brand_name && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">🏷️ {product.brand_name}</span>}
          {product.category_name && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">📂 {product.category_name}</span>}
          {product.provider_name && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">🚚 {product.provider_name}</span>}
        </p>
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-lg font-semibold text-green-600">💰 ₹{Number(product.price).toFixed(2)}</p>
        <p className={`text-sm font-medium ${product.stock < 5 ? 'text-red-600' : 'text-gray-700'}`}>
          📦 Stock: {product.stock} {product.stock < 5 && '⚠️'}
        </p>
        {product.description && <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{product.description}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemoved(product.product_id)}
          className="flex items-center gap-1"
        >
          🗑️ Delete
        </Button>
        {/* Add to cart button — only for authenticated users */}
        {user ? (
          <AddToCartBtn productId={product.product_id} stock={product.stock} onAdded={onAdded} />
        ) : (
          <Link to="/login">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              🔐 Login to add
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
