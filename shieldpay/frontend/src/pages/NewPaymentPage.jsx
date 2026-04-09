import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export function NewPaymentPage() {
  const [customers, setCustomers] = useState([]);
  const [cards, setCards] = useState([]);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({ customer_id: '', card_id: '', amount: '', currency: 'USD', description: '' });
  useEffect(() => { api.get('/customers').then((r)=>setCustomers(r.data)); api.get('/cards').then((r)=>setCards(r.data)); }, []);
  async function submit(e) { e.preventDefault(); const { data } = await api.post('/payments/process', form); setResult(data); }
  return <div><h2>New Payment</h2><form className="card" onSubmit={submit}><select value={form.customer_id} onChange={(e)=>setForm({ ...form, customer_id:e.target.value })} required><option value="">Select customer</option>{customers.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}</select><select value={form.card_id} onChange={(e)=>setForm({ ...form, card_id:e.target.value })} required><option value="">Select card</option>{cards.map((c)=><option key={c.id} value={c.id}>{c.holder_name} - {c.pan}</option>)}</select><input value={form.amount} onChange={(e)=>setForm({ ...form, amount:e.target.value })} placeholder="Amount" required /><input value={form.currency} onChange={(e)=>setForm({ ...form, currency:e.target.value })} placeholder="Currency" /><input value={form.description} onChange={(e)=>setForm({ ...form, description:e.target.value })} placeholder="Description" /><button className="btn" type="submit">Process</button></form>{result ? <div className="card"><h3>Payment result</h3><p>ID: {result.id}</p><p>Status: {result.status}</p><p>Amount: ${Number(result.amount).toFixed(2)}</p></div> : null}</div>;
}
