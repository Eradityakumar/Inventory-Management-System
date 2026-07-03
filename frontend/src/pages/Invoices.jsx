import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function Invoices(){
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get('/invoice');
        setInvoices(data);
      } catch (err) {
        console.error('Failed to load invoices', err?.response?.data || err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading invoices...</div>;
  if (!invoices.length) return <div className="card">You have no invoices yet.</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Invoices</h2>
      <div className="space-y-3">
        {invoices.map(inv => (
          <div key={inv.invoice_id} className="card flex justify-between items-center">
            <div>
              <div className="font-semibold">Invoice #{inv.invoice_id}</div>
              <div className="text-sm">Total: ₹{inv.total_amount} • {new Date(inv.date_time).toLocaleString()}</div>
            </div>
            <Link to={`/invoice/${inv.invoice_id}`} className="px-3 py-2 bg-indigo-600 text-white rounded-lg">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
