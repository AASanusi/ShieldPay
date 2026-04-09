import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';

const dbPath = process.env.DATABASE_PATH || './backend/data/shieldpay.db';
const resolvedPath = path.resolve(process.cwd(), dbPath);
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
export const db = new Database(resolvedPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL, merchant_id INTEGER, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS merchants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, api_key TEXT, webhook_url TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, merchant_id INTEGER NOT NULL, name TEXT NOT NULL, email TEXT, phone TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT, merchant_id INTEGER NOT NULL, customer_id INTEGER NOT NULL, holder_name TEXT NOT NULL, pan TEXT NOT NULL, cvv TEXT NOT NULL, expiry_month TEXT NOT NULL, expiry_year TEXT NOT NULL, brand TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, merchant_id INTEGER NOT NULL, customer_id INTEGER, card_id INTEGER, amount REAL NOT NULL, currency TEXT NOT NULL, status TEXT NOT NULL, description TEXT, pan_snapshot TEXT, cvv_snapshot TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
  `);

  const exists = db.prepare('SELECT id FROM merchants WHERE name = ?').get('Demo Merchant');
  if (exists) return;

  const adminHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'ChangeMeNow123!', 10);
  const merchantHash = bcrypt.hashSync('Demo1234!', 10);
  const merchant = db.prepare('INSERT INTO merchants (name, api_key, webhook_url) VALUES (?, ?, ?)').run('Demo Merchant', 'demo_key_123456', 'https://example.com/webhook');
  const merchantId = Number(merchant.lastInsertRowid);

  db.prepare('INSERT INTO users (name, email, password_hash, role, merchant_id) VALUES (?, ?, ?, ?, ?)').run('Admin User', process.env.ADMIN_EMAIL || 'admin@shieldpay.local', adminHash, 'admin', null);
  db.prepare('INSERT INTO users (name, email, password_hash, role, merchant_id) VALUES (?, ?, ?, ?, ?)').run('Demo Merchant Owner', 'merchant@demo.com', merchantHash, 'merchant', merchantId);

  const c1 = Number(db.prepare('INSERT INTO customers (merchant_id, name, email, phone) VALUES (?, ?, ?, ?)').run(merchantId, 'Alice Carter', 'alice@example.com', '+15550001').lastInsertRowid);
  const c2 = Number(db.prepare('INSERT INTO customers (merchant_id, name, email, phone) VALUES (?, ?, ?, ?)').run(merchantId, 'Bob Stone', 'bob@example.com', '+15550002').lastInsertRowid);

  // ARKO-LAB-09: Plaintext PAN/CVV storage (lab only, illegal in production).
  const card1 = Number(db.prepare('INSERT INTO cards (merchant_id, customer_id, holder_name, pan, cvv, expiry_month, expiry_year, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(merchantId, c1, 'Alice Carter', '4242424242424242', '123', '12', '30', 'VISA').lastInsertRowid);
  const card2 = Number(db.prepare('INSERT INTO cards (merchant_id, customer_id, holder_name, pan, cvv, expiry_month, expiry_year, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(merchantId, c2, 'Bob Stone', '5555555555554444', '456', '11', '29', 'MASTERCARD').lastInsertRowid);

  db.prepare('INSERT INTO transactions (merchant_id, customer_id, card_id, amount, currency, status, description, pan_snapshot, cvv_snapshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(merchantId, c1, card1, 49.99, 'USD', 'approved', 'Starter payment', '4242424242424242', '123');
  db.prepare('INSERT INTO transactions (merchant_id, customer_id, card_id, amount, currency, status, description, pan_snapshot, cvv_snapshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(merchantId, c2, card2, 99, 'USD', 'approved', 'Second payment', '5555555555554444', '456');
}
