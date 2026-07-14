// Sal Zol (סל זול) — server.
//
// Serves the web UI and a small REST API:
//   GET  /api/catalog          → chains + products
//   GET  /api/search?q=...      → search catalog products
//   POST /api/match             → match a pasted/uploaded free-text list
//   POST /api/compare           → compare a basket across all chains
//   POST /api/order             → one-click order links for a chosen chain

import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { chains } from '../data/chains.js';
import { products } from '../data/catalog.js';
import { matchLine, matchList } from './matcher.js';
import { compareBasket, buildOrderLinks } from './compare.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/catalog', (_req, res) => {
  res.json({
    chains: chains.map(({ id, nameHe, name, color, homeUrl }) => ({
      id, nameHe, name, color, homeUrl,
    })),
    products: products.map(({ id, nameHe, name, category, unit, prices }) => ({
      id, nameHe, name, category, unit,
      minPrice: Math.min(...Object.values(prices).filter((v) => v != null)),
    })),
  });
});

app.get('/api/search', (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ results: [] });
  const best = matchLine(q);
  const norm = q.toLowerCase();
  const results = products
    .filter((p) =>
      p.nameHe.includes(q) ||
      p.name.toLowerCase().includes(norm) ||
      (p.keywords || []).some((k) => k.toLowerCase().includes(norm) || norm.includes(k.toLowerCase())),
    )
    .slice(0, 12)
    .map((p) => ({
      id: p.id, nameHe: p.nameHe, name: p.name, category: p.category, unit: p.unit,
      minPrice: Math.min(...Object.values(p.prices).filter((v) => v != null)),
    }));
  res.json({ results, best: best && best.product ? best.product.id : null });
});

app.post('/api/match', (req, res) => {
  const text = String(req.body?.text || '');
  if (!text.trim()) return res.status(400).json({ error: 'empty list' });
  res.json(matchList(text));
});

app.post('/api/compare', (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (items.length === 0) return res.status(400).json({ error: 'empty basket' });
  res.json(compareBasket(items));
});

app.post('/api/order', (req, res) => {
  const { chainId, items } = req.body || {};
  const out = buildOrderLinks(chainId, Array.isArray(items) ? items : []);
  if (!out) return res.status(400).json({ error: 'unknown chain' });
  res.json(out);
});

const PORT = process.env.PORT || 3000;

// Only listen when run directly (keeps the module importable from tests).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`🛒 Sal Zol running at http://localhost:${PORT}`);
  });
}

export { app };
