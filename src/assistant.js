// Cart-filler bookmarklet.
//
// True "list → cart" automation needs each chain's authenticated cart API, so
// instead we generate a bookmarklet the shopper drags to their bookmarks bar.
// Clicked while on the chain's own website (in the shopper's browser, where
// they are logged in), it injects a floating RTL panel with the full grocery
// list and, per item:
//   • fills the site's search box and submits it (framework-safe input events)
//   • tries to click the first visible "הוסף לסל" / add-to-cart button
//   • tracks progress in the chain site's localStorage, so it survives page
//     reloads — re-clicking the bookmarklet resumes where you left off.
//
// Everything is embedded in the javascript: URL itself (no external script,
// no cross-origin fetch), so page CSP connect-src/script-src rules can't
// break it.

// The panel script. Runs on the chain's page. Kept dependency-free and ES5-ish.
function panelSource(itemsJson) {
  return `(function(){
var ITEMS=${itemsJson};
var KEY='salzol_cart_state';
var sig=ITEMS.map(function(i){return i.n+'|'+i.q}).join(';');
var st;try{st=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){st=null}
if(!st||st.sig!==sig)st={sig:sig,done:{}};
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
var old=document.getElementById('salzol-panel');if(old)old.remove();
function visible(el){var r=el.getBoundingClientRect();return r.width>0&&r.height>0}
function findSearch(){
  var sels=['input[type=search]','input[placeholder*="חיפוש"]','input[placeholder*="חפש"]','input[name*="search" i]','input[id*="search" i]','input[class*="search" i]','input[aria-label*="חיפוש"]'];
  for(var i=0;i<sels.length;i++){var els=document.querySelectorAll(sels[i]);for(var j=0;j<els.length;j++){if(visible(els[j]))return els[j]}}
  return null}
function fillSearch(txt){
  var el=findSearch();
  if(!el){alert('לא נמצאה תיבת חיפוש בעמוד. חפשו ידנית: '+txt);return}
  el.focus();
  var set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  set.call(el,txt);
  el.dispatchEvent(new Event('input',{bubbles:true}));
  el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));
  el.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));
  setTimeout(function(){if(el.form&&document.contains(el)&&el.value===txt){try{el.form.requestSubmit?el.form.requestSubmit():el.form.submit()}catch(e){}}},600)}
function tryAdd(){
  var cands=document.querySelectorAll('button,[role="button"],a,input[type=button]');
  for(var i=0;i<cands.length;i++){
    var b=cands[i];if(!visible(b))continue;
    var t=((b.innerText||b.value||'')+' '+(b.getAttribute('aria-label')||'')+' '+(b.title||''));
    if(/הוספה לסל|הוסף לסל|הוספה לעגלה|הוסף לעגלה|add to cart/i.test(t)){b.click();return true}}
  return false}
var css='position:fixed;top:12px;left:12px;z-index:2147483647;direction:rtl;background:#fff;color:#1a2230;border:2px solid #0a8f4e;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.35);width:320px;max-height:75vh;overflow:auto;font:14px/1.5 Arial,sans-serif;padding:12px';
var p=document.createElement('div');p.id='salzol-panel';p.setAttribute('style',css);
var head='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b style="font-size:15px">🛒 סל זול — מילוי עגלה</b><span id="szx" style="cursor:pointer;font-size:20px;color:#888">×</span></div>'+
'<div style="font-size:12px;color:#667;margin-bottom:8px">לכל פריט: 🔍 מחפש בחנות, ➕ מנסה להוסיף לעגלה, ואז סמנו ✓. אם העמוד נטען מחדש — לחצו שוב על הסימנייה להמשיך.</div>';
var rows=ITEMS.map(function(it,i){
  var d=st.done[i]?'checked':'';
  return '<div style="display:flex;align-items:center;gap:6px;padding:6px 0;border-top:1px solid #eee'+(st.done[i]?';opacity:.45':'')+'">'+
  '<input type="checkbox" data-i="'+i+'" '+d+' style="transform:scale(1.2)">'+
  '<span style="flex:1">'+it.n+(it.q>1?' <b>×'+it.q+'</b>':'')+'</span>'+
  '<button data-s="'+i+'" style="border:1px solid #ccc;background:#f6f8fa;border-radius:8px;cursor:pointer;padding:3px 8px">🔍</button>'+
  '<button data-a="'+i+'" style="border:1px solid #ccc;background:#f6f8fa;border-radius:8px;cursor:pointer;padding:3px 8px">➕</button>'+
  '</div>'}).join('');
var foot='<div style="margin-top:10px;display:flex;gap:6px"><button id="szr" style="border:1px solid #ccc;background:#f6f8fa;border-radius:8px;cursor:pointer;padding:5px 10px">איפוס סימונים</button></div>';
p.innerHTML=head+rows+foot;
document.body.appendChild(p);
p.addEventListener('click',function(e){
  var t=e.target;
  if(t.id==='szx'){p.remove();return}
  if(t.id==='szr'){st.done={};save();p.remove();alert('הסימונים אופסו — לחצו שוב על הסימנייה');return}
  if(t.dataset&&t.dataset.s!=null){fillSearch(ITEMS[+t.dataset.s].n)}
  if(t.dataset&&t.dataset.a!=null){if(!tryAdd())alert('לא נמצא כפתור הוספה בעמוד — הוסיפו ידנית וסמנו ✓')}
});
p.addEventListener('change',function(e){
  var t=e.target;
  if(t.dataset&&t.dataset.i!=null){st.done[+t.dataset.i]=t.checked;save();
    var row=t.parentElement;row.style.opacity=t.checked?'.45':'1'}
});
})();`;
}

// Build the javascript: bookmarklet URL for a basket.
// items: [{ nameHe, qty }]
export function buildBookmarklet(items) {
  const compact = (items || []).map((it) => ({
    n: String(it.nameHe || ''),
    q: Number(it.qty) || 1,
  }));
  const src = panelSource(JSON.stringify(compact));
  return `javascript:${encodeURIComponent(src)}`;
}
