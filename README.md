# deevolutionstudios.com

The De-Evolution Studios website: the studio pages, and every page the App Store and Google Play listings link to
(game pages, privacy policies, account-deletion pages, support) plus `app-ads.txt` for AdMob.

Plain HTML and CSS with no build step on the server: Hostinger serves this repo as it is. The pages are generated
by `tools/build.js` and the generated files are committed.

## Changing the site

| To change | Edit | Then |
|---|---|---|
| A game's text, store status, FAQ or deletion steps | `tools/games.js` | `node tools/build.js` |
| A game going live in a store | set `live: true` on its `appStore` / `play` in `tools/games.js` | `node tools/build.js` |
| A game's privacy policy or terms | the policy in **the game's own repo** (with a new date) | `node tools/sync-policies.js`, then `node tools/build.js` |
| Studio pages, layout, nav, footer | `tools/build.js` | `node tools/build.js` |
| Look and feel | `assets/css/site.css` | `node tools/build.js` (refreshes the cache-busting version) |
| Ad networks | `app-ads.txt` | nothing |
| Redirects, 404, caching | `.htaccess` | nothing |

Preview locally (same redirects and 404s as Hostinger): `node tools/serve.js`, then open http://localhost:8080.

## URLs for the store listings

| | Candi's Swamp Hop | D2048 | Elementra | Colorwise |
|---|---|---|---|---|
| Marketing URL / Website | `/candi/` | `/d2048/` | `/elementra/` | `/colorwise/` |
| Support URL | `/support/#candi` | `/support/#d2048` | `/support/#elementra` | `/support/#colorwise` |
| Privacy policy URL | `/candi/privacy/` | `/d2048/privacy/` | `/elementra/privacy/` | (not written yet) |
| Delete account URL (Play) | `/candi/delete/` | `/d2048/delete/` | `/elementra/delete/` | (not written yet) |
| Terms of use | | | `/elementra/terms/` | |

All under `https://deevolutionstudios.com`. Google Play's "Website" field and Apple's Marketing URL should be on
`deevolutionstudios.com` so AdMob finds `https://deevolutionstudios.com/app-ads.txt`.

## Deploying (Hostinger Git)

Every push to `main` goes live by itself: hPanel → Websites → deevolutionstudios.com → Advanced → **GIT** is
connected through Hostinger's GitHub app (repo `website`, branch `main`, folder `public_html`) with
**Auto-deployment** on. That page also lists each deployment and has **Redeploy**.

Set up on October 23, 2026, after a backup (hPanel → Files → Backups; Hostinger also backs up daily). The files of the
March 2026 site may still sit in `public_html` next to the new ones; `.htaccess` redirects their old addresses.

After a deploy, check: https://deevolutionstudios.com/app-ads.txt shows the AdMob line as plain text, an old address
like /game-candi.html redirects to /candi/, and a made-up address shows the 404 page.
