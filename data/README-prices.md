# Price data — sample vs. live

The catalog in `data/catalog.js` ships with **representative sample prices** so
the app runs and compares baskets out of the box. The numbers are illustrative,
not live shelf prices.

## Where real prices come from

Israel's **Price Transparency Law** (חוק לקידום התחרות בענף המזון —
"מחירים שקופים") requires every major supermarket chain to publish its full
price list and promotions as public XML files, updated regularly. Each chain
exposes a public portal, e.g.:

- Shufersal — `prices.shufersal.co.il`
- Rami Levy / others — `url.publishedprices.co.il` (login: the chain name)
- Government aggregator — `www.gov.il/he/departments/legalInfo/cpfta_prices_regulations`

Community aggregators such as **chp.co.il** and open-source projects like
**israeli-supermarket-scarpers** already normalise these feeds.

## Swapping the sample data for a live feed

`data/catalog.js` exports `products`, where each product has a `prices` map of
`chainId → price`. To go live, replace the static export with an ingestion step:

1. **Download** each chain's `PriceFull` XML (per store/branch).
2. **Parse** the `<Item>` entries: `ItemCode` (barcode), `ItemName`, `ItemPrice`.
3. **Match** items across chains by `ItemCode` (barcode) — the reliable join key.
4. **Emit** the same `{ id, nameHe, prices: { chainId: price } }` shape.

Because the comparison engine (`src/compare.js`) only reads the `prices` map,
nothing else in the app needs to change — the UI, matching, ranking and
one-click order links all keep working against real data.

## One-click ordering

`data/chains.js` holds each chain's real online-store `searchUrl`. One-click
order deep-links every basket item straight into the chain's store search, so
the shopper lands on the cheapest chain with their items ready to add to the
cart. Fully automated checkout would additionally require each chain's
authenticated cart API (or an official partnership), which is the natural next
integration step.
