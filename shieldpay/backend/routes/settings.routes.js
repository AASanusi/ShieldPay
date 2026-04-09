import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const settingsRouter = Router();
settingsRouter.use(requireAuth);

settingsRouter.get('/profile', (req, res) => {
  res.json(db.prepare('SELECT id, name, email, role, merchant_id, created_at FROM users WHERE id = ?').get(req.user.id));
});

settingsRouter.put('/profile', (req, res) => {
  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(req.body.name, req.user.id);
  res.json(db.prepare('SELECT id, name, email, role, merchant_id, created_at FROM users WHERE id = ?').get(req.user.id));
});

settingsRouter.get('/api-keys', (req, res) => {
  res.json(db.prepare('SELECT id, name, api_key FROM merchants WHERE id = ?').get(req.user.merchant_id));
});

settingsRouter.post('/api-keys/rotate', (req, res) => {
  const key = `key_${Date.now()}`;
  db.prepare('UPDATE merchants SET api_key = ? WHERE id = ?').run(key, req.user.merchant_id);
  res.json(db.prepare('SELECT id, name, api_key FROM merchants WHERE id = ?').get(req.user.merchant_id));
});

settingsRouter.get('/webhooks', (req, res) => {
  res.json(db.prepare('SELECT id, webhook_url FROM merchants WHERE id = ?').get(req.user.merchant_id));
});

settingsRouter.put('/webhooks', (req, res) => {
  db.prepare('UPDATE merchants SET webhook_url = ? WHERE id = ?').run(req.body.webhook_url, req.user.merchant_id);
  res.json(db.prepare('SELECT id, webhook_url FROM merchants WHERE id = ?').get(req.user.merchant_id));
});

settingsRouter.get('/export', (req, res) => {
  const customers = db.prepare('SELECT * FROM customers WHERE merchant_id = ?').all(req.user.merchant_id);
  const transactions = db.prepare('SELECT * FROM transactions WHERE merchant_id = ?').all(req.user.merchant_id);
  res.json({ customers, transactions });
});
