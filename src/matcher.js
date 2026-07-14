// Matches free-text grocery items (typed or uploaded) to catalog products.
//
// The goal is to be forgiving: users write "חלב", "2 קג עגבניות", "milk", or
// "טונה 5" and we map each line to the best catalog product plus a quantity.

import { products } from '../data/catalog.js';

// Strip leading quantity ("2", "1.5", "3x") and unit words so the remaining
// text is a clean item name. Returns { qty, text }.
export function parseQuantity(raw) {
  const line = String(raw).trim();
  // Leading number, optionally followed by x/× or a unit word.
  const m = line.match(/^(\d+(?:[.,]\d+)?)\s*(?:x|×|יח['׳]?|יחידות|ק["״']?ג|קג|kg|גרם|g)?\s*[-–]?\s*(.*)$/i);
  if (m && m[2].trim().length > 0) {
    const qty = parseFloat(m[1].replace(',', '.'));
    return { qty: qty > 0 ? qty : 1, text: m[2].trim() };
  }
  // Trailing number ("טונה 5").
  const t = line.match(/^(.*?)\s+(\d+(?:[.,]\d+)?)\s*(?:x|×|יח['׳]?)?$/);
  if (t && t[1].trim().length > 0) {
    return { qty: parseFloat(t[2].replace(',', '.')) || 1, text: t[1].trim() };
  }
  return { qty: 1, text: line };
}

function normalize(s) {
  return String(s)
    .toLowerCase()
    .replace(/["״'׳`]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Score how well a query matches a product. Higher is better; 0 = no match.
function scoreProduct(query, product) {
  const q = normalize(query);
  if (!q) return 0;
  const qTokens = q.split(' ').filter(Boolean);

  const haystacks = [
    ...(product.keywords || []),
    product.nameHe,
    product.name,
  ].map(normalize);

  let best = 0;
  for (const kw of product.keywords || []) {
    const k = normalize(kw);
    if (q === k) best = Math.max(best, 100); // exact keyword hit
    else if (q.includes(k) || k.includes(q)) best = Math.max(best, 80);
  }

  // Token overlap against the full name/keywords.
  const hayJoined = haystacks.join(' ');
  let hits = 0;
  for (const tok of qTokens) {
    if (tok.length < 2) continue;
    if (hayJoined.includes(tok)) hits += 1;
  }
  if (hits > 0) best = Math.max(best, 40 + hits * 15);

  return best;
}

// Match a single free-text line. Returns { product, qty, score } or null.
export function matchLine(raw) {
  const { qty, text } = parseQuantity(raw);
  if (!text) return null;

  let best = null;
  for (const product of products) {
    const score = scoreProduct(text, product);
    if (score > 0 && (!best || score > best.score)) {
      best = { product, qty, score };
    }
  }
  if (!best || best.score < 40) {
    return { product: null, qty, score: 0, query: text };
  }
  return { product: best.product, qty, score: best.score, query: text };
}

// Match a whole uploaded/pasted list (newline or comma separated).
export function matchList(text) {
  const lines = String(text)
    .split(/[\n,;]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const matched = [];
  const unmatched = [];
  for (const line of lines) {
    const res = matchLine(line);
    if (res && res.product) {
      // Merge duplicates.
      const existing = matched.find((m) => m.productId === res.product.id);
      if (existing) existing.qty += res.qty;
      else matched.push({ productId: res.product.id, qty: res.qty, query: res.query });
    } else {
      unmatched.push(line);
    }
  }
  return { matched, unmatched };
}
