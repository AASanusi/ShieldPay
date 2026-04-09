import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export function AdminPage() {
  const [users, setUsers] = useState([]);
  const [merchants, setMerchants] = useState([]);
  useEffect(() => { api.get('/admin/users').then((r)=>setUsers(r.data)); api.get('/admin/merchants').then((r)=>setMerchants(r.data)); }, []);
  return <div><h2>Admin</h2><div className="grid-2"><div><h3>Users</h3><table><thead><tr><th>ID</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.map((u)=><tr key={u.id}><td>{u.id}</td><td>{u.email}</td><td>{u.role}</td></tr>)}</tbody></table></div><div><h3>Merchants</h3><table><thead><tr><th>ID</th><th>Name</th><th>API Key</th></tr></thead><tbody>{merchants.map((m)=><tr key={m.id}><td>{m.id}</td><td>{m.name}</td><td>{m.api_key}</td></tr>)}</tbody></table></div></div></div>;
}
