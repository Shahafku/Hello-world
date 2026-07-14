// Sal Zol — frontend logic. Vanilla JS, no build step.

const state = {
  catalog: { chains: [], products: [] },
  productById: {},
  basket: /** @type {Map<string, number>} */ (new Map()), // productId -> qty
  lastCompare: null,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const ils = (n) => `${n.toFixed(2)} ₪`;

// ---- boot ----
async function boot() {
  const res = await fetch('/api/catalog');
  state.catalog = await res.json();
  state.productById = Object.fromEntries(state.catalog.products.map((p) => [p.id, p]));
  restoreBasket();
  renderCategories();
  renderBasket();
  wireEvents();
}

function restoreBasket() {
  try {
    const saved = JSON.parse(localStorage.getItem('salzol.basket') || '[]');
    for (const [id, qty] of saved) if (state.productById[id]) state.basket.set(id, qty);
  } catch { /* ignore */ }
}
function persistBasket() {
  localStorage.setItem('salzol.basket', JSON.stringify([...state.basket.entries()]));
}

// ---- tabs ----
function wireEvents() {
  $$('.tab').forEach((t) =>
    t.addEventListener('click', () => {
      $$('.tab').forEach((x) => x.classList.remove('active'));
      t.classList.add('active');
      $('#panel-search').classList.toggle('hidden', t.dataset.tab !== 'search');
      $('#panel-upload').classList.toggle('hidden', t.dataset.tab !== 'upload');
    }),
  );

  const input = $('#searchInput');
  input.addEventListener('input', debounce(onSearch, 180));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSearch();
  });

  $('#parseBtn').addEventListener('click', onParseUpload);
  $('#fileBtn').addEventListener('click', () => $('#fileInput').click());
  $('#fileInput').addEventListener('change', onFile);

  $('#clearBtn').addEventListener('click', () => {
    state.basket.clear();
    persistBasket();
    renderBasket();
    $('#resultsCard').classList.add('hidden');
  });

  $('#compareBtn').addEventListener('click', onCompare);

  $('#orderClose').addEventListener('click', () => $('#orderModal').classList.add('hidden'));
  $('#orderModal').addEventListener('click', (e) => {
    if (e.target.id === 'orderModal') $('#orderModal').classList.add('hidden');
  });
}

// ---- search ----
async function onSearch() {
  const q = $('#searchInput').value.trim();
  const box = $('#suggestions');
  if (!q) { box.innerHTML = ''; return; }
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  const { results } = await res.json();
  if (results.length === 0) {
    box.innerHTML = `<li style="cursor:default"><span class="sug-meta">לא נמצאו מוצרים תואמים</span></li>`;
    return;
  }
  box.innerHTML = results
    .map(
      (p) => `
    <li data-id="${p.id}">
      <span>
        <span class="sug-name">${escapeHtml(p.nameHe)}</span>
        <span class="sug-meta"> · ${escapeHtml(p.category)} · החל מ־${p.minPrice.toFixed(2)} ₪</span>
      </span>
      <span class="sug-add">＋</span>
    </li>`,
    )
    .join('');
  box.querySelectorAll('li[data-id]').forEach((li) =>
    li.addEventListener('click', () => {
      addToBasket(li.dataset.id, 1);
      $('#searchInput').value = '';
      box.innerHTML = '';
      $('#searchInput').focus();
    }),
  );
}

function renderCategories() {
  const cats = [...new Set(state.catalog.products.map((p) => p.category))];
  $('#categories').innerHTML = cats
    .map((c) => `<button class="cat-chip" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`)
    .join('');
  $$('.cat-chip').forEach((chip) =>
    chip.addEventListener('click', () => showCategory(chip.dataset.cat)),
  );
}

function showCategory(cat) {
  const items = state.catalog.products.filter((p) => p.category === cat);
  const box = $('#suggestions');
  box.innerHTML = items
    .map(
      (p) => `
    <li data-id="${p.id}">
      <span><span class="sug-name">${escapeHtml(p.nameHe)}</span>
      <span class="sug-meta"> · החל מ־${p.minPrice.toFixed(2)} ₪</span></span>
      <span class="sug-add">＋</span>
    </li>`,
    )
    .join('');
  box.querySelectorAll('li[data-id]').forEach((li) =>
    li.addEventListener('click', () => { addToBasket(li.dataset.id, 1); }),
  );
}

// ---- upload / paste ----
async function onParseUpload() {
  const text = $('#uploadText').value.trim();
  const out = $('#uploadResult');
  if (!text) { out.innerHTML = '<span class="warn">הרשימה ריקה.</span>'; return; }
  const res = await fetch('/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const { matched, unmatched } = await res.json();
  for (const m of matched) addToBasket(m.productId, m.qty, true);
  renderBasket();
  let html = `<span class="ok">✓ נוספו ${matched.length} פריטים לסל.</span>`;
  if (unmatched.length) {
    html += `<br><span class="warn">לא זוהו: ${unmatched.map(escapeHtml).join(', ')}</span>`;
  }
  out.innerHTML = html;
  $('#uploadText').value = '';
}

function onFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { $('#uploadText').value = reader.result; };
  reader.readAsText(file);
}

// ---- basket ----
function addToBasket(id, qty = 1, silent = false) {
  if (!state.productById[id]) return;
  state.basket.set(id, (state.basket.get(id) || 0) + qty);
  persistBasket();
  if (!silent) renderBasket();
}
function setQty(id, qty) {
  if (qty <= 0) state.basket.delete(id);
  else state.basket.set(id, qty);
  persistBasket();
  renderBasket();
}

function renderBasket() {
  const list = $('#basketList');
  const count = [...state.basket.values()].reduce((a, b) => a + b, 0);
  $('#basketCount').textContent = state.basket.size;
  $('#compareBtn').disabled = state.basket.size === 0;
  $('#basketEmpty').classList.toggle('hidden', state.basket.size > 0);

  list.innerHTML = [...state.basket.entries()]
    .map(([id, qty]) => {
      const p = state.productById[id];
      return `
      <li class="basket-item" data-id="${id}">
        <span class="name">${escapeHtml(p.nameHe)}<br><span class="unit">${escapeHtml(p.unit)} · החל מ־${p.minPrice.toFixed(2)} ₪</span></span>
        <span class="qty">
          <button data-act="dec">−</button>
          <span>${qty}</span>
          <button data-act="inc">＋</button>
        </span>
        <button class="remove" data-act="rm" title="הסרה">🗑️</button>
      </li>`;
    })
    .join('');

  list.querySelectorAll('.basket-item').forEach((li) => {
    const id = li.dataset.id;
    const qty = state.basket.get(id);
    li.querySelector('[data-act="inc"]').onclick = () => setQty(id, qty + 1);
    li.querySelector('[data-act="dec"]').onclick = () => setQty(id, qty - 1);
    li.querySelector('[data-act="rm"]').onclick = () => setQty(id, 0);
  });
}

// ---- compare ----
async function onCompare() {
  const items = [...state.basket.entries()].map(([productId, qty]) => ({ productId, qty }));
  const btn = $('#compareBtn');
  btn.disabled = true; btn.textContent = 'משווה…';
  const res = await fetch('/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  const data = await res.json();
  state.lastCompare = data;
  renderResults(data);
  btn.disabled = false; btn.textContent = '🔍 השוואת מחירים ומציאת הסל הזול';
}

function renderResults(data) {
  const card = $('#resultsCard');
  card.classList.remove('hidden');
  const max = Math.max(...data.results.map((r) => r.effectiveTotal), 1);
  const w = data.cheapest;

  $('#winner').innerHTML = `
    <div class="crown">👑</div>
    <h3>${escapeHtml(w.chainNameHe)} — הסל הזול ביותר</h3>
    <div class="amount" style="font-size:1.6rem;font-weight:800">${ils(w.effectiveTotal)}</div>
    ${data.savings > 0 ? `<div class="save">חיסכון של עד ${ils(data.savings)} לעומת הרשת היקרה ביותר</div>` : ''}
    <button class="btn primary" onclick="orderFrom('${w.chainId}')">🛒 הזמינו מ${escapeHtml(w.chainNameHe)} בקליק</button>
  `;

  $('#results').innerHTML = data.results
    .map((r) => {
      const pct = Math.round((r.effectiveTotal / max) * 100);
      return `
      <div class="result-row ${r.rank === 1 ? 'best' : ''}">
        <div class="rank-badge" style="background:${r.color}">${r.rank}</div>
        <div class="result-main">
          <div class="cname">${escapeHtml(r.chainNameHe)}</div>
          <div class="cmeta">${r.itemsFound} פריטים ${r.itemsMissing ? `· <span class="missing-tag">${r.itemsMissing} חסרים</span>` : '· סל מלא ✓'}</div>
          <div class="bar"><div style="width:${pct}%;background:${r.color}"></div></div>
        </div>
        <div class="result-total">
          <div><span class="amount">${r.effectiveTotal.toFixed(2)}</span> <span class="cur">₪</span></div>
          <button class="btn ghost small order-btn" onclick="orderFrom('${r.chainId}')">הזמנה ←</button>
        </div>
      </div>`;
    })
    .join('');

  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- order (one click) ----
async function orderFrom(chainId) {
  const items = [...state.basket.entries()].map(([productId, qty]) => ({ productId, qty }));
  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chainId, items }),
  });
  const data = await res.json();
  const chainResult = state.lastCompare?.results.find((r) => r.chainId === chainId);

  $('#orderTitle').textContent = `הזמנה מ${data.chainNameHe}`;
  $('#orderIntro').innerHTML =
    `לחיצה על "פתחו את כל הפריטים" תפתח את חנות ${escapeHtml(data.chainNameHe)} עם כל מוצר מוכן לחיפוש והוספה לעגלה. ` +
    (chainResult ? `סה״כ משוער: <b>${ils(chainResult.subtotal)}</b>.` : '');

  $('#orderLinks').innerHTML = data.links
    .map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener">🔗 ${escapeHtml(l.nameHe)}</a></li>`)
    .join('');

  $('#openAllBtn').onclick = () => {
    // Open the store home first, then each item search in new tabs.
    window.open(data.homeUrl, '_blank', 'noopener');
    data.links.forEach((l, i) => setTimeout(() => window.open(l.url, '_blank', 'noopener'), i * 250));
  };
  $('#copyListBtn').onclick = () => {
    const txt = data.links.map((l) => `• ${l.nameHe}`).join('\n');
    navigator.clipboard.writeText(txt).then(() => {
      $('#copyListBtn').textContent = '✓ הועתק';
      setTimeout(() => ($('#copyListBtn').textContent = '📋 העתקת הרשימה'), 1500);
    });
  };

  $('#orderModal').classList.remove('hidden');
}
window.orderFrom = orderFrom;

// ---- utils ----
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]),
  );
}

boot();
