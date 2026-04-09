import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const statsRouter = Router();
statsRouter.use(requireAuth);

statsRouter.get('/dashboard', (req, res) => {
  const mid = req.user.merchant_id;
  const customersCount = db.prepare('SELECT COUNT(*) AS count FROM customers WHERE merchant_id = ?').get(mid).count;
  const cardsCount = db.prepare('SELECT COUNT(*) AS count FROM cards WHERE merchant_id = ?').get(mid).count;
  const txCount = db.prepare('SELECT COUNT(*) AS count FROM transactions WHERE merchant_id = ?').get(mid).count;
  const volume = db.prepare('SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE merchant_id = ?').get(mid).total;
  const recent = db.prepare('SELECT * FROM transactions WHERE merchant_id = ? ORDER BY id DESC LIMIT 5').all(mid);
  const bars = db.prepare(`SELECT substr(created_at, 1, 10) AS day, COALESCE(SUM(amount), 0) AS total FROM transactions WHERE merchant_id = ? GROUP BY substr(created_at, 1, 10) ORDER BY day DESC LIMIT 7`).all(mid).reverse();
  res.json({ customersCount, cardsCount, txCount, volume, recent, bars });
});
