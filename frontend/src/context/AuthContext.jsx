import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loadMe = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { data } = await API.get('/auth/me');
      setUser(data);
    } catch (err) {
      console.warn('me failed', err);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => { loadMe(); }, []);

  const login = async (credentials) => {
    const { data } = await API.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    await loadMe();
  };

  const register = async (payload) => {
    const { data } = await API.post('/auth/register', payload);
    localStorage.setItem('token', data.token);
    await loadMe();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
