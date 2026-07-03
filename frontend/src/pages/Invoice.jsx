import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useParams } from 'react-router-dom';

export default function Invoice(){
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await API.get(`/invoice/${id}`);
      setData(data);
    })();
  }, [id]);

  if (!data) return <div>Loading...</div>;

  const { invoice, items } = data;

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-2xl mb-2">Invoice #{invoice.invoice_id}</h2>
      <div>Date: {new Date(invoice.date_time).toLocaleString()}</div>
      <div className="mt-4">
        <table className="w-full">
          <thead>
            <tr><th>Name</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.transaction_id}>
                <td>{it.product_name}</td>
                <td>{it.quantity}</td>
                <td>₹{it.price}</td>
                <td>₹{(it.quantity * it.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right mt-4 font-bold">Total: ₹{invoice.total_amount}</div>
      </div>
    </div>
  );
}
