import { Router } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db.js';
import { signToken, requireAuth } from '../auth.js';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password || '', user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken({ id: user.id, email: user.email, role: user.role, merchant_id: user.merchant_id });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, merchant_id: user.merchant_id } });
});

authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ message: 'Email already exists' });
  const merchant = db.prepare('INSERT INTO merchants (name, api_key, webhook_url) VALUES (?, ?, ?)').run(`${name}'s Store`, `key_${Date.now()}`, '');
  const hash = bcrypt.hashSync(password, 10);
  const user = db.prepare('INSERT INTO users (name, email, password_hash, role, merchant_id) VALUES (?, ?, ?, ?, ?)').run(name, email, hash, 'merchant', Number(merchant.lastInsertRowid));
  const inserted = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(user.lastInsertRowid));
  const token = signToken({ id: inserted.id, email: inserted.email, role: inserted.role, merchant_id: inserted.merchant_id });
  return res.status(201).json({ token, user: inserted });
});

// ARKO-LAB-08: Insecure reset returns token in JSON.
authRouter.post('/password-reset', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const resetToken = signToken({ id: user.id, email: user.email, purpose: 'reset' });
  return res.json({ message: 'Reset token generated', resetToken });
});

// ARKO-LAB-08: Insecure impersonation returns token directly.
authRouter.post('/impersonate', requireAuth, (req, res) => {
  const target = db.prepare('SELECT * FROM users WHERE id = ?').get(req.body.userId);
  if (!target) return res.status(404).json({ message: 'Target user not found' });
  const token = signToken({ id: target.id, email: target.email, role: target.role, merchant_id: target.merchant_id, impersonatedBy: req.user.id });
  return res.json({ token });
});
