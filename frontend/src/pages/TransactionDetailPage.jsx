import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.js';

export function TransactionDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => { api.get(`/transactions/${id}`).then((r) => setItem(r.data)); }, [id]);
  if (!item) return <p>Loading transaction...</p>;
  return <div className="card"><h2>Transaction #{item.id}</h2><p><strong>Amount:</strong> ${Number(item.amount).toFixed(2)} {item.currency}</p><p><strong>Status:</strong> {item.status}</p><p><strong>Description:</strong> {item.description}</p><p><strong>PAN snapshot:</strong> {item.pan_snapshot}</p><p><strong>CVV snapshot:</strong> {item.cvv_snapshot}</p><p><strong>Created:</strong> {item.created_at}</p></div>;
}
