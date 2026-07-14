// Israeli supermarket chains.
//
// `searchUrl` is a template used to deep-link into each chain's real online
// store for a given product (one-click ordering hands the shopper straight to
// the item on the cheapest chain's site). `{q}` is replaced with the
// URL-encoded product name.
//
// Prices in the catalog are modelled on Israel's price-transparency programme
// ("מחירים שקופים" / Transparency Prices), under which every chain must publish
// its full price list as public XML. See data/README-prices.md for how to swap
// the sample catalog for a live feed.

export const chains = [
  {
    id: 'shufersal',
    name: 'Shufersal',
    nameHe: 'שופרסל',
    color: '#e2001a',
    homeUrl: 'https://www.shufersal.co.il/online/he',
    searchUrl: 'https://www.shufersal.co.il/online/he/search?text={q}',
  },
  {
    id: 'ramilevy',
    name: 'Rami Levy',
    nameHe: 'רמי לוי',
    color: '#0060a9',
    homeUrl: 'https://www.rami-levy.co.il/he',
    searchUrl: 'https://www.rami-levy.co.il/he/online/search?q={q}',
  },
  {
    id: 'victory',
    name: 'Victory',
    nameHe: 'ויקטורי',
    color: '#8a1a2b',
    homeUrl: 'https://www.victoryonline.co.il',
    searchUrl: 'https://www.victoryonline.co.il/search?q={q}',
  },
  {
    id: 'yochananof',
    name: 'Yochananof',
    nameHe: 'יוחננוף',
    color: '#00863f',
    homeUrl: 'https://yochananof.co.il',
    searchUrl: 'https://yochananof.co.il/catalogsearch/result/?q={q}',
  },
  {
    id: 'osherad',
    name: 'Osher Ad',
    nameHe: 'אושר עד',
    color: '#f39200',
    homeUrl: 'https://www.osherad.co.il',
    searchUrl: 'https://www.osherad.co.il/search?q={q}',
  },
  {
    id: 'tivtaam',
    name: 'Tiv Taam',
    nameHe: 'טיב טעם',
    color: '#6a2c8f',
    homeUrl: 'https://www.tivtaam.co.il',
    searchUrl: 'https://www.tivtaam.co.il/search?q={q}',
  },
];

export const chainById = Object.fromEntries(chains.map((c) => [c.id, c]));
