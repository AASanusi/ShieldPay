import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export function RegisterPage({ auth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    try { const { data } = await api.post('/auth/register', form); auth.setAuth(data.token, data.user); navigate('/'); }
    catch (err) { setError(err?.response?.data?.message || 'Register failed'); }
  }
  return <div className="auth-wrap"><form className="card" onSubmit={submit}><h2>Register Merchant</h2><input value={form.name} onChange={(e)=>setForm({ ...form, name:e.target.value })} placeholder="Name" /><input value={form.email} onChange={(e)=>setForm({ ...form, email:e.target.value })} placeholder="Email" /><input type="password" value={form.password} onChange={(e)=>setForm({ ...form, password:e.target.value })} placeholder="Password" />{error ? <p className="error">{error}</p> : null}<button className="btn" type="submit">Create Account</button><p>Already have account? <Link to="/login">Log in</Link></p></form></div>;
}
