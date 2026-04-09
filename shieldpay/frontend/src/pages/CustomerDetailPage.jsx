import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';

export function CustomerDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const load = () => api.get(`/customers/${id}`).then((r) => setItem(r.data));
  useEffect(() => { load(); }, [id]);
  if (!item) return <p>Loading customer...</p>;
  async function save(e) { e.preventDefault(); await api.put(`/customers/${id}`, item); load(); }
  async function remove() { await api.delete(`/customers/${id}`); nav('/customers'); }
  return <form className="card" onSubmit={save}><h2>Customer #{item.id}</h2><input value={item.name} onChange={(e)=>setItem({ ...item, name:e.target.value })} /><input value={item.email || ''} onChange={(e)=>setItem({ ...item, email:e.target.value })} /><input value={item.phone || ''} onChange={(e)=>setItem({ ...item, phone:e.target.value })} /><div className="row"><button className="btn" type="submit">Save</button><button className="btn danger" type="button" onClick={remove}>Delete</button></div></form>;
}
