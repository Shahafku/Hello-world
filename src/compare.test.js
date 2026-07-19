import { test } from 'node:test';
import assert from 'node:assert/strict';

import { compareBasket, buildOrderLinks } from './compare.js';
import { matchList, parseQuantity, matchLine } from './matcher.js';
import { buildBookmarklet } from './assistant.js';

test('compareBasket ranks the cheapest chain first', () => {
  const basket = [
    { productId: 'milk-3', qty: 2 },
    { productId: 'bread-white', qty: 1 },
    { productId: 'eggs-12', qty: 1 },
  ];
  const out = compareBasket(basket);
  assert.equal(out.itemCount, 3);
  assert.ok(out.cheapest);
  assert.equal(out.results[0].rank, 1);
  // Cheapest effective total must be <= every other chain.
  for (const r of out.results) {
    assert.ok(out.cheapest.effectiveTotal <= r.effectiveTotal + 1e-9);
  }
});

test('missing items are penalised via completion cost', () => {
  // challah is null at yochananof.
  const out = compareBasket([{ productId: 'challah', qty: 1 }]);
  const yoch = out.results.find((r) => r.chainId === 'yochananof');
  assert.equal(yoch.itemsMissing, 1);
  assert.ok(yoch.effectiveTotal > 0); // still costed via cheapest available
});

test('buildOrderLinks skips items a chain does not carry', () => {
  const links = buildOrderLinks('yochananof', [
    { productId: 'milk-3', qty: 1 },
    { productId: 'challah', qty: 1 }, // not carried at yochananof
  ]);
  assert.equal(links.links.length, 1);
  assert.equal(links.links[0].productId, 'milk-3');
  assert.ok(links.links[0].url.includes('yochananof'));
});

test('unverified chains get Google site-search links that always resolve', () => {
  const out = buildOrderLinks('victory', [{ productId: 'milk-3', qty: 1 }]);
  assert.equal(out.direct, false);
  assert.ok(out.links[0].url.startsWith('https://www.google.com/search?q='));
  assert.ok(out.links[0].url.includes('site%3Avictoryonline.co.il'));
});

test('verified chains keep direct store search links', () => {
  const out = buildOrderLinks('shufersal', [{ productId: 'milk-3', qty: 1 }]);
  assert.equal(out.direct, true);
  assert.ok(out.links[0].url.startsWith('https://www.shufersal.co.il/online/he/search?text='));
});

test('order payload includes the full basket and a valid bookmarklet', () => {
  const items = [
    { productId: 'milk-3', qty: 2 },
    { productId: 'challah', qty: 1 }, // not carried at yochananof
  ];
  const out = buildOrderLinks('yochananof', items);
  // Links only cover carried items, but the bookmarklet basket covers all.
  assert.equal(out.links.length, 1);
  assert.equal(out.allItems.length, 2);

  const bm = buildBookmarklet(out.allItems);
  assert.ok(bm.startsWith('javascript:'));
  const src = decodeURIComponent(bm.slice('javascript:'.length));
  // Whole basket embedded, including quantities.
  assert.ok(src.includes('חלב תנובה'));
  assert.ok(src.includes('חלה מתוקה'));
  // The embedded script must be syntactically valid JS.
  assert.doesNotThrow(() => new Function(src));
});

test('parseQuantity extracts leading and trailing quantities', () => {
  assert.deepEqual(parseQuantity('2 חלב'), { qty: 2, text: 'חלב' });
  assert.deepEqual(parseQuantity('עגבניות 3'), { qty: 3, text: 'עגבניות' });
  assert.deepEqual(parseQuantity('לחם'), { qty: 1, text: 'לחם' });
});

test('matchLine maps Hebrew and English terms to catalog products', () => {
  assert.equal(matchLine('חלב').product.id, 'milk-3');
  assert.equal(matchLine('milk').product.id, 'milk-3');
  assert.equal(matchLine('2 עגבניות').product.id, 'tomato');
  assert.equal(matchLine('טונה').product.id, 'tuna');
});

test('matchList merges duplicates and reports unmatched', () => {
  const { matched, unmatched } = matchList('חלב\n2 חלב\nמשהו לא קיים בכלל');
  const milk = matched.find((m) => m.productId === 'milk-3');
  assert.equal(milk.qty, 3);
  assert.equal(unmatched.length, 1);
});
