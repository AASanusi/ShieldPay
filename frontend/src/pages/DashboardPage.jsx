import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/stats/dashboard').then((r) => setStats(r.data)); }, []);
  if (!stats) return <p>Loading dashboard...</p>;
  const max = Math.max(1, ...stats.bars.map((b) => b.total));
  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid-4">
        <div className="metric"><span>Customers</span><strong>{stats.customersCount}</strong></div>
        <div className="metric"><span>Cards</span><strong>{stats.cardsCount}</strong></div>
        <div className="metric"><span>Transactions</span><strong>{stats.txCount}</strong></div>
        <div className="metric"><span>Volume</span><strong>${Number(stats.volume).toFixed(2)}</strong></div>
      </div>
      <h3>7-day volume</h3>
      <div className="bars">{stats.bars.map((bar) => <div className="bar-item" key={bar.day}><div className="bar" style={{ height: `${(bar.total / max) * 140 + 10}px` }} /><small>{bar.day.slice(5)}</small></div>)}</div>
      <h3>Recent transactions</h3>
      <table><thead><tr><th>ID</th><th>Amount</th><th>Status</th><th>Description</th></tr></thead><tbody>{stats.recent.map((tx)=><tr key={tx.id}><td>{tx.id}</td><td>${Number(tx.amount).toFixed(2)}</td><td>{tx.status}</td><td>{tx.description}</td></tr>)}</tbody></table>
    </div>
  );
}
