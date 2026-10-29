// News & devlog posts for deevolutionstudios.com/news/. Newest first.
// To add a post: copy one entry, give it a new slug (it becomes /news/<slug>/), a date (YYYY-MM-DD), a title,
// a one-line summary for the list, and the body as HTML. Optional: game (a game's slug, for its icon and a link),
// image (a path under /assets/img/). Then run `node tools/build.js`.
// draft: true keeps a post off the site (no page, not in the list) until you remove it.

module.exports = [
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
