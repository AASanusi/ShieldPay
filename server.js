import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initDb } from './backend/db.js';
import { apiRouter } from './backend/routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 8788);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ARKO-LAB-05: Intentionally unsafe request-body logging.
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[UNSAFE-REQ-LOG]', req.method, req.path, req.body);
  }
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
  })
);

initDb();
app.use('/api', apiRouter);

async function start() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'frontend', 'dist');
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(distPath) || !fs.existsSync(indexPath)) {
      console.error('Missing frontend build output. Run "npm run build" before "npm start".');
      process.exit(1);
    }
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(indexPath));
  } else {
    const vite = await createViteServer({
      root: path.join(__dirname, 'frontend'),
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  // ARKO-LAB-06: Intentionally leaks stack/body in all environments.
  app.use((err, req, res, _next) => {
    res.status(500).json({ message: err.message, stack: err.stack, requestBody: req.body });
  });

  app.listen(port, '127.0.0.1', () => {
    console.log(`ShieldPay running at http://127.0.0.1:${port}`);
  });
}

start();
