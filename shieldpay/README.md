# ShieldPay

**ShieldPay** is a full-stack, single-origin payment dashboard built for security engineering labs.  
It simulates a multi-merchant payments platform (fake money, test cards only) and is designed to demonstrate both:

1. how modern full-stack apps are built, and  
2. how insecure patterns are identified and remediated in a realistic workflow.

---

## Why This Project Stands Out

- **Full-stack architecture**: React + Express + SQLite in one cohesive app.
- **Single-process dev architecture**: API and frontend served from one Node process, one origin, one port.
- **Security-first learning design**: intentionally vulnerable baseline with traceable lab markers (`ARKO-LAB-01` to `ARKO-LAB-09`).
- **Real remediation workflow**: built to be hardened iteratively using Arko guidance.
- **Production-aware behavior**: separate dev/prod startup paths, SPA static serving, and build-output checks.

---

## Core Capabilities

### Authentication & Access
- JWT-based authentication
- bcrypt password hashing
- Seeded admin and demo merchant accounts
- Role-aware UI routing (merchant/admin screens)

### Payment Platform Features
- Merchant dashboard with KPIs and 7-day volume bars
- Customers CRUD + details
- Cards management + details
- Transactions listing + details
- New payment processing simulation
- Admin views (users, merchants)
- Settings (profile, API key rotation, webhooks, JSON export)

### API Surface
- `GET /api/health`
- `/api/auth/*`
- `/api/customers/*`
- `/api/cards/*`
- `/api/transactions/*`
- `/api/payments/process`
- `/api/admin/*`
- `/api/settings/*`
- `/api/stats/dashboard`

---

## Architecture

### Development (one process, one port)
- Express mounts `/api/*` routes first.
- Vite runs in middleware mode inside Express (`appType: 'spa'`).
- Frontend calls API via Axios with same-origin base path (`/api`).

### Production
- `npm run build` generates frontend assets.
- `npm start` serves static files + SPA fallback.
- Server exits with a clear error if build assets are missing.

### Data Layer
- SQLite (`better-sqlite3`)
- Configurable DB path via `DATABASE_PATH`
- Seeded users, merchants, customers, cards, transactions for fast demo startup

---

## Security Lab Design (Intentional)

This repository starts as an intentionally insecure baseline for training.  
Vulnerabilities are clearly tagged in code comments:

- `ARKO-LAB-01` Injection
- `ARKO-LAB-02` Broken access control (ownership checks missing)
- `ARKO-LAB-03` Broken access control (admin role checks missing)
- `ARKO-LAB-04` Sensitive data exposure
- `ARKO-LAB-05` Unsafe logging of sensitive input
- `ARKO-LAB-06` Overly verbose error disclosure
- `ARKO-LAB-07` Weak fallback secret handling
- `ARKO-LAB-08` Insecure reset/impersonation token patterns
- `ARKO-LAB-09` Plaintext payment data at rest (lab only)

> This is deliberate for education. Do **not** deploy this baseline to production.

---

## Tech Stack

- **Frontend**: React 18, React Router v6, Vite, Axios, plain CSS
- **Backend**: Node.js, Express, express-session
- **Security/Auth**: JWT (`jsonwebtoken`), bcrypt
- **Database**: SQLite (`better-sqlite3`)
- **Tooling**: npm scripts, dotenv

---

## Quick Start

```bash
cd shieldpay
npm install
npm run dev
```

Open:
- `http://127.0.0.1:8802` (default from `.env`)

Health check:
```bash
curl http://127.0.0.1:8802/api/health
```

Demo credentials:
- Merchant: `merchant@demo.com` / `Demo1234!`
- Admin: values from `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)

---

## Project Structure

```text
shieldpay/
  backend/
    routes/
    db.js
    auth.js
  frontend/
    src/
      components/
      pages/
  server.js
  .env.example
  SECURITY-LAB.md
```

---

## Employer-Focused Highlights

- Built a complete full-stack product with clean separation of concerns.
- Implemented and documented an end-to-end API + UI workflow.
- Designed a realistic security testbed with reproducible vulnerability cases.
- Demonstrated secure coding progression: insecure baseline -> guided hardening.
- Balanced developer experience (single-port dev) with production deployment behavior.

---

## Important Disclaimer

ShieldPay is a **security training project** with intentionally vulnerable code paths.  
Use only in local lab environments with test data.  
Do not use real cardholder data. Do not deploy this baseline to production.
