import { test } from 'node:test';
import assert from 'node:assert/strict';

import { compareBasket, buildOrderLinks } from './compare.js';
import { matchList, parseQuantity, matchLine } from './matcher.js';

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
