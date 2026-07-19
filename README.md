# 🛒 סל זול · Sal Zol

Build or upload a grocery list, find **which Israeli supermarket chain has the
cheapest basket**, and order it in **one click**.

> Hebrew, right-to-left web app. Prices are modelled on Israel's mandated
> price-transparency data ("מחירים שקופים"); see
> [`data/README-prices.md`](data/README-prices.md) to plug in a live feed.

## What it does

1. **Build a list** — search a catalog of common Israeli groceries (Hebrew or
   English) and add items with quantities, or
2. **Upload a list** — paste / upload a `.txt`/`.csv` list; each line is
   fuzzy-matched to a product, including quantities like `2 חלב` or `עגבניות 3`.
3. **Compare** — the basket is priced across every chain (Shufersal, Rami Levy,
   Victory, Yochananof, Osher Ad, Tiv Taam). Chains missing an item are fairly
   penalised, and the **cheapest full basket wins**, with total savings shown.
4. **Order in one click** — a generated **cart-filler bookmarklet** carries the
   whole basket: drag it to your bookmarks bar once, open the winning chain's
   store, click the bookmark — a floating panel appears with your list and, per
   item, fills the store's search box and clicks its "הוספה לסל" button.
   Progress is saved on the store's site, so it resumes across page loads.
   Per-item links are also provided: direct store search where the URL format
   is verified (Shufersal), otherwise a Google search scoped to the chain's
   domain — links that always resolve to the chain's own product pages.

## Run it

```bash
npm install
npm start        # → http://localhost:3000
```

```bash
npm test         # comparison + matching engine tests
npm run dev      # auto-reload while developing
```

## How it's built

| Layer | File(s) | Role |
|-------|---------|------|
| Data | `data/chains.js`, `data/catalog.js` | Chains + per-chain prices (price-transparency shape) |
| Matching | `src/matcher.js` | Free-text / uploaded list → catalog products + quantities |
| Comparison | `src/compare.js` | Basket total per chain, missing-item handling, ranking, order links |
| Cart filler | `src/assistant.js` | Self-contained bookmarklet that fills the chain's cart in the shopper's browser |
| API | `src/server.js` | `/api/catalog`, `/api/search`, `/api/match`, `/api/compare`, `/api/order` |
| UI | `public/` | RTL Hebrew single-page app (no build step) |

### API

| Endpoint | Purpose |
|----------|---------|
| `GET /api/catalog` | All chains and products |
| `GET /api/search?q=` | Search products |
| `POST /api/match` | Match a pasted/uploaded list `{ text }` |
| `POST /api/compare` | Compare a basket `{ items:[{productId,qty}] }` |
| `POST /api/order` | One-click order links `{ chainId, items }` |

## Going live with real prices

The comparison engine only reads each product's `prices` map, so swapping the
sample catalog for live price-transparency XML requires no changes to the UI,
matching, ranking, or ordering. See
[`data/README-prices.md`](data/README-prices.md).
