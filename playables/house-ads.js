// House ads: De-Evolution Studios' own playable ads, shown inside our games when they ask for an ad.
// The source lives in the website repo (_src/playables/house-ads.js, published at /playables/house-ads.js); each game
// keeps its own copy (no code is loaded from the web, only the ad pages themselves).
//
// The list and the rules come from https://deevolutionstudios.com/promo/ads.json (built from the website's games.js),
// so new games, store links and tuning reach every game without an app update. Kept on the phone for offline.
//
//   <script src="house-ads.js"></script>   (a plain script, so classic and module games can both use it: window.HouseAds)
//   const House = window.HouseAds;
//   House.init({ self: 'd2048' });                 // once, at start (fetches the list in the background)
//   if (House.wantsTurn()) ...                     // this ad request should be one of ours (the `share` rule)
//   House.show({ rewarded: true })                 // resolves true once earned; rejects 'skipped' (closed early) or 'none'
//
// Serving rules (ads.json "rules"): never the game you're in; only games live in this phone's store (the web build
// uses their web pages); each game at most `perGamePerDay` times a day; a game the player tapped "Play free" on is left
// out for `afterTapDays`; otherwise the one shown least recently. AdMob fills the rest, and one of ours fills in
// whenever AdMob has nothing (`fallback`).
//
// The playable runs in a sandboxed frame and talks by postMessage: {dvsAd: 'ready'|'start'|'complete'|'cta', game}.
// A rewarded ad pays out on 'complete' (the playable's end card) or after `rewardAfterSec`.

(function () {
const LIST = 'https://deevolutionstudios.com/promo/ads.json';
const KEY = 'dvs.houseads';            // localStorage: { list, shown: {id: {day, n, at}}, tapped: {id: time} }
const DEFAULT_RULES = { share: 0.2, fallback: true, perGamePerDay: 2, afterTapDays: 14, rewardAfterSec: 25, closeAfterSec: 5 };
let opts = { self: '', list: LIST, sound: () => true, open: url => window.open(url, '_blank'), onShow: null, onEvent: null };
let state = load();
const html = {};                       // playable pages fetched this session, by game id

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode: fine */ } }
const today = () => new Date().toISOString().slice(0, 10);
const rules = () => Object.assign({}, DEFAULT_RULES, state.list && state.list.rules);
const platform = () => (window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform())
  || (/iPhone|iPad|iPod/.test(navigator.userAgent) ? 'ios' : /Android/.test(navigator.userAgent) ? 'android' : 'web');
const safe = u => (typeof u === 'string' && /^https:\/\//.test(u) ? u : null);
const storeOf = a => { const p = platform(); return p === 'ios' ? safe(a.ios) : p === 'android' ? safe(a.android) : safe(a.page); };

function init(o) {
  opts = Object.assign(opts, o || {});
  return refresh();
}
async function refresh() {
  try {
    const r = await fetch(opts.list, { cache: 'no-cache' });
    if (r.ok) { state.list = await r.json(); persist(); }
  } catch (e) { /* offline: keep the last list */ }
}

// The games we could show right now, best first.
function candidates() {
  const R = rules(), now = Date.now(), d = today();
  const ads = ((state.list && state.list.ads) || []).filter(a => a && a.id !== opts.self && safe(a.playable) && storeOf(a));
  return ads.filter(a => {
    const s = (state.shown || {})[a.id], t = (state.tapped || {})[a.id];
    if (s && s.day === d && s.n >= R.perGamePerDay) return false;
    if (t && now - t < R.afterTapDays * 86400000) return false;
    return true;
  }).sort((x, y) => (((state.shown || {})[x.id] || {}).at || 0) - (((state.shown || {})[y.id] || {}).at || 0));
}
// Should this ad request be one of ours? (a share of requests, when we have one to show)
function wantsTurn() { return candidates().length > 0 && Math.random() < rules().share; }
// When AdMob has nothing, can we fill in?
function canFill() { return rules().fallback && candidates().length > 0; }

async function page(a) {
  if (html[a.id]) return html[a.id];
  const r = await fetch(a.playable, { cache: 'no-cache' });
  if (!r.ok) throw new Error('playable ' + r.status);
  return (html[a.id] = await r.text());
}

// Shows one of our playables full screen. Resolves true when a rewarded ad was earned (or any ad was closed after
// it could be); rejects 'skipped' if a rewarded ad was closed early, 'none' if there's nothing to show.
async function show({ rewarded = false } = {}) {
  const list = candidates();
  let a = null, doc = null;
  for (const c of list) { try { doc = await page(c); a = c; break; } catch (e) { /* try the next */ } }
  if (!a) throw 'none';
  const R = rules();
  const s = (state.shown || (state.shown = {}))[a.id] || {};
  state.shown[a.id] = { day: today(), n: (s.day === today() ? s.n : 0) + 1, at: Date.now() };
  persist();
  if (opts.onEvent) opts.onEvent('house_ad_show', { game: a.id, rewarded });
  if (opts.onShow) opts.onShow(true);

  return new Promise((resolve, reject) => {
    const root = document.createElement('div');
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', `Ad: ${a.name}`);
    root.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#000;';
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');   // its own little world: no access to the game, its storage or cookies
    frame.setAttribute('allow', 'autoplay');
    frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
    frame.srcdoc = doc;
    const tag = document.createElement('div');
    tag.textContent = 'Ad';
    tag.style.cssText = 'position:absolute;left:calc(10px + env(safe-area-inset-left));top:calc(10px + env(safe-area-inset-top));padding:3px 8px;border-radius:6px;background:rgba(0,0,0,.55);color:#fff;font:700 12px/1.2 system-ui,sans-serif;pointer-events:none;';
    const x = document.createElement('button');
    x.type = 'button'; x.setAttribute('aria-label', 'Close ad');
    x.style.cssText = 'position:absolute;right:calc(10px + env(safe-area-inset-right));top:calc(10px + env(safe-area-inset-top));width:40px;height:40px;border-radius:50%;border:2px solid rgba(255,255,255,.85);background:rgba(0,0,0,.55);color:#fff;font:700 18px/1 system-ui,sans-serif;display:none;cursor:pointer;';
    const count = document.createElement('div');
    count.style.cssText = 'position:absolute;right:calc(10px + env(safe-area-inset-right));top:calc(10px + env(safe-area-inset-top));padding:6px 10px;border-radius:20px;background:rgba(0,0,0,.55);color:#fff;font:700 13px/1 system-ui,sans-serif;pointer-events:none;';
    root.append(frame, tag, count, x);
    document.body.appendChild(root);

    let earned = !rewarded, done = false, secs = 0;
    // top right: a countdown until the X shows; on a rewarded ad not yet earned, "Reward in N" beside the X
    function paint() {
      const canClose = earned || secs >= R.closeAfterSec;
      x.style.display = canClose ? 'block' : 'none'; x.textContent = '\u2715';
      const waitReward = rewarded && !earned;
      count.style.display = waitReward || !canClose ? 'block' : 'none';
      count.style.right = canClose ? 'calc(60px + env(safe-area-inset-right))' : 'calc(10px + env(safe-area-inset-right))';
      count.textContent = waitReward ? `Reward in ${Math.max(1, R.rewardAfterSec - secs)}` : String(R.closeAfterSec - secs);
    }
    const tick = setInterval(() => { secs++; if (rewarded && secs >= R.rewardAfterSec) earned = true; paint(); }, 1000);
    paint();
    const showX = paint;

    function onMsg(e) {
      if (e.source !== frame.contentWindow) return;
      const d = e.data || {};
      if (d.dvsAd === 'ready') frame.contentWindow.postMessage({ dvsAd: 'sound', on: !!opts.sound() }, '*');
      else if (d.dvsAd === 'complete') { earned = true; paint(); }
      else if (d.dvsAd === 'cta') {
        (state.tapped || (state.tapped = {}))[a.id] = Date.now(); persist();
        if (opts.onEvent) opts.onEvent('house_ad_tap', { game: a.id });
        const url = storeOf(a); if (url) opts.open(url);
        earned = true; showX();
      }
    }
    function close() {
      if (done) return; done = true;
      clearInterval(tick); removeEventListener('message', onMsg); root.remove();
      if (opts.onShow) opts.onShow(false);
      if (earned) resolve(true); else reject('skipped');
    }
    x.addEventListener('click', close);
    addEventListener('message', onMsg);
  });
}

window.HouseAds = { init, refresh, candidates, wantsTurn, canFill, show, platform };
})();
