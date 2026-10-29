// Copy each game's privacy policy (and Elementra's terms) from the game's own repo into _src/policies/, so the
// wording on deevolutionstudios.com is always the wording the game ships. The game repos stay the source of truth:
// change a policy there (with a new date), then run this and `node tools/build.js`.
//
//   node tools/sync-policies.js            (repos in their usual places on the owner's PC)
//   GAMES_DIR=D:/somewhere node tools/sync-policies.js
const fs = require('fs');
const path = require('path');

const DESKTOP = process.env.GAMES_DIR || 'C:/Users/OctoOG/Desktop';
const SOURCES = [
  { out: 'candi-privacy.html', from: "Candi's SH/Candi/www/privacy.html" },
  { out: 'd2048-privacy.html', from: 'D2048/D2048-release/privacy.html' },
  { out: 'elementra-privacy.html', from: 'Development/Elementra/public/privacy.html' },
  { out: 'elementra-terms.html', from: 'Development/Elementra/public/terms.html' },
  { out: 'colorwise-privacy.html', from: 'Development/ColorRun/web/privacy.html' },
];
// Links inside the policies that point at the game's own site, rewritten to the studio-site pages.
const LINKS = [
  [/href="privacy\.html"/g, 'href="/elementra/privacy/"'],
  [/href="terms\.html"/g, 'href="/elementra/terms/"'],
  [/href="https:\/\/deevolutionstudios\.com\//g, 'href="/'],
];

for (const s of SOURCES) {
  const file = path.join(DESKTOP, s.from);
  if (!fs.existsSync(file)) { console.log('skip (not found):', file); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main>([\s\S]*?)<\/main>/);
  if (!main) throw new Error('No <main> in ' + file);
  let body = main[1]
    .replace(/<a class="back"[^>]*>[\s\S]*?<\/a>\s*/, '') // the game site's own "Back to …" link
    .replace(/<h1>[\s\S]*?<\/h1>\s*/, '');                 // the page template prints its own heading
  for (const [re, to] of LINKS) body = body.replace(re, to);
  const note = `<!-- Copied from ${s.from} by tools/sync-policies.js. Edit it there, not here. -->\n`;
  fs.writeFileSync(path.join(__dirname, '../_src/policies', s.out), note + body.trim() + '\n');
  console.log('synced', s.out);
}
