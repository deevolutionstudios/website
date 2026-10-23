// Build every page of deevolutionstudios.com into plain HTML files (folder/index.html, so URLs end in "/").
// Hostinger serves the repo as it is (no build step there), so run this and commit the output:
//
//   node tools/build.js
//
// Page text lives here and in tools/games.js; the game privacy policies come from _src/policies (see sync-policies.js).
const fs = require('fs');
const path = require('path');
const { CONTACT, mail, MOBILE, PROJECTS, OLD } = require('./games');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://deevolutionstudios.com';
const YEAR = new Date().getFullYear();
const pages = []; // for the sitemap

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const policy = f => fs.readFileSync(path.join(ROOT, '_src/policies', f), 'utf8').replace(/^<!--[\s\S]*?-->\n/, '');
// Asset URLs carry the file's modified time so a browser never pairs a new page with yesterday's stylesheet.
const v = f => '/' + f + '?v=' + Math.floor(fs.statSync(path.join(ROOT, f)).mtimeMs / 1000).toString(36);

function write(url, html, { sitemap = true } = {}) {
  const file = url.endsWith('.html') ? path.join(ROOT, url) : path.join(ROOT, url, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  if (sitemap) pages.push(url);
}

// ── LAYOUT ─────────────────────────────────────────────────────────────────────────────────────────────────────

const NAV = [['/work/', 'Our Work'], ['/services/', 'Services'], ['/about/', 'About'], ['/support/', 'Support']];

function layout({ url, title, description, body, active, image, noindex }) {
  const full = title ? `${title} — De-Evolution Studios` : 'De-Evolution Studios — We Build Worlds Worth Playing';
  const og = SITE + (image || '/assets/img/studio/hero.webp');
  const links = NAV.map(([href, label]) =>
    `<li><a href="${href}"${active === href ? ' class="active" aria-current="page"' : ''}>${label}</a></li>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${SITE}${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="De-Evolution Studios">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${og}">
<meta property="og:url" content="${SITE}${url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FFF8EC">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/alfa-slab-one-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${v('assets/css/site.css')}">
<script defer src="${v('assets/js/site.js')}"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<nav class="top" aria-label="Main">
  <a href="/" class="nav-logo"><img src="/assets/img/studio/logo-long.png" alt="De-Evolution Studios" width="342" height="19"></a>
  <ul class="nav-links">${links}<li><a href="/contact/" class="nav-cta">Let's Talk</a></li></ul>
  <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span></button>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="/">Home</a>${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}
  <a href="/contact/" class="mob-cta">Let's Talk</a>
</div>
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;
}

function footer() {
  const games = MOBILE.map(g => `<li><a href="/${g.slug}/">${esc(g.shortName || g.name)}</a></li>`).join('');
  return `<footer class="site">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="/" class="footer-logo"><img src="/assets/img/studio/logo-long.png" alt="De-Evolution Studios" width="342" height="19" loading="lazy"></a>
        <p class="footer-about">Games with quirky characters, creative mechanics and just the right amount of chaos. Questions about a game? <a href="mailto:${CONTACT}">${CONTACT}</a></p>
      </div>
      <div class="footer-col"><h2>Games</h2><ul>${games}<li><a href="/work/">All projects</a></li></ul></div>
      <div class="footer-col"><h2>Studio</h2><ul><li><a href="/about/">About</a></li><li><a href="/services/">Services</a></li><li><a href="/contact/">Contact</a></li></ul></div>
      <div class="footer-col"><h2>Help</h2><ul><li><a href="/support/">Support</a></li><li><a href="/support/#delete">Delete your data</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="/impressum/">Impressum</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© ${YEAR} DE-EVOLUTION STUDIOS LLC. All rights reserved.</p>
      <p class="footer-copy">App Store is a service mark of Apple Inc. Google Play is a trademark of Google LLC.</p>
    </div>
  </div>
</footer>`;
}

const pageHeader = (eyebrow, title, sub, { small, crumbs } = {}) => `
<header class="page-header">
  <div class="page-header-inner">
    <div>
      ${crumbs ? `<p class="crumbs">${crumbs}</p>` : ''}
      <span class="page-eyebrow">✦ ${eyebrow}</span>
      <h1 class="page-title${small ? ' small' : ''}">${title}</h1>
    </div>
    ${sub ? `<p class="page-sub">${sub}</p>` : ''}
  </div>
</header>`;

const cta = (title = 'Got a Game Idea?', sub = "Let's get it out of your head and into the world. We're ready when you are.") => `
<section class="cta-wrap">
  <div class="cta-inner fu">
    <h2 class="cta-title">${title}</h2>
    <p class="cta-sub">${sub}</p>
    <div class="acts"><a href="/contact/" class="btn-solid">Start a Conversation</a><a href="/services/" class="btn-outline">See Our Services</a></div>
  </div>
</section>`;

// ── STORE BADGES ───────────────────────────────────────────────────────────────────────────────────────────────

const appStoreUrl = g => `https://apps.apple.com/app/id${g.appStore.id}`;
const playUrl = g => `https://play.google.com/store/apps/details?id=${g.play.id}`;

function badges(g, { web = true } = {}) {
  const apple = '<img class="apple" src="/assets/img/badges/app-store.svg" alt="Download on the App Store" width="132" height="44">';
  const google = '<img class="google" src="/assets/img/badges/google-play.png" alt="Get it on Google Play" width="168" height="65">';
  const one = (live, href, img, label) => live
    ? `<a class="store" href="${href}" rel="noopener">${img}</a>`
    : `<span class="store soon" role="img" aria-label="${label}: coming soon">${img.replace(/alt="[^"]*"/, 'alt=""')}</span>`;
  return `<div class="stores">
    ${one(g.appStore.live, g.appStore.id && appStoreUrl(g), apple, 'App Store')}
    ${one(g.play.live, g.play.id && playUrl(g), google, 'Google Play')}
    ${web && g.web ? `<a class="web-play" href="${g.web}" rel="noopener">▶ Play on the web</a>` : ''}
  </div>`;
}

const icon = (g, size = 64) => `<img class="app-icon" src="/assets/img/${g.slug}/icon.webp" alt="" width="${size}" height="${size}" loading="lazy">`;
const art = g => g.slug === 'colorwise'
  ? `<img src="/assets/img/colorwise/logo.webp" alt="${esc(g.name)}" width="900" height="300" loading="lazy">`
  : `<img src="/assets/img/${g.slug}/feature.webp" alt="${esc(g.name)}" width="1024" height="500" loading="lazy">`;

function appCard(g) {
  return `<article class="app-card fu">
  <a class="app-visual${g.slug === 'colorwise' ? ' cw' : ''}" href="/${g.slug}/" tabindex="-1" aria-hidden="true">${art(g)}</a>
  <div class="app-body">
    <div class="app-top">${icon(g)}<div><span class="app-type">${g.type}${g.comingSoon ? ' · Coming soon' : ''}</span><a class="app-name" href="/${g.slug}/">${esc(g.name)}</a></div></div>
    <p class="app-tag">${g.short}</p>
    ${badges(g)}
    <div class="app-links"><a href="/${g.slug}/">About the game</a><a href="/support/#${g.slug}">Support</a>${g.privacy ? `<a href="/${g.slug}/privacy/">Privacy</a>` : ''}</div>
  </div>
</article>`;
}

function projectCard(p, { linkOld = true } = {}) {
  return `<a href="/${p.slug}/" class="g-card fu" data-type="${p.type}">
  <div class="g-visual"><img src="/assets/img/${p.img}.webp" alt="" loading="lazy">
    <span class="g-badge${p.type.startsWith('mobile') ? ' mobile' : ''}">${p.label}</span>${p.client ? '<span class="g-badge client">Client</span>' : ''}</div>
  <div class="g-body"><span class="g-type">${p.kind}</span><span class="g-title">${esc(p.name)}</span><span class="g-tag">${esc(p.tag)}</span><span class="g-cta">View Project</span></div>
</a>`;
}

// ── HOME ───────────────────────────────────────────────────────────────────────────────────────────────────────

const TICKER = ['Game Development', 'Character Design', 'Game Balancing', 'Creative Consultation', 'Story Creation', 'Card &amp; Board Games', 'Mobile Games'];

write('/', layout({
  url: '/', description: 'De-Evolution Studios makes mobile, card and board games: Candi’s Swamp Hop, D2048, Elementra and Colorwise. Download our games, get support and read our privacy policies.',
  body: `
<section class="hero">
  <div class="hero-inner">
    <div class="hero-card">
      <div class="eyebrow">🎮 &nbsp;Game Studio &amp; Creative Partner</div>
      <h1 class="hero-headline">We Build<br><span class="hl-stamp">Worlds</span><br>Worth <span class="hl-outline">Playing.</span></h1>
      <p class="hero-body">From <strong>mobile apps</strong> to <strong>card &amp; board games</strong>, we create worlds packed with quirky characters, creative mechanics, and just the right amount of chaos. Easy to jump into. <strong>Impossible to put down.</strong></p>
      <div class="acts"><a href="#games" class="btn-solid">Play Our Games</a><a href="/services/" class="btn-outline">What We Do</a></div>
      <div class="hero-stats">
        <div class="stat"><div class="stat-num">7+</div><div class="stat-lbl">Games Shipped</div></div>
        <div class="stat"><div class="stat-num">4</div><div class="stat-lbl">Services</div></div>
        <div class="stat"><div class="stat-num">∞</div><div class="stat-lbl">Ideas Welcome</div></div>
      </div>
    </div>
  </div>
</section>
<div class="ticker" aria-hidden="true"><div class="ticker-track">${[...TICKER, ...TICKER].map(t => `<span class="ticker-item">${t}</span><span class="ticker-item">✦</span>`).join('')}</div></div>

<section class="section-wrap" id="games">
  <div class="section-inner">
    <div class="section-head fu">
      <div><span class="s-eyebrow">✦ Play Now</span><h2 class="s-title">Our Mobile<br>Games.</h2></div>
      <p class="section-sub">For iPhone, iPad and Android. Each game has its own support page and privacy policy, linked below.</p>
    </div>
    <div class="app-grid">${MOBILE.map(appCard).join('\n')}</div>
  </div>
</section>

<section class="band-bone">
  <div class="section-wrap">
    <div class="section-inner">
      <div class="section-head fu">
        <div><span class="s-eyebrow">✦ What We Do</span><h2 class="s-title">How We Can<br>Help You.</h2></div>
        <p class="section-sub">Got an idea stuck in your head? Whether you're starting fresh or stuck somewhere in the middle — we jump in and help make it real.</p>
      </div>
      <div class="services-grid">
        <div class="s-card fu"><span class="pill pill-y">🎮 Development</span><h3 class="s-name">Game Development</h3><p class="s-desc">From first concept sketch to final polished release, we handle every part of the process. Mobile, card, board, or digital — we build games that are easy to pick up and hard to put down.</p><a href="/services/#development" class="s-link">Learn More</a></div>
        <div class="s-card fu"><span class="pill pill-b">⚖️ Balancing</span><h3 class="s-name">Game Design &amp; Balancing</h3><p class="s-desc">Stuck on flow or balance? We dive in, analyze mechanics, spot weaknesses, and refine every piece until it plays exactly right — fair, fun, and satisfying every time.</p><a href="/services/#balancing" class="s-link">Learn More</a></div>
        <div class="s-card fu"><span class="pill pill-g">✍️ Story</span><h3 class="s-name">Character &amp; Story Creation</h3><p class="s-desc">We design characters players care about and build worlds they want to explore. From backstories to dialogue, we handle everything that makes your game's story truly shine.</p><a href="/services/#story" class="s-link">Learn More</a></div>
        <div class="s-card fu"><span class="pill pill-p">💡 Consulting</span><h3 class="s-name">Creative Consultation</h3><p class="s-desc">Need a fresh set of eyes? We review your game, identify strengths and challenges, and help you figure out the next step — whether you're refining or starting over.</p><a href="/services/#consulting" class="s-link">Learn More</a></div>
      </div>
    </div>
  </div>
</section>

<section class="section-wrap">
  <div class="section-inner">
    <div class="section-head fu">
      <div><span class="s-eyebrow">✦ Our Work</span><h2 class="s-title">Games We've<br>Built.</h2></div>
      <a href="/work/" class="btn-outline">View All Projects</a>
    </div>
    <div class="port-grid four">${PROJECTS.filter(p => ['elementra', 'cthulhu', 'gravefall', 'wraps'].includes(p.slug)).map(p => projectCard(p)).join('')}</div>
  </div>
</section>

<section class="color-band band-green">
  <div class="band-inner band-split">
    <div class="fu">
      <img src="/assets/img/studio/logo.webp" alt="" class="band-logo" width="400" height="262" loading="lazy">
      <h2 class="band-title">We're<br>Not<br><span class="hollow">Just</span><br>Devs.</h2>
      <div class="band-body"><p>We're storytellers, designers, and players first. We build games because we love them — and because we know exactly what makes one unforgettable.</p><p>Whether you have a full idea or just a vibe, we meet you where you are and help you get it out of your head and into players' hands.</p></div>
      <a href="/about/" class="btn-white">Meet the Studio</a>
    </div>
    <div class="feat-list fu">
      <div class="feat-item"><div class="fi-ico">🎯</div><div class="fi-txt"><strong>Concept to Launch</strong><span>We handle everything from the first sketch to the final release.</span></div></div>
      <div class="feat-item"><div class="fi-ico">🤝</div><div class="fi-txt"><strong>Your Creative Partner</strong><span>We work with you, not just for you. Your vision stays yours.</span></div></div>
      <div class="feat-item"><div class="fi-ico">😂</div><div class="fi-txt"><strong>Fun Is Non-Negotiable</strong><span>If it's not fun to play, it's not done. We don't ship boring.</span></div></div>
    </div>
  </div>
</section>
${cta()}`,
}));

// ── OUR WORK ───────────────────────────────────────────────────────────────────────────────────────────────────

write('/work/', layout({
  url: '/work/', active: '/work/', title: 'Our Work',
  description: 'Every game De-Evolution Studios has built: mobile games, card games and client work.',
  body: `${pageHeader('Our Work', "Games We've<br>Built.", 'From card games to mobile apps — every project is a world we built from the ground up. Tap any game to learn more.')}
<section class="section-wrap">
  <div class="section-inner">
    <div class="filters fu" role="group" aria-label="Filter projects">
      <button class="filter-btn active" data-filter="all" aria-pressed="true">All Games</button>
      <button class="filter-btn" data-filter="card" aria-pressed="false">Card Games</button>
      <button class="filter-btn" data-filter="mobile" aria-pressed="false">Mobile Games</button>
      <button class="filter-btn" data-filter="client" aria-pressed="false">Client Work</button>
    </div>
    <div class="port-grid">
      ${projectCard({ slug: 'colorwise', name: 'Colorwise', type: 'mobile', label: 'Mobile Game', kind: 'Mobile Game · Coming soon', img: 'colorwise/icon', tag: 'Word or hue? Beat the beat. A neon rhythm game of colors that lie.' })}
      ${PROJECTS.map(p => projectCard(p)).join('\n')}
    </div>
  </div>
</section>
${cta("Got a Game Idea?", "We'd love to build your next world. Let's talk.")}`,
}));

// ── MOBILE GAME PAGES ──────────────────────────────────────────────────────────────────────────────────────────

const gameCrumbs = (g, here) => `<a href="/">Home</a> / ${here ? `<a href="/${g.slug}/">${esc(g.shortName || g.name)}</a> / ${here}` : esc(g.shortName || g.name)}`;

function helpCard(g) {
  const rows = [
    ['/support/#' + g.slug, 'Support &amp; FAQ'],
    g.privacy && [`/${g.slug}/privacy/`, 'Privacy policy'],
    g.deletion && [`/${g.slug}/delete/`, 'Delete your account &amp; data'],
    g.terms && [`/${g.slug}/terms/`, 'Terms of use'],
  ].filter(Boolean);
  return `<div class="info-card fu"><h2>Help &amp; privacy</h2><ul class="help-links">${rows.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}
  <li><a href="mailto:${CONTACT}?subject=${encodeURIComponent(g.shortName || g.name)}">Email us</a></li></ul></div>`;
}

MOBILE.forEach((g, i) => {
  const shots = (g.shots || []).map(s => `<img src="/assets/img/${g.slug}/${s}.webp" alt="" width="540" height="960" loading="lazy">`).join('');
  const extra = (g.extraShots || []).map(s => `<img src="/assets/img/${g.slug}/${s}.webp" alt="" loading="lazy">`).join('');
  const prev = MOBILE[(i + MOBILE.length - 1) % MOBILE.length], next = MOBILE[(i + 1) % MOBILE.length];
  write(`/${g.slug}/`, layout({
    url: `/${g.slug}/`, title: g.name, image: g.slug === 'colorwise' ? '/assets/img/colorwise/logo.webp' : `/assets/img/${g.slug}/feature.webp`,
    description: `${g.name}: ${g.tagline}`,
    body: `
<header class="game-hero">
  <div class="game-hero-inner">
    <div>
      <p class="crumbs">${gameCrumbs(g)}</p>
      <div class="game-id">${icon(g, 92)}<div><span class="page-eyebrow">✦ ${g.type}</span><h1 class="page-title small">${esc(g.name)}</h1></div></div>
      <p class="game-tagline">${g.tagline}</p>
      ${badges(g)}
      ${g.storeNames ? `<p class="form-note" style="text-align:left">Listed as ${g.storeNames}.</p>` : ''}
    </div>
    <div class="game-art${g.slug === 'colorwise' ? ' cw' : ''}">${art(g).replace(' loading="lazy"', '')}</div>
  </div>
</header>
${shots ? `<section class="section-wrap" style="padding-bottom:40px"><div class="section-inner"><h2 class="s-eyebrow">✦ Screenshots</h2><div class="shots fu">${shots}</div></div></section>` : ''}
<section class="section-wrap"${shots ? ' style="padding-top:40px"' : ''}>
  <div class="section-inner game-main">
    <div class="prose fu"><h2>About the Game</h2>${g.about}
      ${extra ? `<h3>From the tabletop edition</h3><div class="shots wide">${extra}</div>` : ''}
    </div>
    <aside>
      <div class="info-card fu"><h2>Game info</h2><table class="info-table"><tbody>${g.info.map(([k, val]) => `<tr><th scope="row">${k}</th><td>${val}</td></tr>`).join('')}<tr><th scope="row">Studio</th><td>De-Evolution Studios</td></tr></tbody></table></div>
      ${helpCard(g)}
    </aside>
  </div>
</section>
<section class="band-bone"><div class="section-wrap" style="padding-top:36px;padding-bottom:36px"><div class="section-inner pager">
  <a href="/${prev.slug}/">← ${esc(prev.shortName || prev.name)}</a><a href="/work/">All projects</a><a href="/${next.slug}/">${esc(next.shortName || next.name)} →</a>
</div></div></section>`,
  }));

  if (g.privacy) {
    write(`/${g.slug}/privacy/`, layout({
      url: `/${g.slug}/privacy/`, title: `${g.shortName || g.name} Privacy Policy`,
      description: `What information ${g.name} collects, why, and the choices you have.`,
      body: `${pageHeader('Privacy Policy', esc(g.name), null, { small: true, crumbs: gameCrumbs(g, 'Privacy') })}
<article class="doc"><div class="prose">
${policy(g.privacy)}
</div>
<div class="callout" style="margin-top:40px"><p><strong>Want your data deleted?</strong> See <a href="/${g.slug}/delete/">how to delete your ${esc(g.shortName || g.name)} account and data</a>.</p></div>
</article>`,
    }));
  }
  if (g.terms) {
    write(`/${g.slug}/terms/`, layout({
      url: `/${g.slug}/terms/`, title: `${g.shortName || g.name} Terms of Use`,
      description: `The terms for playing ${g.name}.`,
      body: `${pageHeader('Terms of Use', esc(g.name), null, { small: true, crumbs: gameCrumbs(g, 'Terms') })}
<article class="doc"><div class="prose">
${policy(g.terms)}
</div></article>`,
    }));
  }
  if (g.deletion) write(`/${g.slug}/delete/`, deletePage(g));
});

function deletePage(g) {
  const d = g.deletion, n = esc(g.name);
  const list = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
  return layout({
    url: `/${g.slug}/delete/`, title: `Delete your ${g.shortName || g.name} data`,
    description: `How to delete your ${g.name} account and data, made by De-Evolution Studios.`,
    body: `${pageHeader('Account &amp; data deletion', `Delete your ${esc(g.shortName || g.name)} data`, null, { small: true, crumbs: gameCrumbs(g, 'Delete your data') })}
<article class="doc"><div class="prose">
<p class="meta">${n} · by De-Evolution Studios (DE-EVOLUTION STUDIOS LLC)</p>
<div class="callout"><p>${d.account}</p></div>
${d.inApp ? `<h2>Delete it in the game</h2><p>${d.inApp}</p><h2>Or ask us by email</h2>` : '<h2>How to ask for deletion</h2>'}
<ol class="steps">${d.steps.map(s => `<li>${s}</li>`).join('')}</ol>
<h2>What is deleted</h2>${list(d.deleted)}
<h2>What is kept, and for how long</h2>${list(d.kept)}
<h2>Data on your device</h2><p>${d.device}</p>
<p>Read the full <a href="/${g.slug}/privacy/">${n} privacy policy</a>, or email ${mail(`${g.shortName || g.name}: question about my data`)} with any question.</p>
</div></article>`,
  });
}

// ── OLDER PROJECT PAGES ────────────────────────────────────────────────────────────────────────────────────────

Object.entries(OLD).forEach(([slug, p]) => {
  const shots = [1, 2, 3].map(n => `<img src="/assets/img/${slug}/shot${n}.webp" alt="" loading="lazy">`).join('');
  write(`/${slug}/`, layout({
    url: `/${slug}/`, title: p.name, image: `/assets/img/${slug}/cover.webp`, description: `${p.name}: ${p.tagline}`,
    body: `
<header class="game-hero">
  <div class="game-hero-inner">
    <div>
      <p class="crumbs"><a href="/">Home</a> / <a href="/work/">Our Work</a> / ${esc(p.name)}</p>
      <span class="page-eyebrow">✦ ${p.eyebrow}</span><h1 class="page-title">${esc(p.name)}</h1>
      <p class="game-tagline">${p.tagline}</p>
    </div>
    <div style="max-width:340px;justify-self:center"><img src="/assets/img/${slug}/cover.webp" alt="${esc(p.name)}" style="border:2.5px solid var(--ink);border-radius:18px;box-shadow:7px 7px 0 var(--ink);display:block"></div>
  </div>
</header>
<section class="section-wrap">
  <div class="section-inner game-main">
    <div class="prose fu"><h2>About the Game</h2>${p.about}<h3>Screenshots &amp; Art</h3><div class="shots wide">${shots}</div></div>
    <aside><div class="info-card fu"><h2>Game info</h2><table class="info-table"><tbody>${p.info.map(([k, val]) => `<tr><th scope="row">${k}</th><td>${val}</td></tr>`).join('')}</tbody></table></div></aside>
  </div>
</section>
${cta('Got a Game Idea?', "Let's build your next world together.")}`,
  }));
});

// ── SUPPORT ────────────────────────────────────────────────────────────────────────────────────────────────────

write('/support/', layout({
  url: '/support/', active: '/support/', title: 'Support',
  description: 'Help with Candi’s Swamp Hop, D2048, Elementra and Colorwise: purchases, accounts, deleting your data and how to contact us.',
  body: `${pageHeader('Player Support', 'How Can<br>We Help?', `Pick your game below, or email <a href="mailto:${CONTACT}">${CONTACT}</a>. You're talking to the people who build the games.`)}
<article class="doc" style="max-width:1000px"><div class="prose">
<div class="support-grid">${MOBILE.map(g => `<a class="support-card" href="#${g.slug}"><img src="/assets/img/${g.slug}/icon.webp" alt="" width="64" height="64"><span>${esc(g.shortName || g.name)}</span></a>`).join('')}</div>
<div class="callout mail-box"><div><strong>Email support</strong><p>Tell us the game, your device (for example iPhone 15 or Pixel 8) and what happened. We reply within 1–2 business days.</p></div><a class="btn-solid btn-sm" href="mailto:${CONTACT}?subject=Support">${CONTACT}</a></div>
${MOBILE.map(g => `<section class="game-faq" id="${g.slug}">
  <div class="game-faq-head"><img src="/assets/img/${g.slug}/icon.webp" alt="" width="44" height="44"><h2>${esc(g.name)}</h2></div>
  <div class="faq-list">${g.faq.map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><div class="faq-a"><p>${a}</p></div></details>`).join('')}</div>
  <p class="game-faq-links"><a href="/${g.slug}/">About the game</a>${g.privacy ? `<a href="/${g.slug}/privacy/">Privacy policy</a>` : ''}${g.deletion ? `<a href="/${g.slug}/delete/">Delete your data</a>` : ''}${g.terms ? `<a href="/${g.slug}/terms/">Terms</a>` : ''}<a href="mailto:${CONTACT}?subject=${encodeURIComponent((g.shortName || g.name) + ' support')}">Email about ${esc(g.shortName || g.name)}</a></p>
</section>`).join('\n')}
<section id="delete" class="game-faq">
  <h2>Deleting your account or data</h2>
  <p>Each game has its own page explaining how to delete your account and data, what is deleted and what is kept:</p>
  <ul>${MOBILE.filter(g => g.deletion).map(g => `<li><a href="/${g.slug}/delete/">${esc(g.name)}</a></li>`).join('')}</ul>
</section>
</div></article>`,
}));

// ── STUDIO PAGES (text from the March 2026 site) ──────────────────────────────────────────────────────────────

write('/about/', layout({
  url: '/about/', active: '/about/', title: 'About', image: '/assets/img/studio/about.webp',
  description: 'De-Evolution Studios was founded in Brooklyn, New York in 2012 and is now headquartered in Munich, Germany.',
  body: `
<header class="about-hero">
  <img src="/assets/img/studio/about.webp" alt="De-Evolution Studios at a gaming convention" class="about-hero-img" width="1200" height="563">
  <div class="about-hero-text">
    <span class="page-eyebrow">✦ Our Story</span>
    <h1 class="about-hero-title">We Are<br>De-Evolution<br>Studios.</h1>
    <p class="about-hero-sub">Storytellers, designers, and players first. We build games because we love them — and because we know exactly what makes one unforgettable.</p>
  </div>
</header>
<div class="stats-bar"><div class="stats-inner">
  <div class="stat-item fu"><div class="stat-num">2012</div><div class="stat-lbl">Founded</div></div>
  <div class="stat-item fu"><div class="stat-num">7+</div><div class="stat-lbl">Games Shipped</div></div>
  <div class="stat-item fu"><div class="stat-num">2</div><div class="stat-lbl">Continents</div></div>
  <div class="stat-item fu"><div class="stat-num">∞</div><div class="stat-lbl">Ideas in Progress</div></div>
</div></div>
<section class="story-wrap">
  <div class="fu">
    <span class="s-eyebrow">✦ Who We Are</span>
    <h2 class="s-title" style="margin-bottom:32px">Built by Players,<br>for Players.</h2>
    <div class="story-body">
      <p>Founded in 2012, De-Evolution Studios is a game development company originally based in Brooklyn, New York, and now headquartered in Munich, Germany.</p>
      <p>At De-Evolution Studios, we live and breathe game design. We build worlds, characters, and stories that stay with you long after the game ends. Our team of designers, developers, storytellers, and artists share one focus — creating games that are easy to pick up but hard to put down.</p>
      <p>Every project starts with the core mechanics. We craft systems that feel intuitive while offering real depth. Whether it's a clever card combo, a unique puzzle twist, or a finely tuned game loop, we're obsessed with balance and gameplay that just feels right.</p>
      <p>We don't stop at our own projects. We help other creators and companies bring their ideas to life. Stuck on character design, world-building, story, or balance? We've got you.</p>
      <p>Games are meant to be shared, explored, and enjoyed. That's why everything we create — from mobile apps to card games — is built to surprise, challenge, and entertain. We're here to make games fun again, for players and creators alike.</p>
    </div>
  </div>
  <div class="fu">
    <div class="founded-card"><div class="founded-year">2012</div><div class="founded-label">Founded in Brooklyn, NY</div><p class="founded-desc">What started as a passion project in Brooklyn grew into a full studio. More than a decade later, we're still building worlds and still loving every minute of it.</p></div>
    <div class="location-strip">
      <div class="loc-card"><div class="loc-icon">🗽</div><div class="loc-name">Brooklyn, NY</div><div class="loc-sub">Where it started</div></div>
      <div class="loc-card"><div class="loc-icon">🍺</div><div class="loc-name">Munich, DE</div><div class="loc-sub">Where we are now</div></div>
    </div>
  </div>
</section>
<section class="color-band band-red">
  <div class="band-inner">
    <h2 class="band-title fu">What We<br>Believe In.</h2>
    <div class="card-grid">
      ${[['🎮', 'Fun First, Always', "If it's not genuinely fun to play, it's not done. We test obsessively, iterate relentlessly, and don't ship boring. Every game gets the full treatment — no shortcuts."],
         ['🌍', 'Anyone Can Play', 'We specialize in games that are quick to learn and challenging to master. Fun shouldn\'t be gated behind complexity. The best games invite everyone in.'],
         ['❤️', 'Characters Matter', "Characters drive great stories — and great games. Whether it's a hero you root for or a villain you love to hate, we focus on depth, personality, and real connection."],
         ['🤝', 'Collaboration Over Everything', "Whether we're building our own games or helping someone else build theirs, we work as partners. Your vision stays yours — we just bring the skills to make it real."],
         ['⚖️', 'Balance is Everything', "Great game design is about systems that feel fair, fun, and satisfying. We're obsessed with balance — every choice should feel meaningful and every mechanic should earn its place."],
         ['🚀', 'Always Shipping', "Ideas are worthless without execution. We've shipped 7+ games across mobile, card, and board formats — and we're always building the next one. Done beats perfect."]]
        .map(([i, h, p]) => `<div class="band-card fu"><div class="ico">${i}</div><h3>${h}</h3><p>${p}</p></div>`).join('')}
    </div>
  </div>
</section>
<section class="band-bone" style="border-top:none"><div class="section-wrap"><div class="section-inner">
  <div class="section-head fu"><h2 class="s-title">Our Games</h2><a href="/work/" class="btn-outline">See All Projects</a></div>
  <div class="app-grid">${MOBILE.map(appCard).join('')}</div>
</div></div></section>
${cta('Got a Game Idea?', "Let's play. Tell us what you've got — no matter how rough — and let's build something together.")}`,
}));

const SERVICES = [
  ['development', '01', 'pill-y', '🎮 Development', 'Game Development', 'Start a Project',
    ["At De-Evolution Studios, we don't just build games — we create worlds players want to dive into. From the first concept sketch to the final polished release, we handle every part of the development process.",
     "Whether it's mobile, card, board, or digital, we focus on making games that are easy to pick up but hard to put down. We work closely through every stage — designing systems, programming, testing, and refining until the game feels just right.",
     'If you have an idea or just a rough concept, we can help turn it into a fully developed game ready to play.'],
    ['Mobile game development (iOS &amp; Android)', 'Card &amp; board game design and production', 'Game systems, mechanics, and programming', 'Playtesting, balancing, and polish', 'Concept to launch — full production pipeline']],
  ['story', '02', 'pill-b', '✍️ Story', 'Character &amp; Story Creation', 'Tell Us Your Story',
    ["Characters and story are what give games heart — and that's where we shine. We create unique characters players care about, with designs that stick and stories that pull them in.",
     "Whether it's a mischievous mummy, a heroic warrior, or a talking cat with attitude, we craft personalities that add depth and humor to every game. Our writers and artists work side by side to design worlds, write dialogue, and build lore that fits your vision.",
     "If you've got a rough idea or just a vibe you're chasing, we'll bring it to life with fully fleshed-out characters and a story players want to follow to the end."],
    ['Original character concept &amp; design', 'World building and lore development', 'Dialogue writing and narrative scripting', 'Character backstories and personality profiles', 'Art direction and visual identity for characters']],
  ['balancing', '03', 'pill-g', '⚖️ Balancing', 'Game Design &amp; Balancing', 'Fix My Game',
    ["We know great game design is all about balance — systems that feel fair, fun, and satisfying every time you play. Whether it's skill trees, combat mechanics, economy systems, or just making sure every choice feels rewarding, we break it all down and rebuild until it works.",
     "We dive deep into the mechanics, test what works, and toss what doesn't. We can analyze your game's strengths and weaknesses, offer fresh ideas, and make sure everything fits together seamlessly.",
     "Whether you're stuck mid-development or polishing your final build, we're here to help fine-tune every element until your game is as fun to play as you imagined."],
    ['Mechanics analysis and redesign', 'Economy &amp; progression system balancing', 'Combat and skill tree tuning', 'Player experience and difficulty curve review', 'Structured playtesting and feedback sessions']],
  ['consulting', '04', 'pill-p', '💡 Consulting', 'Creative Consultation', 'Get Fresh Eyes',
    ["Sometimes you just need a fresh set of eyes — and that's where we come in. Whether you're stuck in a creative block or just want feedback on what you've built so far, we're here to help.",
     "We'll review your game, test systems, dive into your world, and point out what's working and where things can improve. From early prototypes to near-finished builds, we help you solve problems, balance gameplay, sharpen mechanics, and polish your story.",
     'Think of us as the creative partner who jumps in when you need that extra push to make your game the best it can be.'],
    ['Full game review and written feedback report', 'Creative direction and concept development', 'Identifying gaps in mechanics, story, or UX', 'Strategic roadmap for next development phase', 'One-on-one sessions with our creative team']],
];

write('/services/', layout({
  url: '/services/', active: '/services/', title: 'Services',
  description: 'Game development, character and story creation, game design and balancing, and creative consultation from De-Evolution Studios.',
  body: `${pageHeader('What We Do', 'How We Can<br>Help You.', "Got an idea stuck in your head? Whether you're starting fresh or stuck somewhere in the middle — we jump in and help make it real.")}
<div class="services-list">
${SERVICES.map(([id, num, pill, pl, name, btn, ps, bl]) => `<section class="service-block fu" id="${id}">
  <div><div class="service-number" aria-hidden="true">${num}</div><span class="pill ${pill}">${pl}</span><h2 class="service-name">${name}</h2></div>
  <div><div class="service-desc">${ps.map(p => `<p>${p}</p>`).join('')}</div><ul class="bullets">${bl.map(b => `<li>${b}</li>`).join('')}</ul><a href="/contact/" class="btn-solid">${btn}</a></div>
</section>`).join('\n')}
</div>
<section class="color-band band-green">
  <div class="band-inner">
    <h2 class="band-title fu">Why Work<br>With <span class="hollow">Us?</span></h2>
    <div class="card-grid">
      <div class="band-card fu"><div class="ico">🎯</div><h3>We've Done It</h3><p>7+ games shipped across mobile, card, and board formats. We don't just consult — we build. You're working with a team that has actually shipped what you're trying to make.</p></div>
      <div class="band-card fu"><div class="ico">🤝</div><h3>Your Vision, Always</h3><p>We work with you, not for you. Your idea stays yours. We bring the skills, you bring the vision — and together we make something players love.</p></div>
      <div class="band-card fu"><div class="ico">😂</div><h3>Fun Is Non-Negotiable</h3><p>If it's not fun to play, it's not done. We test obsessively, iterate relentlessly, and don't ship boring. Every project gets the full treatment.</p></div>
    </div>
  </div>
</section>
<section class="band-bone" style="border-top:none"><div class="section-wrap"><div class="section-inner">
  <h2 class="s-title fu">How It Works</h2>
  <div class="process-steps">
    <div class="process-step fu"><div class="step-num">01</div><div class="step-title">Tell Us Your Idea</div><p class="step-desc">Drop us a message with your concept — no matter how rough. We love big ideas and small sparks equally.</p></div>
    <div class="process-step fu"><div class="step-num">02</div><div class="step-title">We Talk It Through</div><p class="step-desc">We jump on a call, ask the right questions, and figure out what you actually need — not just what you asked for.</p></div>
    <div class="process-step fu"><div class="step-num">03</div><div class="step-title">We Get to Work</div><p class="step-desc">Design, build, test, refine. You're in the loop every step. No black box — we collaborate throughout.</p></div>
    <div class="process-step fu"><div class="step-num">04</div><div class="step-title">You Get a Game</div><p class="step-desc">Something players can actually pick up and play. Polished, fun, and exactly what you imagined — or better.</p></div>
  </div>
</div></div></section>
${cta('Ready to Build?', "Tell us what you've got. We'll take it from there.")}`,
}));

const PICKS = [['development', '🎮', 'I need a game built from scratch'], ['characters', '✍️', 'I need characters &amp; story'], ['balancing', '⚖️', 'I need design &amp; balancing help'], ['consulting', '💡', 'I need creative consultation'], ['other', '🙋', 'Something else entirely']];
const FAQ_CONTACT = [
  ['What kinds of projects do you take on?', "We work on mobile games, card games, board games, and digital projects. We also offer character design, story creation, game balancing, and creative consultation for other developers and studios. If it involves games, we're interested."],
  ['Do you work with first-time game creators?', "Absolutely — that's one of our favorite things. If you have an idea and you're not sure where to start, we'll walk you through the whole process. No experience required. Just bring your excitement."],
  ['How does a project typically start?', "Send us a message and we'll set up a call. We'll ask questions, listen, and figure out what you actually need. Then we put together a plan and go from there. It really is that simple."],
  ['Can you help if my game is already in development?', 'Yes — and we do it a lot. Whether you need fresh eyes on mechanics, help balancing systems, or someone to develop your story and characters mid-production, we can jump in at any stage.'],
  ['Where are you based?', "We're headquartered in Munich, Germany, with roots in Brooklyn, New York. We work with clients worldwide — time zones have never been a problem."],
  ['I need help with one of your games.', `Head to <a href="/support/">player support</a>, or email <a href="mailto:${CONTACT}">${CONTACT}</a>.`],
];

write('/contact/', layout({
  url: '/contact/', title: "Let's Talk",
  description: 'Tell De-Evolution Studios about your game idea, or ask about one of our games.',
  body: `${pageHeader('Get In Touch', "Let's Talk.", "Got a game idea stuck in your head? Need help with characters, balancing, or story? <strong>We're here for all of it.</strong>")}
<section class="form-section">
  <div class="form-inner">
    <div class="fu">
      <span class="s-eyebrow">✦ What Do You Need?</span>
      <h2 class="s-title">Tell Us What<br>You've Got.</h2>
      <p class="form-intro">Whether you're starting from scratch or stuck in the middle — pick what fits best and we'll reach out to talk it through. Need help with one of our games? <a href="/support/">Player support is here.</a></p>
      <fieldset class="service-picks" style="border:0"><legend class="s-eyebrow" style="margin-bottom:10px">Pick one</legend>
        ${PICKS.map(([val, ico, txt]) => `<label class="service-pick"><input type="radio" name="need" value="${val}" form="contactForm"><span class="service-pick-dot"></span><span>${ico} &nbsp;${txt}</span></label>`).join('\n        ')}
      </fieldset>
    </div>
    <div class="fu">
      <form class="contact-form" id="contactForm" action="https://formspree.io/f/meepjead" method="POST">
        <div class="form-row">
          <div class="form-group"><label for="fname">First Name</label><input type="text" id="fname" name="first_name" placeholder="Lil'" autocomplete="given-name" required></div>
          <div class="form-group"><label for="lname">Last Name</label><input type="text" id="lname" name="last_name" placeholder="Cthulhu" autocomplete="family-name" required></div>
        </div>
        <div class="form-group"><label for="email">Email Address</label><input type="email" id="email" name="email" placeholder="you@yourstudio.com" autocomplete="email" required></div>
        <div class="form-group"><label for="subject">Subject</label><input type="text" id="subject" name="subject" placeholder="What's this about?" required></div>
        <div class="form-group"><label for="message">Tell Us About Your Project</label><textarea id="message" name="message" placeholder="Give us the pitch — no idea is too rough. Tell us what you're building, where you're stuck, or what you need. The more you share, the better we can help." required></textarea></div>
        <button type="submit" class="form-submit">Send It Over →</button>
        <p class="form-note">We'll get back to you within 1–2 business days. Your message is sent through Formspree; see our <a href="/privacy/#contact">privacy notice</a>.</p>
      </form>
      <div class="form-success" id="formSuccess" tabindex="-1" role="status"><div style="font-size:3rem;margin-bottom:16px">🎮</div><h3>Message Sent!</h3><p>We've got your message and we'll be in touch soon. In the meantime, check out <a href="/work/">our work</a> or browse <a href="/services/">our services</a>.</p></div>
    </div>
  </div>
</section>
<section class="band-bone"><div class="section-wrap"><div class="section-inner split-2">
  <div class="fu"><span class="s-eyebrow">✦ FAQ</span><h2 class="s-title">Common<br>Questions.</h2></div>
  <div class="faq-list fu">${FAQ_CONTACT.map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><div class="faq-a"><p>${a}</p></div></details>`).join('')}</div>
</div></div></section>`,
}));

// ── PRIVACY (this website) AND IMPRESSUM ───────────────────────────────────────────────────────────────────────

write('/privacy/', layout({
  url: '/privacy/', title: 'Privacy',
  description: 'Privacy for deevolutionstudios.com, and links to the privacy policy of each De-Evolution Studios game.',
  body: `${pageHeader('Privacy', 'Privacy at<br>De-Evolution.', null, { small: true })}
<article class="doc"><div class="prose">
<h2>Our games</h2>
<p>Each game has its own privacy policy, because each one uses different services:</p>
<ul>${MOBILE.map(g => g.privacy ? `<li><a href="/${g.slug}/privacy/">${esc(g.name)} privacy policy</a> · <a href="/${g.slug}/delete/">delete your data</a></li>` : `<li>${esc(g.name)}: its policy will be published here before the apps launch.</li>`).join('')}</ul>

<h2>This website</h2>
<p class="meta">deevolutionstudios.com · Effective October 23, 2026</p>
<p>This notice covers the website deevolutionstudios.com, run by DE-EVOLUTION STUDIOS LLC ("we", "us"). The games
(including their web versions at candi.deevolutionstudios.com and play.deevolutionstudios.com) are covered by their
own policies above.</p>
<h3>Visiting the site</h3>
<p>The site has no accounts, no advertising and no analytics or tracking, and it sets no cookies. Our host, Hostinger,
keeps standard server logs to deliver and secure the site: your IP address, the date and time, the page requested,
and your browser's user agent. We use them only to run and protect the site. See
<a href="https://www.hostinger.com/legal/privacy-policy">Hostinger's privacy policy</a>.</p>
<p>The fonts and images are served from this site itself; your browser doesn't contact Google Fonts or any other
third party to show these pages. Store badges link to the App Store and Google Play, which have their own policies.</p>
<h3 id="contact">The contact form</h3>
<p>If you send a message through the <a href="/contact/">contact form</a>, the name, email address, subject and
message you enter are sent to us through Formspree, which delivers them to our inbox. We use them only to answer you,
and delete them when they are no longer needed for that. See <a href="https://formspree.io/legal/privacy-policy/">Formspree's
privacy policy</a>. If you email us directly, your email is handled by our email provider, Hostinger.</p>
<h3>Your rights</h3>
<p>You can ask us for a copy of the information we hold about you, or ask us to correct or delete it, by emailing
<a href="mailto:${CONTACT}">${CONTACT}</a>. If you live in the European Union or the UK, you can also object to how
we use it and complain to a data protection authority.</p>
<h3>Changes</h3>
<p>If we change this notice, we'll update this page and the date above.</p>
</div></article>`,
}));

write('/impressum/', layout({
  url: '/impressum/', title: 'Impressum',
  description: 'Legal notice (Impressum) for De-Evolution Studios.',
  body: `${pageHeader('Legal notice', 'Impressum', null, { small: true })}
<article class="doc"><div class="prose">
<p>Angaben gemäß § 5 DDG · Information according to § 5 of the German Digital Services Act</p>
<h2>Provider</h2>
<p>DE-EVOLUTION STUDIOS LLC<br>
Donnersbergerstraße 38<br>
80634 München<br>
Germany</p>
<p>Represented by: Richard Laufenburger, Managing Member<br>
Limited liability company registered in New York, USA</p>
<h2>Contact</h2>
<p>Email: <a href="mailto:${CONTACT}">${CONTACT}</a><br>
Phone: <a href="tel:+491728161503">+49 172 8161503</a></p>
<h2>Responsible for content</h2>
<p>Richard Laufenburger, Donnersbergerstraße 38, 80634 München (§ 18 Abs. 2 MStV)</p>
<h2>Consumer dispute resolution</h2>
<p>We are not willing or obliged to take part in dispute resolution proceedings before a consumer arbitration board.</p>
</div></article>`,
}));

// ── 404, ROBOTS, SITEMAP ───────────────────────────────────────────────────────────────────────────────────────

write('/404.html', layout({
  url: '/404.html', title: 'Page not found', noindex: true, description: 'This page could not be found.',
  body: `${pageHeader('Error 404', 'Sploosh!<br>Not Found.', "That page fell in the swamp. Try one of these instead.")}
<section class="section-wrap"><div class="section-inner"><div class="acts"><a class="btn-solid" href="/">Home</a><a class="btn-outline" href="/#games">Our games</a><a class="btn-outline" href="/support/">Support</a></div></div></section>`,
}), { sitemap: false });

const noSitemap = [];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter(p => !noSitemap.includes(p)).map(p => `  <url><loc>${SITE}${p}</loc></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /_src/\nDisallow: /tools/\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${pages.length + 1} pages.`);
