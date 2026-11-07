// Turns the bundled Your Craft Sync (one .cjs file) into YourCraftSync.exe, the official Node.js way (Single
// Executable Applications): the bundle becomes a blob, Node's own node.exe for Windows (same version as the Node
// running this) gets our icon, name and no console window, and the blob is injected into it.
// Used by tools/build-desktop.js here, and copied (with the bundle and the icon) to the public website repo
// (_src/yourcraft-sync/), whose GitHub Action builds the exe and publishes it as a release download.
//   node make-exe.js <bundle.cjs> <icon.ico> <version> <out.exe> [work dir]
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

async function makeExe({ bundle, icon, version, out, work, base }) {
  fs.mkdirSync(work, { recursive: true });
  const blob = path.join(work, "sea-prep.blob");
  const conf = path.join(work, "sea-config.json");
  fs.writeFileSync(conf, JSON.stringify({ main: bundle, output: blob, disableExperimentalSEAWarning: true, useCodeCache: false, useSnapshot: false }));
  execFileSync(process.execPath, ["--experimental-sea-config", conf], { stdio: "inherit" });
  if (!base) {
    base = path.join(work, `node-${process.version}-win-x64.exe`);
    if (!fs.existsSync(base)) await fetchNodeExe(base, work);
  }
  fs.copyFileSync(base, out);
  fs.chmodSync(out, 0o755);
  if (icon) await brand(out, icon, version);
  const { inject } = require("postject");
  await inject(out, "NODE_SEA_BLOB", fs.readFileSync(blob), { sentinelFuse: "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2" });
}

// nodejs.org, or the same file from npm (the node-win-x64 package) where nodejs.org can't be reached.
async function fetchNodeExe(dest, work) {
  const r = await fetch(`https://nodejs.org/dist/${process.version}/win-x64/node.exe`).catch(() => null);
  if (r && r.ok) return fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
  const v = process.version.slice(1);
  const dir = path.join(work, "node-win");
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  execFileSync("npm", ["pack", `node-win-x64@${v}`, "--silent"], { cwd: dir, stdio: ["ignore", "ignore", "inherit"] });
  execFileSync("tar", ["xzf", `node-win-x64-${v}.tgz`], { cwd: dir });
  fs.copyFileSync(path.join(dir, "package", "bin", "node.exe"), dest);
}

// Our icon and name on the exe instead of Node's, and no console window (its window is a page; see desktop/ui.html).
// Done before the blob goes in, so the blob stays untouched.
async function brand(exe, icon, version) {
  const ResEdit = await import("resedit");
  const PE = await import("pe-library");
  const pe = PE.NtExecutable.from(fs.readFileSync(exe), { ignoreCert: true });
  const res = PE.NtExecutableResource.from(pe);
  const ico = ResEdit.Data.IconFile.from(fs.readFileSync(icon));
  for (const g of ResEdit.Resource.IconGroupEntry.fromEntries(res.entries)) {
    ResEdit.Resource.IconGroupEntry.replaceIconsForResource(res.entries, g.id, g.lang, ico.icons.map((i) => i.data));
  }
  const vi = ResEdit.Resource.VersionInfo.fromEntries(res.entries)[0];
  if (vi) {
    const parts = (version + ".0.0.0").split(".").slice(0, 4).map(Number);
    for (const l of vi.getAllLanguagesForStringValues()) vi.removeAllStringValues(l);
    vi.setStringValues({ lang: 1033, codepage: 1200 }, {
      FileDescription: "Your Craft Sync", ProductName: "Your Craft", CompanyName: "De-Evolution Studios",
      OriginalFilename: "YourCraftSync.exe", InternalName: "YourCraftSync", LegalCopyright: "© De-Evolution Studios",
      FileVersion: parts.join("."), ProductVersion: parts.join("."),
    });
    vi.setFileVersion(...parts, 1033);
    vi.setProductVersion(...parts, 1033);
    vi.outputToResourceEntries(res.entries);
  }
  res.outputResource(pe);
  pe.newHeader.optionalHeader.subsystem = 2; // Windows GUI: no black console box
  fs.writeFileSync(exe, Buffer.from(pe.generate()));
}

module.exports = { makeExe };
if (require.main === module) {
  const [bundle, icon, version, out, work] = process.argv.slice(2);
  makeExe({ bundle: path.resolve(bundle), icon: icon && path.resolve(icon), version, out: path.resolve(out), work: path.resolve(work || "build") })
    .then(() => console.log(`Built ${out} (Node ${process.version}, addon ${version})`))
    .catch((e) => { console.error("Your Craft Sync build failed:", e.message); process.exit(1); });
}
