// Preview the site locally the way Hostinger serves it: folder/index.html, the 301s and 404s from .htaccess,
// and /404.html for anything missing.   node tools/serve.js [port]   → http://localhost:8080
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.argv[2]) || 8080;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };

const rules = fs.readFileSync(path.join(ROOT, '.htaccess'), 'utf8').split('\n');
const redirects = rules.map(l => l.match(/^Redirect 301 (\S+) (\S+)/)).filter(Boolean).map(m => [m[1], m[2]]);
const hidden = rules.map(l => l.match(/^RedirectMatch 404 (\S+)/)).filter(Boolean).map(m => new RegExp(m[1]));

function send(res, status, file, extra = {}) {
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', ...extra });
  fs.createReadStream(file).pipe(res);
}

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const r = redirects.find(([from]) => from === url);
  if (r) { res.writeHead(301, { Location: r[1] }); return res.end(); }
  const notFound = () => send(res, 404, path.join(ROOT, '404.html'));
  if (hidden.some(re => re.test(url))) return notFound();
  let file = path.join(ROOT, url);
  if (!file.startsWith(ROOT)) return notFound();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.endsWith('/')) { res.writeHead(301, { Location: url + '/' }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) return notFound();
  send(res, 200, file, { 'Cache-Control': 'no-cache' });
}).listen(PORT, () => console.log(`Previewing on http://localhost:${PORT}`));
