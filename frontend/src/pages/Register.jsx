import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Register(){
  const [form, setForm] = useState({ username: '', password: '', contact_no: '', user_type: 'staff' });
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      nav('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📝</div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600">Join our inventory management system</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">👤 Username</label>
            <input
              value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
              placeholder="Choose a username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🔒 Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="Create a password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📞 Contact Number</label>
            <input
              value={form.contact_no}
              onChange={e => setForm({...form, contact_no: e.target.value})}
              placeholder="Your contact number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full text-lg py-3">
            🎉 Create Account
          </Button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-accent-600 hover:text-accent-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
