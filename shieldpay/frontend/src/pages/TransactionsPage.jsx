import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export function TransactionsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { api.get('/transactions').then((r) => setRows(r.data)); }, []);
  return <div><h2>Transactions</h2><table><thead><tr><th>ID</th><th>Amount</th><th>Status</th><th>Description</th><th>PAN Snapshot</th><th>CVV Snapshot</th></tr></thead><tbody>{rows.map((t)=><tr key={t.id}><td><Link to={`/transactions/${t.id}`}>{t.id}</Link></td><td>${Number(t.amount).toFixed(2)}</td><td>{t.status}</td><td>{t.description}</td><td>{t.pan_snapshot}</td><td>{t.cvv_snapshot}</td></tr>)}</tbody></table></div>;
}
