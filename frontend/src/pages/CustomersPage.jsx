import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export function CustomersPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const load = () => api.get('/customers', { params: { q } }).then((r) => setRows(r.data));
  useEffect(() => { load(); }, []);
  async function create(e) { e.preventDefault(); await api.post('/customers', form); setForm({ name: '', email: '', phone: '' }); load(); }
  return <div><h2>Customers</h2><div className="row"><input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by name" /><button className="btn" type="button" onClick={load}>Search</button></div><form className="row" onSubmit={create}><input value={form.name} onChange={(e)=>setForm({ ...form, name:e.target.value })} placeholder="Name" required /><input value={form.email} onChange={(e)=>setForm({ ...form, email:e.target.value })} placeholder="Email" /><input value={form.phone} onChange={(e)=>setForm({ ...form, phone:e.target.value })} placeholder="Phone" /><button className="btn" type="submit">Add</button></form><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead><tbody>{rows.map((c)=><tr key={c.id}><td><Link to={`/customers/${c.id}`}>{c.id}</Link></td><td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td></tr>)}</tbody></table></div>;
}
