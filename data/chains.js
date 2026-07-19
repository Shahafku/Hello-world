// Israeli supermarket chains.
//
// `searchUrl` is a template that deep-links to a product for a given chain;
// `{q}` is replaced with the URL-encoded product name.
//
// Link strategy: chain sites change their URL schemes often and cannot be
// verified from this build environment, so only formats we are confident in
// link directly into the store (`direct: true`). Everything else routes
// through a Google site-search scoped to the chain's domain — those links
// always resolve and land the shopper on the chain's own product page.
//
// Prices in the catalog are modelled on Israel's price-transparency programme
// ("מחירים שקופים"). See data/README-prices.md for how to swap the sample
// catalog for a live feed.

const googleSearch = (domain) =>
  `https://www.google.com/search?q={q}+site%3A${domain}`;

export const chains = [
  {
    id: 'shufersal',
    name: 'Shufersal',
    nameHe: 'שופרסל',
    color: '#e2001a',
    domain: 'shufersal.co.il',
    homeUrl: 'https://www.shufersal.co.il/online/he',
    // SAP Hybris standard search route.
    searchUrl: 'https://www.shufersal.co.il/online/he/search?text={q}',
    direct: true,
  },
  {
    id: 'ramilevy',
    name: 'Rami Levy',
    nameHe: 'רמי לוי',
    color: '#0060a9',
    domain: 'rami-levy.co.il',
    homeUrl: 'https://www.rami-levy.co.il/he',
    searchUrl: googleSearch('rami-levy.co.il'),
    direct: false,
  },
  {
    id: 'victory',
    name: 'Victory',
    nameHe: 'ויקטורי',
    color: '#8a1a2b',
    domain: 'victoryonline.co.il',
    homeUrl: 'https://www.victoryonline.co.il',
    searchUrl: googleSearch('victoryonline.co.il'),
    direct: false,
  },
  {
    id: 'yochananof',
    name: 'Yochananof',
    nameHe: 'יוחננוף',
    color: '#00863f',
    domain: 'yochananof.co.il',
    homeUrl: 'https://yochananof.co.il',
    searchUrl: googleSearch('yochananof.co.il'),
    direct: false,
  },
  {
    id: 'osherad',
    name: 'Osher Ad',
    nameHe: 'אושר עד',
    color: '#f39200',
    domain: 'osherad.co.il',
    homeUrl: 'https://www.osherad.co.il',
    searchUrl: googleSearch('osherad.co.il'),
    direct: false,
  },
  {
    id: 'tivtaam',
    name: 'Tiv Taam',
    nameHe: 'טיב טעם',
    color: '#6a2c8f',
    domain: 'tivtaam.co.il',
    homeUrl: 'https://www.tivtaam.co.il',
    searchUrl: googleSearch('tivtaam.co.il'),
    direct: false,
  },
];

export const chainById = Object.fromEntries(chains.map((c) => [c.id, c]));
