import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export function LoginPage({ auth }) {
  const [form, setForm] = useState({ email: 'merchant@demo.com', password: 'Demo1234!' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    try { const { data } = await api.post('/auth/login', form); auth.setAuth(data.token, data.user); navigate('/'); }
    catch (err) { setError(err?.response?.data?.message || 'Login failed'); }
  }
  return <div className="auth-wrap"><form className="card" onSubmit={submit}><h2>Log in</h2><input value={form.email} onChange={(e)=>setForm({ ...form, email:e.target.value })} placeholder="Email" /><input type="password" value={form.password} onChange={(e)=>setForm({ ...form, password:e.target.value })} placeholder="Password" />{error ? <p className="error">{error}</p> : null}<button className="btn" type="submit">Login</button><p>New merchant? <Link to="/register">Register</Link></p></form></div>;
}
