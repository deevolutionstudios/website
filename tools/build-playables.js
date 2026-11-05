// Builds the playable ads (house ads shown inside our own games, also fit for ad networks).
// Sources: _src/playables/<game>/index.html with its art in assets/. Output, one self-contained file each:
//   playables/<game>/index.html        our games load this (postMessage to the host game; served with CORS)
//   playables/<game>/<game>-mraid.html  for MRAID networks (AppLovin, Unity, ironSource, Mintegral...)
//   playables/<game>/<game>-google.zip  for Google Ads (HTML5 zip with Google's ExitApi)
// Run: node tools/build-playables.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const root = path.join(__dirname, '..'), srcRoot = path.join(root, '_src/playables');
const MIME = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg' };
for (const game of fs.readdirSync(srcRoot)) {
  const dir = path.join(srcRoot, game);
  if (!fs.existsSync(path.join(dir, 'index.html'))) continue;
  const assets = {};
  for (const f of fs.readdirSync(path.join(dir, 'assets'))) {
    const m = MIME[path.extname(f)]; if (!m) continue;
    assets[f] = `data:${m};base64,${fs.readFileSync(path.join(dir, 'assets', f)).toString('base64')}`;
  }
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8').replace('/*ASSETS*/{}', JSON.stringify(assets));
  const out = path.join(root, 'playables', game);
  fs.mkdirSync(out, { recursive: true });
  const write = (name, text) => { fs.writeFileSync(path.join(out, name), text); console.log(`${game}/${name}: ${(text.length / 1024).toFixed(0)} KB`); };
  write('index.html', html.replace('<!--NETWORK-->', ''));
  write(`${game}-mraid.html`, html.replace('<!--NETWORK-->', '<script src="mraid.js"></script>'));
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'pl-'));
  fs.writeFileSync(path.join(tmp, 'index.html'), html.replace('<!--NETWORK-->', '<script type="text/javascript" src="https://tpc.googlesyndication.com/pagead/gadgets/html5/api/exitapi.js"></script>'));
  const zip = path.join(out, `${game}-google.zip`);
  fs.rmSync(zip, { force: true });
  execFileSync('zip', ['-q', '-j', zip, path.join(tmp, 'index.html')]);
  fs.rmSync(tmp, { recursive: true });
  console.log(`${game}/${game}-google.zip: ${(fs.statSync(zip).size / 1024).toFixed(0)} KB`);
}

// the serving code every game copies, and a page that plays the part of a game asking for ads
fs.copyFileSync(path.join(srcRoot, 'house-ads.js'), path.join(root, 'playables/house-ads.js'));
fs.copyFileSync(path.join(srcRoot, 'test.html'), path.join(root, 'playables/test.html'));
