import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Brands(){
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ brand_name: '', description: '' });

  const fetch = async () => {
    const { data } = await API.get('/brands');
    setBrands(data);
  };
  useEffect(()=>{ fetch(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await API.post('/brands', form);
    setForm({ brand_name: '', description: '' });
    fetch();
  };

  const remove = async (id) => {
    if (!confirm('Delete brand?')) return;
    await API.delete(`/brands/${id}`);
    fetch();
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Brands</h2>
      <form onSubmit={add} className="max-w-md mb-6">
        <input value={form.brand_name} onChange={e => setForm({...form, brand_name:e.target.value})} placeholder="Brand name" className="w-full p-3 border rounded mb-2"/>
        <textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Description" className="w-full p-3 border rounded mb-2"/>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Add Brand</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {brands.map(b => (
          <div key={b.brand_id} className="card">
            <h3 className="font-semibold">{b.brand_name}</h3>
            <p className="text-sm mt-2">{b.description}</p>
            <div className="mt-4">
              <button onClick={() => remove(b.brand_id)} className="px-3 py-2 bg-red-500 text-white rounded">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
