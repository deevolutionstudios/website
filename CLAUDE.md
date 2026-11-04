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
- deevolutionstudios.com is verified in Google Search Console (DNS TXT record at Hostinger, Nov 3).
