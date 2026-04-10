import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const adminRouter = Router();
adminRouter.use(requireAuth);

// ARKO-LAB-03: Missing admin role check.
adminRouter.get('/users', (_req, res) => {
  res.json(db.prepare('SELECT id, name, email, role, merchant_id, created_at FROM users ORDER BY id DESC').all());
});

// ARKO-LAB-03: Missing admin role check.
adminRouter.get('/merchants', (_req, res) => {
  res.json(db.prepare('SELECT * FROM merchants ORDER BY id DESC').all());
});
