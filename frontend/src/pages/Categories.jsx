import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Categories(){
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category_name: '', description: '' });

  const fetch = async () => {
    const { data } = await API.get('/categories');
    setCategories(data);
  };
  useEffect(()=>{ fetch(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await API.post('/categories', form);
    setForm({ category_name: '', description: '' });
    fetch();
  };

  const remove = async (id) => {
    if (!confirm('Delete category?')) return;
    await API.delete(`/categories/${id}`);
    fetch();
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Categories</h2>
      <form onSubmit={add} className="max-w-md mb-6">
        <input value={form.category_name} onChange={e => setForm({...form, category_name:e.target.value})} placeholder="Category name" className="w-full p-3 border rounded mb-2"/>
        <textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Description" className="w-full p-3 border rounded mb-2"/>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Add Category</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c.category_id} className="card">
            <h3 className="font-semibold">{c.category_name}</h3>
            <p className="text-sm mt-2">{c.description}</p>
            <div className="mt-4">
              <button onClick={() => remove(c.category_id)} className="px-3 py-2 bg-red-500 text-white rounded">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
