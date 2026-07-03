import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Providers(){
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({ provider_name: '', address:'', contact_no:'', website:'' });

  useEffect(() => {
    (async () => {
      const { data } = await API.get('/providers');
      setProviders(data);
    })();
  }, []);

  const submit = async () => {
    await API.post('/providers', form);
    setForm({ provider_name: '', address:'', contact_no:'', website:'' });
    const { data } = await API.get('/providers');
    setProviders(data);
  };

  const remove = async (id) => {
    if (!confirm('Delete provider?')) return;
    await API.delete(`/providers/${id}`);
    const { data } = await API.get('/providers');
    setProviders(data);
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Providers</h2>
      <div className="card max-w-md mb-4">
        <input value={form.provider_name} onChange={e => setForm({...form, provider_name:e.target.value})} placeholder="Provider name" className="w-full p-3 border rounded mb-2"/>
        <input value={form.contact_no} onChange={e => setForm({...form, contact_no:e.target.value})} placeholder="Contact number" className="w-full p-3 border rounded mb-2"/>
        <input value={form.address} onChange={e => setForm({...form, address:e.target.value})} placeholder="Address" className="w-full p-3 border rounded mb-2"/>
        <input value={form.website} onChange={e => setForm({...form, website:e.target.value})} placeholder="Website" className="w-full p-3 border rounded mb-2"/>
        <div className="flex gap-2">
          <button onClick={submit} className="px-3 py-2 bg-green-600 text-white rounded">Create</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {providers.map(p => (
          <div key={p.provider_id} className="card flex justify-between items-center">
            <div>
              <div className="font-semibold">{p.provider_name}</div>
              {p.contact_no && <div className="text-sm text-slate-600">Contact: {p.contact_no}</div>}
              {p.website && <div className="text-sm text-slate-600">{p.website}</div>}
            </div>
            <div>
              <button onClick={() => remove(p.provider_id)} className="px-3 py-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
