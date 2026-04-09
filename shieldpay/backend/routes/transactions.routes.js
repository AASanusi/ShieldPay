import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const transactionsRouter = Router();
transactionsRouter.use(requireAuth);

transactionsRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM transactions WHERE merchant_id = ? ORDER BY id DESC LIMIT 100').all(req.user.merchant_id);
  // ARKO-LAB-04: Exposes PAN/CVV snapshot.
  res.json(rows);
});

transactionsRouter.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM transactions WHERE id = ? AND merchant_id = ?').get(req.params.id, req.user.merchant_id);
  if (!row) return res.status(404).json({ message: 'Transaction not found' });
  // ARKO-LAB-04: Exposes PAN/CVV snapshot.
  return res.json(row);
});
