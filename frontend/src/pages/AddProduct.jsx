import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddProduct(){
  const [form, setForm] = useState({ product_name: '', price: 0, stock: 0, description: '', brand_id: '', category_id: '', provider_id: '' });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrand, setNewBrand] = useState({ brand_name: '', description: '' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ category_name: '', description: '' });
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({ provider_name: '', address: '', contact_no: '', website: '' });
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [bRes, cRes, pRes] = await Promise.all([API.get('/brands'), API.get('/categories'), API.get('/providers')]);
        setBrands(bRes.data);
        setCategories(cRes.data);
        setProviders(pRes.data);
      } catch (err) {
        console.warn('Failed to load brands/categories/providers', err?.response?.data || err.message);
      }
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    // convert empty string to null for API
    const payload = {
      ...form,
      brand_id: form.brand_id || null,
      category_id: form.category_id || null,
      provider_id: form.provider_id || null,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
    };
    await API.post('/products', payload);
    nav('/products');
  };

  const createBrand = async () => {
    if (!newBrand.brand_name.trim()) return alert('Brand name required');
    try {
      const { data } = await API.post('/brands', newBrand);
      // reload brands
      const br = await API.get('/brands');
      setBrands(br.data);
      // set created brand on form and close
      setForm(f => ({ ...f, brand_id: data.brand_id }));
      setNewBrand({ brand_name: '', description: '' });
      setShowAddBrand(false);
    } catch (err) {
      console.error('Create brand failed', err?.response?.data || err);
      alert(err?.response?.data?.message || 'Create brand failed');
    }
  };

  const createCategory = async () => {
    if (!newCategory.category_name.trim()) return alert('Category name required');
    try {
      const { data } = await API.post('/categories', newCategory);
      const res = await API.get('/categories');
      setCategories(res.data);
      setForm(f => ({ ...f, category_id: data.category_id }));
      setNewCategory({ category_name: '', description: '' });
      setShowAddCategory(false);
    } catch (err) {
      console.error('Create category failed', err?.response?.data || err);
      alert(err?.response?.data?.message || 'Create category failed');
    }
  };

  const createProvider = async () => {
    if (!newProvider.provider_name.trim()) return alert('Provider name required');
    try {
      const { data } = await API.post('/providers', newProvider);
      const res = await API.get('/providers');
      setProviders(res.data);
      setForm(f => ({ ...f, provider_id: data.provider_id }));
      setNewProvider({ provider_name: '', address: '', contact_no: '', website: '' });
      setShowAddProvider(false);
    } catch (err) {
      console.error('Create provider failed', err?.response?.data || err);
      alert(err?.response?.data?.message || 'Create provider failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto card">
      <h2 className="text-xl font-semibold mb-4">Add Product</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required placeholder="Product name" value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} className="w-full p-3 border rounded-lg" />
        <div className="flex flex-col gap-2">
          <select value={form.brand_id} onChange={e => setForm({...form, brand_id: e.target.value})} className="p-3 border rounded-lg">
            <option value="">-- Select Brand (optional) --</option>
            {brands.map(b => (<option key={b.brand_id} value={b.brand_id}>{b.brand_name}</option>))}
          </select>
          <div className="flex gap-2 items-center">
            <button type="button" onClick={() => setShowAddBrand(prev => !prev)} className="px-3 py-1 bg-slate-200 rounded">{showAddBrand ? 'Cancel' : 'Add Brand'}</button>
            {showAddBrand && (
              <div className="flex gap-2 items-center">
                <input value={newBrand.brand_name} onChange={e => setNewBrand({...newBrand, brand_name: e.target.value})} placeholder="Brand name" className="p-2 border rounded" />
                <input value={newBrand.description} onChange={e => setNewBrand({...newBrand, description: e.target.value})} placeholder="Description" className="p-2 border rounded" />
                <button type="button" onClick={createBrand} className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
              </div>
            )}
          </div>
          <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="p-3 border rounded-lg">
            <option value="">-- Select Category (optional) --</option>
            {categories.map(c => (<option key={c.category_id} value={c.category_id}>{c.category_name}</option>))}
          </select>
          <div className="flex gap-2 items-center">
            <button type="button" onClick={() => setShowAddCategory(prev => !prev)} className="px-3 py-1 bg-slate-200 rounded">{showAddCategory ? 'Cancel' : 'Add Category'}</button>
            {showAddCategory && (
              <div className="flex gap-2 items-center">
                <input value={newCategory.category_name} onChange={e => setNewCategory({...newCategory, category_name: e.target.value})} placeholder="Category name" className="p-2 border rounded" />
                <input value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})} placeholder="Description" className="p-2 border rounded" />
                <button type="button" onClick={createCategory} className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
              </div>
            )}
          </div>
          <select value={form.provider_id} onChange={e => setForm({...form, provider_id: e.target.value})} className="p-3 border rounded-lg">
            <option value="">-- Select Provider (optional) --</option>
            {providers.map(p => (<option key={p.provider_id} value={p.provider_id}>{p.provider_name}</option>))}
          </select>
          <div className="flex gap-2 items-center">
            <button type="button" onClick={() => setShowAddProvider(prev => !prev)} className="px-3 py-1 bg-slate-200 rounded">{showAddProvider ? 'Cancel' : 'Add Provider'}</button>
            {showAddProvider && (
              <div className="flex gap-2 items-center">
                <input value={newProvider.provider_name} onChange={e => setNewProvider({...newProvider, provider_name: e.target.value})} placeholder="Provider name" className="p-2 border rounded" />
                <input value={newProvider.contact_no} onChange={e => setNewProvider({...newProvider, contact_no: e.target.value})} placeholder="Contact number" className="p-2 border rounded" />
                <input value={newProvider.address} onChange={e => setNewProvider({...newProvider, address: e.target.value})} placeholder="Address" className="p-2 border rounded" />
                <input value={newProvider.website} onChange={e => setNewProvider({...newProvider, website: e.target.value})} placeholder="Website" className="p-2 border rounded" />
                <button type="button" onClick={createProvider} className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
              </div>
            )}
          </div>
        </div>
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-3 border rounded-lg" />
        <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full p-3 border rounded-lg" />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-3 border rounded-lg" />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
        </div>
      </form>
    </div>
  );
}
