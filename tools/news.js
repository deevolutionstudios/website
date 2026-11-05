// News & devlog posts for deevolutionstudios.com/news/. Newest first.
// To add a post: copy one entry, give it a new slug (it becomes /news/<slug>/), a date (YYYY-MM-DD), a title,
// a one-line summary for the list, and the body as HTML. Optional: game (a game's slug, for its icon and a link),
// image (a path under /assets/img/). Then run `node tools/build.js`.
// draft: true keeps a post off the site (no page, not in the list) until you remove it.
// testers: a game's slug (or true for any game) adds a "Want to test it?" box linking to the sign-up page.

// Games people can sign up to test at /testers/ (the sign-up form's choices). Only these, the owner's call (Oct 29).
const testing = [
  { slug: 'd2048', name: 'D2048: Merge Dungeon' },
  { slug: 'elementra', name: 'Elementra: Dragon Academy' },
  { slug: 'glimmlings', name: 'Glimmlings (our new merge game)' },
  { slug: 'mergy', name: 'Mergy: Cozy Merge' },
];

const posts = [
  {
    slug: 'd2048-is-live',
    date: '2026-11-05',
    title: 'D2048: Merge Dungeon is out now',
    summary: 'The 2048 you know, gone dungeon crawling. Free now on iPhone and Android.',
    game: 'd2048',
    body: `
<p>D2048: Merge Dungeon is out now, free on the App Store and Google Play.</p>
<p>It's the 2048 you know and love, sent dungeon crawling. Merge coins into gems and chests to earn gold, outwit the
skeletons and orcs that try to run off with your treasure, and take on bosses across 60 levels: the Orc War Chief, the
Lich, the Wizard and, at the very end, the Dragon.</p>
<p>A big thank you to everyone who tested it. Download it, play a few levels, and tell us what you think at
<a href="mailto:contact@deevolutionstudios.com">contact@deevolutionstudios.com</a>. And if you enjoy it, a rating in
the store helps a small studio like ours more than you'd think.</p>
<p><a href="https://apps.apple.com/app/id1354589124">Get it on the App Store</a> ·
<a href="https://play.google.com/store/apps/details?id=com.deevolutionstudios.d2048">Get it on Google Play</a></p>`,
  },
  {
    slug: 'mergy-testers-wanted',
    date: '2026-11-05',
    title: 'Testers wanted: Mergy, our cozy merge game',
    summary: 'Help us test Mergy, a cozy little merge game with Mergy the cat, before it comes out on iPhone and Android.',
    game: 'mergy',
    testers: 'mergy',
    body: `
<p>Meet Mergy, a cozy little merge game, and Mergy the cat, who would very much like you to get comfortable. Drag two
of the same thing together and they merge into something new: a cotton puff becomes yarn, yarn becomes a knitted
scarf, and on it goes all the way to a patchwork quilt.</p>
<p>There are two ways to play. <strong>Chill</strong> is endless merging with nothing to lose, just you, the board and a
warm blanket. <strong>Less Chill</strong> has sleepy animal customers dreaming of the things you make, so you merge to
fill their orders. Your merges go on the world board, Legends of the Lounge, if you like a little friendly
competition.</p>
<p>We're looking for testers on iPhone and Android before it comes out. You'll get the game early, play it whenever
you like, and tell us what you think: what feels good, what's confusing, and anything that breaks.</p>`,
  },
  {
    slug: 'd2048-final-testing',
    date: '2026-10-29',
    title: 'D2048: Merge Dungeon is in its final round of testing',
    summary: 'The new D2048 is nearly ready, and we\'re looking for players to try it before it comes out.',
    game: 'd2048',
    testers: 'd2048',
    body: `
<p>The new D2048: Merge Dungeon is almost here. We're in the final round of testing, and we'd love a few more players
to try it before it comes out.</p>
<p>It's the 2048 you know, gone dungeon crawling: merge coins into gems and treasure chests, spend your gold on swords,
hammers and potions, and keep your best treasure away from the skeletons and orcs that try to run off with it. Travel
60 levels across six lands, with boss fights against the Orc War Chief, the Lich, the Wizard and finally the Dragon.</p>
<p>As a tester you'll get the game early on your iPhone or Android phone, play it like you normally would, and tell us
what you think: what's fun, what's too hard, and anything that breaks.</p>`,
  },
  {
    slug: 'candi-on-google-play',
    date: '2026-10-25',
    title: "Candi's Swamp Hop is out on Google Play",
    summary: 'Candi is hopping through the swamp on Android now. The iPhone version is with Apple for review.',
    game: 'candi',
    body: `
<p>Candi's Swamp Hop is out now on Google Play. Hop Candi across a swamp full of skulls, slime and surprises, land on
the moss for bonus points, and see how far you can go before the swamp gets you.</p>
<p>The iPhone version, <em>Candi's Swamp Hop: Remastered</em>, is with Apple for review, and we'll post here the moment
it's out.</p>
<p>Join the world leaderboard to put your name next to your best score, and tell us what you think at
<a href="mailto:contact@deevolutionstudios.com">contact@deevolutionstudios.com</a>.</p>`,
  },
  {
    slug: 'elementra-first-print-run',
    date: '2026-10-29',
    draft: true, // for the owner to check before it goes up
    title: 'Elementra: the first decks are being printed',
    summary: 'The first print run of the Elementra card game is on its way.',
    game: 'elementra',
    body: `
<p>The first print run of Elementra: Dragon Academy is on its way: a small batch of decks in a tuck box, each with a
rules booklet inside.</p>
<p>Elementra is the card game where all you need is two cards to win, but getting there is everything. Bond a Rider
and a Dragon, play your cards for their discard effects, and mess with your friends along the way.</p>
<p>Want one of the first decks? Email <a href="mailto:contact@deevolutionstudios.com">contact@deevolutionstudios.com</a>
and we'll let you know when they arrive.</p>`,
  },
];

module.exports = { posts, testing };
