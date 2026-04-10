import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export function CardsPage() {
  const [rows, setRows] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customer_id: '', holder_name: '', pan: '', cvv: '', expiry_month: '', expiry_year: '', brand: '' });
  const load = () => { api.get('/cards').then((r) => setRows(r.data)); api.get('/customers').then((r) => setCustomers(r.data)); };
  useEffect(() => { load(); }, []);
  async function create(e) { e.preventDefault(); await api.post('/cards', form); setForm({ customer_id: '', holder_name: '', pan: '', cvv: '', expiry_month: '', expiry_year: '', brand: '' }); load(); }
  return <div><h2>Cards</h2><p className="warning">Unsafe lab baseline: full PAN and CVV are shown by API.</p><form className="row wrap" onSubmit={create}><select value={form.customer_id} onChange={(e)=>setForm({ ...form, customer_id:e.target.value })} required><option value="">Customer</option>{customers.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input value={form.holder_name} onChange={(e)=>setForm({ ...form, holder_name:e.target.value })} placeholder="Holder" required /><input value={form.pan} onChange={(e)=>setForm({ ...form, pan:e.target.value })} placeholder="PAN" required /><input value={form.cvv} onChange={(e)=>setForm({ ...form, cvv:e.target.value })} placeholder="CVV" required /><input value={form.expiry_month} onChange={(e)=>setForm({ ...form, expiry_month:e.target.value })} placeholder="MM" required /><input value={form.expiry_year} onChange={(e)=>setForm({ ...form, expiry_year:e.target.value })} placeholder="YY" required /><input value={form.brand} onChange={(e)=>setForm({ ...form, brand:e.target.value })} placeholder="Brand" /><button className="btn" type="submit">Save Card</button></form><table><thead><tr><th>ID</th><th>Holder</th><th>PAN</th><th>CVV</th><th>Brand</th></tr></thead><tbody>{rows.map((c)=><tr key={c.id}><td>{c.id}</td><td>{c.holder_name}</td><td>{c.pan}</td><td>{c.cvv}</td><td>{c.brand}</td></tr>)}</tbody></table></div>;
}
