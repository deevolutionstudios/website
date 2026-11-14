// Records clips of the running game (vite at :5173) as 720x1280 frames via CDP screencast.
// node record.mjs <clip> ; writes frames/<clip>/NNNNN.jpg and frames/<clip>/times.txt
import pw from '/opt/npm-tools/node_modules/playwright/index.js'; const { chromium } = pw;
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';

const clip = process.argv[2];
const BASE = 'http://localhost:5173';
const out = `frames/${clip}`;
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ args: ['--mute-audio'] });
const ctx = await browser.newContext({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const tab = { table: 'home', upgrade: 'collection', home: 'home', quests: 'quests' }[clip] ?? 'home';
await ctx.addInitScript(([tab]) => {
  localStorage.setItem('elementra.tutorial', 'skipped');
  localStorage.setItem('elementra.name', 'Riley');
  localStorage.setItem('elementra.play', JSON.stringify({ mode: 'local', players: 4, environments: false, neverborne: false, memory: false, quick: false, speed: 'normal', v: 2 }));
  localStorage.setItem('elementra.muted', '1');
  localStorage.setItem('elementra.quiet', '0');
  localStorage.setItem('elementra.testEvent', 'launch');
  localStorage.setItem('elementra.agreed13', '1');
  sessionStorage.setItem('elementra.tab', tab);
}, [tab]);
const page = await ctx.newPage();
await page.route('**/rest/v1/game_switches*', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ key: 'neverborne', enabled: false }, { key: 'event:launch', enabled: true }]) }));
await page.goto(BASE);
await page.waitForTimeout(5500);

const cdp = await ctx.newCDPSession(page);
const times = [];
let n = 0, recording = false;
cdp.on('Page.screencastFrame', async (f) => {
  cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  if (!recording) return;
  const name = String(n++).padStart(5, '0') + '.jpg';
  writeFileSync(`${out}/${name}`, Buffer.from(f.data, 'base64'));
  times.push([name, f.metadata.timestamp]);
});
const rec = async (fn) => {
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 720, maxHeight: 1280, everyNthFrame: 1 });
  recording = true;
  await fn();
  recording = false;
  await cdp.send('Page.stopScreencast');
};
const play = (p) => p.locator('button.home-play').first().click();

if (clip === 'table') {
  await page.evaluate(async () => {
    const m = await import('/src/ui/controller.ts'); const e = await import('/src/engine/index.ts');
    m.Controller.prototype.humanAgent = function () { return new e.AiAgent(); };
  });
  await rec(async () => {
    await play(page);
    // keep tapping on through Round results until a battle has played and settled
    let sawBattle = false;
    for (let t = 0; t < 70000; t += 250) {
      if (await page.locator('.battle').count()) sawBattle = true;
      if (sawBattle && !(await page.locator('.battle').count()) && t > 20000) break;
      const next = page.locator('.sheet.result .btn.primary.big');
      if (await next.count()) await next.first().click().catch(() => {});
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(1500);
  });
} else if (clip === 'upgrade') {
  await page.waitForTimeout(800);
  {
    const dragons = page.locator('section', { has: page.locator('h2.collection-group', { hasText: /dragon/i }) }).locator('.collection-tile');
    await dragons.nth(Number(process.env.CARD ?? 2)).click();
    await page.waitForTimeout(1000);
    await page.locator('.detail-side.main').click();
    await page.waitForTimeout(400);
    await page.evaluate(() => { const hide = () => { for (const e of document.querySelectorAll('button, p, div, span')) { const t = (e.innerText || '').trim(); if (e.children.length <= 1 && /^(Sign In|Back|Sign in to upgrade your cards\.?)$/i.test(t)) e.style.visibility = 'hidden'; } }; hide(); setInterval(hide, 50); });
    await page.waitForTimeout(400);
  }
  await rec(async () => {
    await page.waitForTimeout(1000);
    const next = page.locator('.stepper-arrow').last();
    for (let i = 0; i < 4 && await next.isEnabled(); i++) { await next.click(); await page.waitForTimeout(1250); }
    await page.waitForTimeout(1600);
  });
} else {
  await rec(async () => { await page.waitForTimeout(6000); });
}
writeFileSync(`${out}/times.txt`, times.map(([f, t]) => `${f} ${t}`).join('\n'));
console.log(clip, n, 'frames', times.length ? (times.at(-1)[1] - times[0][1]).toFixed(1) + 's' : '');
await browser.close();
