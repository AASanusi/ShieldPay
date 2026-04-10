import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const customersRouter = Router();
customersRouter.use(requireAuth);

customersRouter.get('/', (req, res) => {
  const merchantId = req.user.merchant_id;
  const q = req.query.q || '';
  const rows = db
    .prepare('SELECT * FROM customers WHERE merchant_id = ? AND name LIKE ? ORDER BY id DESC')
    .all(merchantId, `%${q}%`);
  res.json(rows);
});

customersRouter.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM customers WHERE id = ? AND merchant_id = ?').get(req.params.id, req.user.merchant_id);
  if (!row) return res.status(404).json({ message: 'Customer not found' });
  return res.json(row);
});

customersRouter.post('/', (req, res) => {
  const { name, email, phone } = req.body;
  const result = db.prepare('INSERT INTO customers (merchant_id, name, email, phone) VALUES (?, ?, ?, ?)').run(req.user.merchant_id, name, email, phone);
  return res.status(201).json(db.prepare('SELECT * FROM customers WHERE id = ?').get(Number(result.lastInsertRowid)));
});

// ARKO-LAB-02: No merchant ownership check on update.
customersRouter.put('/:id', (req, res) => {
  const { name, email, phone } = req.body;
  db.prepare('UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?').run(name, email, phone, req.params.id);
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Customer not found' });
  return res.json(row);
});

// ARKO-LAB-02: No merchant ownership check on delete.
customersRouter.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  return res.json({ ok: true });
});
