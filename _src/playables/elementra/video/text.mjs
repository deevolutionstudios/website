// Renders the ad's captions and end-card pieces as transparent PNGs (720 wide) with the game's own fonts.
import { writeFileSync } from 'node:fs';
import pw from '/opt/npm-tools/node_modules/playwright/index.js'; const { chromium } = pw;
const F = 'file:///home/claude/elementra/public/fonts/';
const css = `
@font-face{font-family:Cinzel;font-weight:700;src:url(${F}cinzel-latin-700-normal.woff2)}
@font-face{font-family:Belda;src:url(${F}belda-norm-regular.woff2)}
html,body{margin:0;background:transparent}
.cap{width:720px;height:210px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.t{font-family:Cinzel,serif;font-weight:700;font-size:60px;line-height:1.05;letter-spacing:1px;text-align:center;
  background:linear-gradient(#fffbe8 10%,#ffe08a 45%,#e8a93a 80%);-webkit-background-clip:text;background-clip:text;color:transparent;
  -webkit-text-stroke:0;filter:drop-shadow(0 0 1px #2a1406) drop-shadow(0 3px 0 #2a1406) drop-shadow(0 0 3px #2a1406) drop-shadow(0 6px 14px rgba(0,0,0,.65))}
.t.big{font-size:74px}
.free{font-family:Cinzel,serif;font-weight:700;font-size:84px;letter-spacing:2px;text-align:center;width:720px;
  background:linear-gradient(#fffbe8 10%,#ffe08a 45%,#e8a93a 85%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 3px 0 #2a1406) drop-shadow(0 0 3px #2a1406) drop-shadow(0 8px 18px rgba(0,0,0,.7))}
.badges{width:720px;display:flex;justify-content:center;align-items:center;gap:22px;padding:10px 0}
.badges img{height:78px}
.sub{font-family:Cinzel,serif;font-weight:700;font-size:28px;color:#fff3d6;text-align:center;width:720px;letter-spacing:2px;
  filter:drop-shadow(0 2px 0 #2a1406) drop-shadow(0 0 4px #000)}
`;
const caps = {
  c1: ['ALL YOU NEED IS', '<span class="big">TWO CARDS</span>'],
  c2: ['BOND A RIDER', 'WITH A DRAGON'],
  c3: ['PEEK. GUESS.', 'OUTWIT.'],
  c4: ['WIN THE', 'BATTLE'],
  c5: ['EVOLVE', 'YOUR CARDS'],
  c6: ['PLAY ONLINE', 'WITH FRIENDS'],
};
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 720, height: 400 }, deviceScaleFactor: 1 });
for (const [k, lines] of Object.entries(caps)) {
  const html = `<style>${css}</style><div class="cap">${lines.map(l => l.startsWith('<span') ? `<div class="t big">${l.replace(/<\/?span[^>]*>/g, '')}</div>` : `<div class="t">${l}</div>`).join('')}</div>`;
  writeFileSync('t.html', html); await p.goto('file://' + process.cwd() + '/t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
  await p.locator('.cap').screenshot({ path: `${k}.png`, omitBackground: true });
}
writeFileSync('t.html', `<style>${css}</style><div class="free" id="f">PLAY FREE</div>`); await p.goto('file://' + process.cwd() + '/t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
await p.locator('#f').screenshot({ path: 'free.png', omitBackground: true });
writeFileSync('t.html', `<style>${css}</style><div class="badges" id="b"><img src="file:///home/claude/website/assets/email/app-store.png"><img src="file:///home/claude/website/assets/email/google-play.png" style="height:96px;margin:-9px 0"></div>`); await p.goto('file://' + process.cwd() + '/t.html');
await p.waitForTimeout(300); await p.locator('#b').screenshot({ path: 'badges.png', omitBackground: true });
writeFileSync('t.html', `<style>${css}</style><div class="sub" id="s">THE CARD GAME, NOW ON YOUR PHONE</div>`); await p.goto('file://' + process.cwd() + '/t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
await p.locator('#s').screenshot({ path: 'sub.png', omitBackground: true });
await b.close();
console.log('ok');
