# deevolutionstudios.com: notes for Claude

## Done from the studio assistant (outside this repo's sessions)

Richard also works with a studio assistant session that handles stores, accounts and the studio's tools. It records what it
did here so this repo's sessions don't ask him to do it again. **Before asking Richard to do something, check this list
and the "DES Studio Tracker" Google Doc (the studio's to-do list): it may already be done.** When you finish something
studio-wide yourself, tick it off in that doc too.

Studio-wide (Nov 3, 2026):
- **Studio Control Room** is live: a private Cloudflare Worker that checks every game hourly (GitHub builds, Render,
  App Store, Google Play, RevenueCat, AdMob) and writes its numbers to the Google Sheet "Control Room data". The 9:00
  morning briefing reads that sheet. Its code is in the private repo deevolutionstudios/control-room; every push to main
  deploys it (GitHub Actions), so nobody runs wrangler by hand.
- **Render is on the free Hobby plan** (moved from Pro, $25/month): at most 2 custom domains (both in use; a third
  costs $0.25/month), 25 services, 500 build minutes and 5 GB bandwidth a month. Every site is on a free instance.
- **GitHub is on the Free plan**: 0.5 GB of Actions storage. Build files (artifacts) are kept 1 day in Candi, D2048,
  Mergy and Elementra; Candi, D2048 and Mergy have a "Clean up old builds" button (keeps the newest 2). Keep any new
  workflow's `retention-days` at 1.
- **Google Play**: the service account play-publisher@candis-swamp-hop.iam.gserviceaccount.com has account-level
  "View app information" and "Release apps to testing tracks" for every app (never production).
- **RevenueCat**: one project per game. Candi's is named "Candi's Swamp Hop" (d23649fd; renamed from "De-Evolution
  Studios"), D2048 6f1e1431, Elementra aeaa6d5f.
- **AdMob**: sellers.json is Transparent with deevolutionstudios.com verified (the domain was verified in Google Search
  Console with a DNS TXT record at Hostinger: keep that record).
- **Email**: Apple's "has completed processing" and TestFlight "is now available to test" emails skip the studio inbox
  (Gmail filter, label "Cleaned up"). App Review results still arrive.

This repo:
- **"More from us" list** (Nov 4): `promo/games.json`, written by tools/build.js from tools/games.js (`PROMO` picks the
  games and their order: Mergy, D2048, Candi; store links follow each game's `live` flags). Every game's "More from us"
  card reads it (Mergy's Settings first), so keep its fields as they are (id, name, tagline, icon, page, ios, android).
  .htaccess lets any app read /promo/ (CORS) and caches it an hour.
- **Mailing list: MailerLite** (Nov 5, studio account deevolutionstudios@gmail.com, account 2770936). Every page's footer has
  "New game alerts" (form "Website release news sign-up", id 203289542855231042, group Release news); the tester page posts
  straight to form "Website tester sign-up" (203289329782490467, group Testers, fields game and device; no Formspree since
  Nov 5, the contact form still uses Formspree). Both use MailerLite's confirm email. Email designs: _src/email/ (template.html is the studio
  template; images in assets/email/, PNG/JPG only). Privacy notice has #news and #testers sections for these.
- deevolutionstudios.com is verified in Google Search Console (DNS TXT record at Hostinger, Nov 3).
- **House ads: our own playable ads** (Nov 5, Richard's call: shown in our games when they ask for an ad). Sources in
  `_src/playables/<game>/` (index.html + assets/, art made by prep-assets.py from the game repos); `node
  tools/build-playables.js` inlines everything into one file per game in `playables/<game>/` (index.html for our games,
  plus `-mraid.html` and `-google.zip` for ad networks) and copies `house-ads.js` (the serving code each game keeps a copy
  of) and `test.html` (plays a game asking for ads). Then `node tools/build.js` writes `promo/ads.json` (the list and the
  rules: share 20%, fill when AdMob has nothing, 2 a day per game, 14 days off after a tap) from games.js. Candi and
  D2048 so far; D2048 and Candi show them (web now, apps from their next builds). .htaccess lets any app read /playables/.

