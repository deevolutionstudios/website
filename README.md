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

One-time setup in hPanel (owner):
1. Back up the current site: Websites → deevolutionstudios.com → Files → File manager → select everything in
   `public_html` → Download (or Backups → Files).
2. Websites → deevolutionstudios.com → Advanced → **Git**. Repository `https://github.com/deevolutionstudios/website.git`,
   branch `main`, install path empty (`public_html`). For a private repo, add the SSH deploy key hPanel shows to the
   GitHub repo (Settings → Deploy keys) and use the SSH URL instead.
   Hostinger asks for `public_html` to be empty before the first deploy, which is why step 1 matters.
3. Turn on **Auto deployment** and add the webhook URL hPanel shows to the GitHub repo (Settings → Webhooks), so every
   push to `main` goes live.

After a deploy, check: https://deevolutionstudios.com/app-ads.txt shows the AdMob line as plain text, an old address
like /game-candi.html redirects to /candi/, and a made-up address shows the 404 page.
