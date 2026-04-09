import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const paymentsRouter = Router();
paymentsRouter.use(requireAuth);

paymentsRouter.post('/process', (req, res) => {
  const { customer_id, card_id, amount, currency, description } = req.body;
  const card = db.prepare('SELECT * FROM cards WHERE id = ? AND merchant_id = ?').get(card_id, req.user.merchant_id);
  if (!card) return res.status(404).json({ message: 'Card not found' });

  const status = Number(amount) > 5000 ? 'declined' : 'approved';
  const result = db.prepare('INSERT INTO transactions (merchant_id, customer_id, card_id, amount, currency, status, description, pan_snapshot, cvv_snapshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(req.user.merchant_id, customer_id, card_id, amount, currency || 'USD', status, description || 'Payment', card.pan, card.cvv);
  return res.status(201).json(db.prepare('SELECT * FROM transactions WHERE id = ?').get(Number(result.lastInsertRowid)));
});
