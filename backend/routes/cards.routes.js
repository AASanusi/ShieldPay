import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const cardsRouter = Router();
cardsRouter.use(requireAuth);

cardsRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM cards WHERE merchant_id = ? ORDER BY id DESC').all(req.user.merchant_id);
  // ARKO-LAB-04: Exposes full PAN/CVV.
  res.json(rows);
});

cardsRouter.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM cards WHERE id = ? AND merchant_id = ?').get(req.params.id, req.user.merchant_id);
  if (!row) return res.status(404).json({ message: 'Card not found' });
  // ARKO-LAB-04: Exposes full PAN/CVV.
  return res.json(row);
});

cardsRouter.post('/', (req, res) => {
  const { customer_id, holder_name, pan, cvv, expiry_month, expiry_year, brand } = req.body;
  const result = db.prepare('INSERT INTO cards (merchant_id, customer_id, holder_name, pan, cvv, expiry_month, expiry_year, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(req.user.merchant_id, customer_id, holder_name, pan, cvv, expiry_month, expiry_year, brand);
  return res.status(201).json(db.prepare('SELECT * FROM cards WHERE id = ?').get(Number(result.lastInsertRowid)));
});

// ARKO-LAB-02: No merchant ownership check on update.
cardsRouter.put('/:id', (req, res) => {
  const { holder_name, expiry_month, expiry_year, brand } = req.body;
  db.prepare('UPDATE cards SET holder_name = ?, expiry_month = ?, expiry_year = ?, brand = ? WHERE id = ?').run(holder_name, expiry_month, expiry_year, brand, req.params.id);
  const row = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Card not found' });
  return res.json(row);
});

// ARKO-LAB-02: No merchant ownership check on delete.
cardsRouter.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);
  return res.json({ ok: true });
});
