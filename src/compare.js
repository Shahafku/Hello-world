// Basket comparison engine: given a list of { productId, qty }, compute the
// total cost at every chain, flag items a chain doesn't carry, and rank chains
// so the cheapest full basket wins.

import { chains } from '../data/chains.js';
import { productById } from '../data/catalog.js';

// A chain that is missing items is penalised: you'd have to shop elsewhere for
// them, so its "effective" total adds the cheapest available price of each
// missing item (a fair lower bound on what completing the basket costs).
export function compareBasket(items) {
  const normalized = (items || [])
    .map((it) => ({ product: productById[it.productId], qty: Number(it.qty) || 1 }))
    .filter((it) => it.product);

  const results = chains.map((chain) => {
    const lines = [];
    let subtotal = 0;
    const missing = [];

    for (const { product, qty } of normalized) {
      const price = product.prices[chain.id];
      if (price == null) {
        missing.push({ productId: product.id, nameHe: product.nameHe, qty });
        continue;
      }
      const lineTotal = +(price * qty).toFixed(2);
      subtotal = +(subtotal + lineTotal).toFixed(2);
      lines.push({
        productId: product.id,
        nameHe: product.nameHe,
        qty,
        unit: product.unit,
        unitPrice: price,
        lineTotal,
      });
    }

    // Cost to complete missing items at their cheapest chain.
    let completionCost = 0;
    for (const m of missing) {
      const p = productById[m.productId];
      const cheapest = Math.min(
        ...Object.values(p.prices).filter((v) => v != null),
      );
      if (Number.isFinite(cheapest)) {
        completionCost = +(completionCost + cheapest * m.qty).toFixed(2);
      }
    }

    return {
      chainId: chain.id,
      chainName: chain.name,
      chainNameHe: chain.nameHe,
      color: chain.color,
      homeUrl: chain.homeUrl,
      lines,
      subtotal,
      missing,
      itemsFound: lines.length,
      itemsMissing: missing.length,
      effectiveTotal: +(subtotal + completionCost).toFixed(2),
    };
  });

  // Rank: complete baskets first (fewest missing), then by effective total.
  const ranked = [...results].sort((a, b) => {
    if (a.itemsMissing !== b.itemsMissing) return a.itemsMissing - b.itemsMissing;
    return a.effectiveTotal - b.effectiveTotal;
  });

  ranked.forEach((r, i) => {
    r.rank = i + 1;
  });

  const cheapest = ranked[0] || null;
  const priciest = ranked[ranked.length - 1] || null;
  const savings =
    cheapest && priciest
      ? +(priciest.effectiveTotal - cheapest.effectiveTotal).toFixed(2)
      : 0;

  return {
    itemCount: normalized.length,
    results: ranked,
    cheapest,
    savings,
  };
}

// Build one-click order links for a given chain and basket. Each item links to
// the chain's store search when the URL format is verified (`direct`), or to a
// Google search scoped to the chain's domain otherwise — those always resolve
// and land on the chain's own product page.
export function buildOrderLinks(chainId, items) {
  const chain = chains.find((c) => c.id === chainId);
  if (!chain) return null;
  const enriched = (items || [])
    .map((it) => ({ product: productById[it.productId], qty: Number(it.qty) || 1 }))
    .filter((it) => it.product);
  const links = enriched
    .filter(({ product }) => product.prices[chainId] != null)
    .map(({ product, qty }) => ({
      productId: product.id,
      nameHe: product.nameHe,
      qty,
      url: chain.searchUrl.replace('{q}', encodeURIComponent(product.nameHe)),
    }));
  return {
    chainId,
    chainNameHe: chain.nameHe,
    homeUrl: chain.homeUrl,
    direct: !!chain.direct,
    links,
    // Full basket (including items this chain may not stock) for the
    // cart-filler bookmarklet — the shopper decides on substitutes in-store.
    allItems: enriched.map(({ product, qty }) => ({ nameHe: product.nameHe, qty })),
  };
}
