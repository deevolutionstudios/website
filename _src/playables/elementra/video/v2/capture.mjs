// node capture.mjs [t1,t2,...]  -> test stills;  node capture.mjs all -> frames/00000.jpg ... (30 fps, 30 s)
import pw from '/opt/npm-tools/node_modules/playwright/index.js'; const { chromium } = pw;
import { mkdirSync } from 'node:fs';
const arg = process.argv[2] || '0.6,2.6,5,7.5,9.4,11,12.6,14.5,16.3,19,20.5,23,27.6,29';
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1 });
await p.goto('file://' + process.cwd() + '/ad.html');
await p.evaluate(() => window.ready());
const shot = async (t, path) => {
  await p.evaluate((t) => window.render(t), t);
  await p.evaluate(() => window.settle());
  await p.screenshot({ path, type: 'jpeg', quality: 92 });
};
if (arg === 'all') {
  mkdirSync('frames', { recursive: true });
  for (let i = 0; i < 900; i++) { await shot(i / 30, `frames/${String(i).padStart(5, '0')}.jpg`); if (i % 100 === 0) console.log(i); }
} else {
  mkdirSync('test', { recursive: true });
  for (const t of arg.split(',').map(Number)) await shot(t, `test/t${t}.jpg`);
}
await b.close();
