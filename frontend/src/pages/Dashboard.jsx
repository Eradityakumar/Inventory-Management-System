import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Dashboard(){
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/dashboard');
      setSummary(data);
    } catch (err) {
      console.error('Load dashboard summary failed', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (!summary) return <Card variant="gradient">❌ Unable to load dashboard summary.</Card>;

  const stockHealth = summary.total_products > 0 ? Math.round((summary.total_products - summary.low_stock_count) / summary.total_products * 100) : 100;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📊 Dashboard Overview
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome back! Here's your inventory at a glance with real-time insights.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="gradient" className="text-center group">
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📦</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {summary.total_products}
          </p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                 style={{width: `${Math.min(100, summary.total_products / 10 * 100)}%`}}></div>
          </div>
        </Card>

        <Card variant="gradient" className="text-center group">
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Low Stock Items</h3>
          <p className="text-4xl font-bold text-red-500">
            {summary.low_stock_count}
          </p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all duration-500 ${
              summary.low_stock_count > 5 ? 'bg-gradient-to-r from-red-500 to-pink-500' :
              summary.low_stock_count > 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-green-500 to-emerald-500'
            }`} style={{width: `${Math.min(100, summary.low_stock_count * 10)}%`}}></div>
          </div>
        </Card>

        <Card variant="gradient" className="text-center group">
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">💰</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Stock Value</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ₹{Number(summary.total_stock_value).toFixed(2)}
          </p>
          <div className="mt-3 text-sm text-gray-600">
            💹 Inventory worth
          </div>
        </Card>

        <Card variant="gradient" className="text-center group">
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Users</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {summary.total_users}
          </p>
          <div className="mt-3 text-sm text-gray-600">
            👤 Team members
          </div>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="text-center">
          <div className="text-4xl mb-3">📄</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Invoices</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {summary.total_invoices}
          </p>
          <div className="text-sm text-gray-600 mt-2">
            💳 Transactions: {summary.total_transactions}
          </div>
        </Card>

        <Card variant="glass" className="text-center">
          <div className="text-4xl mb-3">🛒</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Cart Items</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {summary.items_in_carts}
          </p>
          <div className="text-sm text-gray-600 mt-2">
            🛍️ Items in carts
          </div>
        </Card>

        <Card variant="glass" className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Stock Health</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {stockHealth}%
          </p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
            <div className={`h-3 rounded-full transition-all duration-1000 ${
              stockHealth >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              stockHealth >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            }`} style={{width: `${stockHealth}%`}}></div>
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card variant="elevated" className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
        <div className="flex items-center mb-6">
          <div className="text-3xl mr-3">📉</div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Low Stock Products</h3>
            <p className="text-gray-600">Items that need immediate attention</p>
          </div>
        </div>

        {summary.low_stock_products && summary.low_stock_products.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl text-gray-600 font-medium">All products are well-stocked!</p>
            <p className="text-gray-500 mt-2">Great job maintaining your inventory levels.</p>
          </div>
        )}

        {summary.low_stock_products && summary.low_stock_products.length > 0 && (
          <div className="space-y-3">
            {summary.low_stock_products.map(p => (
              <div key={p.product_id} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    📦
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{p.product_name}</div>
                    <div className="text-sm text-gray-600">Product ID: {p.product_id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">Stock: {p.stock}</div>
                  <div className="text-sm text-red-500">⚠️ Low stock alert</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
