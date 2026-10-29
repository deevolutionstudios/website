// Everything the site says about each game, in one place. To launch a game in a store, set its `live` to true
// here and run `node tools/build.js`: the grey "Coming soon" badge turns into a working store link everywhere.
const CONTACT = 'contact@deevolutionstudios.com';
const mail = (subject, text = CONTACT) =>
  `<a href="mailto:${CONTACT}?subject=${encodeURIComponent(subject)}">${text}</a>`;

const MOBILE = [
  {
    slug: 'candi',
    name: "Candi's Swamp Hop",
    storeNames: "“Candi's Swamp Hop: Remastered” on the App Store, “Candi's Swamp Hop” on Google Play",
    type: 'Mobile game · Arcade',
    tagline: 'Hold to float, let go to hop! Help Candi cross the spooky-cute swamp without getting her boots wet.',
    short: 'A one-touch hopping game with a spooky-cute twist. Remastered for 2026.',
    appStore: { id: '6825680669', live: false },
    play: { id: 'com.deevolutionstudios.swamphop', live: true },
    shots: ['1-float', '2-bat', '3-new-best', '4-wardrobe'],
    info: [['Platforms', 'iPhone, Android, web'], ['Genre', 'Arcade'], ['Age', '13+'], ['Price', 'Free, with optional packs'], ['Account', 'Optional (leaderboard)']],
    about: `
<p>Candi's Swamp Hop is a one-touch hopping game with a spooky-cute twist. Hold anywhere to float up on Candi's pink
umbrella, then let go to drift down onto the next stump. Land it and keep going; miss and it's a sploosh into the
swamp!</p>
<h3>How to play</h3>
<ul>
  <li>Hold to float up, let go to drift down</li>
  <li>Land on a stump for 1 point, on the glowing moss for 2</li>
  <li>Hit the moss five times in a row for a +5 combo bonus</li>
  <li>Watch out for bats, and hop fast once the stumps start sinking!</li>
</ul>
<h3>Features</h3>
<ul>
  <li>Simple one-touch controls that are easy to learn and tricky to master</li>
  <li>A glowing night swamp full of fireflies, fog and moonlight</li>
  <li>Medals for every run: Bronze, Silver, Gold and Swamp Queen</li>
  <li>A world leaderboard, weekly and all-time (sign in with email, Google or Apple)</li>
  <li>A floatie for a second chance after a fall, only if you choose to watch a short ad</li>
  <li>Halloween Pack and Sweet Supporter Pack outfits</li>
  <li>Plays offline, no account needed</li>
</ul>
<p>The De-Evolution Studios classic, remastered with all-new art, music and sound.</p>`,
    privacy: 'candi-privacy.html',
    deletion: {
      account: 'Leaderboard accounts are optional. You only have one if you signed in to the world leaderboard with your email, Google or Apple.',
      steps: [
        `Email ${mail("Candi's Swamp Hop: delete my account")} <strong>from the email address you signed in with</strong> (for Sign in with Apple's “Hide My Email”, from the Apple ID that address forwards to), with the subject “Candi's Swamp Hop: delete my account”.`,
        'We check that the request comes from the account’s address, then delete the account.',
        'We confirm by email once it’s done, within 30 days of your request.',
      ],
      deleted: ['Your sign-in (email address and the Google or Apple sign-in link)', 'Your display name and the outfit shown on the leaderboard', 'Your best scores and the run details stored with them', 'The link between your account and your purchase history at RevenueCat'],
      kept: ['Packs you bought stay unlocked on the device you bought them on. App Store and Google Play keep their own record of the purchase, which you can use to restore it.', 'Anonymous game statistics and crash reports (Google Firebase) aren’t linked to your account; Google deletes them after a limited time. Ask us in the same email and we’ll ask Google to delete the statistics from your installation.'],
      device: 'Everything the game saves on your phone (best score, settings, outfits) is deleted when you uninstall the app or clear its data.',
    },
    faq: [
      ['I bought a pack. How do I get it on a new phone?', 'Open the Swamp Shop and tap <strong>Restore purchases</strong>, signed in to the same App Store or Google Play account you bought it with.'],
      ['Do I need an account?', 'No. You can play without one. An account is only needed to put your name and scores on the world leaderboard.'],
      ['Can I change my leaderboard name?', 'You pick your name when you first sign in. To change it later, email us from the address you signed in with. Names that are rude or copy someone else may be removed.'],
      ['How do I reset my best score?', 'Settings → <strong>Reset best score</strong>.'],
      ['Do I have to watch ads?', 'No. The only ad is the optional floatie (a second chance after a fall), and it only plays if you tap to watch it.'],
    ],
  },
  {
    slug: 'd2048',
    name: 'D2048: Merge Dungeon',
    shortName: 'D2048',
    type: 'Mobile game · Puzzle RPG',
    tagline: '2048 goes dungeon crawling! Merge coins into gems and chests, outwit monsters and slay bosses in 60 levels.',
    short: 'Merge treasure, slay monsters: the 2048 you love, now with swords and a dragon.',
    appStore: { id: '1354589124', live: true },
    play: { id: 'com.deevolutionstudios.d2048', live: false },
    shots: ['01-title', '02-adventure', '03-boss', '06-store'],
    info: [['Platforms', 'iPhone, iPad, Android'], ['Genre', 'Puzzle / RPG'], ['Age', '9+'], ['Price', 'Free, with optional packs'], ['Account', 'None needed']],
    about: `
<p>Swipe to slide the board and merge matching treasure: copper coins into silver, silver into gold, gold into gems and
treasure chests. Every merge earns gold. But you're not alone down here. Skeletons and orcs appear without warning,
and if your best treasure touches one, it runs off with it and hurts you on the way out!</p>
<h3>How to play</h3>
<ul>
  <li>Swipe to move every tile; matching treasures merge into the next one up</li>
  <li>Each merge earns gold to spend on swords, hammers and potions</li>
  <li>Skeletons steal silver and better, orcs steal gold and better</li>
  <li>Two skeletons merge into an orc; two orcs summon the Sorcerer</li>
  <li>Slimes land on empty squares and never move: only a hammer clears them</li>
</ul>
<h3>Adventure</h3>
<p>Travel a map of 60 levels across six lands, from the Open Fields to the Dragon's Lair. Every tenth level from 20
on is a boss fight: a skeleton, the Orc War Chief, the Lich, the Wizard and finally the Dragon.</p>
<h3>Fair and friendly</h3>
<ul>
  <li>No forced ads: a short video only plays when you choose to watch one</li>
  <li>Optional packs change how the game looks. They never change the game</li>
  <li>No account needed, progress saved on your device, plays offline</li>
</ul>`,
    privacy: 'd2048-privacy.html',
    deletion: {
      account: 'D2048 has no accounts: there is nothing to sign in to, and your progress is saved only on your own device.',
      steps: [
        `To have your purchase records deleted (kept by our purchase service, RevenueCat, so you can restore packs), email ${mail('D2048 data deletion')} with the subject “D2048 data deletion”.`,
        'If you can, include the date of your purchase and your App Store or Google Play order number, so we can find the record.',
        'We delete it and confirm by email.',
      ],
      deleted: ['Your purchase history at RevenueCat (which packs, when, price and currency) and the random ID it is stored under'],
      kept: ['App Store and Google Play keep their own record of your purchases, under their own privacy policies.', 'Ad data held by Google can be reset or deleted in your device’s Google or Apple settings.', 'Anonymous game statistics aren’t linked to you and are deleted by Google after a limited time; crash reports after 90 days. Ask in the same email and we’ll ask Google to delete the statistics from your installation.'],
      device: 'Your game progress lives only on your device: uninstalling D2048 deletes it.',
    },
    faq: [
      ['I bought a pack. How do I get it on a new device?', 'Open <strong>Settings</strong> and tap <strong>Restore purchases</strong>, signed in to the same App Store or Google Play account you bought it with.'],
      ['Can I move my progress to a new phone?', 'Progress is saved on your device, so it moves with your phone’s own backup (iCloud or Google backup). There is no D2048 account.'],
      ['Do I have to watch ads?', 'No. Ads only play when you choose to watch one, for a revive, extra moves, a sword or a chest bonus.'],
      ['I had the original D2048. What happened?', 'D2048 2.0 is a full remake of the original. It updates the same App Store app.'],
    ],
  },
  {
    slug: 'elementra',
    name: 'Elementra: Dragon Academy',
    shortName: 'Elementra',
    type: 'Mobile game · Card duel',
    tagline: 'Bond a Rider and a Dragon, outwit your rivals and win fantasy card duels. Two cards are all you need.',
    short: 'A fast fantasy card duel for 2 to 4 players, online or against the computer.',
    appStore: { id: '6826172343', live: false },
    play: { id: 'com.deevolutionstudios.elementra', live: false },
    shots: ['01-home', '02-game', '04-collection', '05-shop'],
    info: [['Platforms', 'iPhone, iPad, Android, web'], ['Genre', 'Card / Strategy'], ['Age', '9+ (accounts 13+)'], ['Price', 'Free, with optional purchases. No ads'], ['Players', '2–4 online, or vs the computer']],
    about: `
<p>Welcome, new recruit. Your training begins at the Elementra: Dragon Academy, where Riders and Dragons learn to
fight as one.</p>
<p>Elementra is a fast fantasy card duel for 2 to 4 players. Each Round you hold just two cards, and you need a Rider
and a Dragon to Battle. On your turn you draw a card, then discard one, and every discard triggers its ability. Peek
at a rival's hand, swap cards, knock a classmate out of the Round, or protect yourself for one more turn.</p>
<h3>Features</h3>
<ul>
  <li>Quick Rounds of bluffing, deduction and timing</li>
  <li>Nine Affinities, each with its own Rider and Dragon</li>
  <li>Find a Match online, invite friends to private tables, or play the computer, even offline</li>
  <li>Collect and upgrade your cards through five finishes, with foil and holographic shine</li>
  <li>Daily and weekly quests, seasonal events and a friends list</li>
</ul>
<h3>Prefer cards on the table?</h3>
<p>The app is the digital edition of <a href="/elementra-card-game/">Elementra, our tabletop card game</a> for 2 to 8
players.</p>`,
    privacy: 'elementra-privacy.html',
    terms: 'elementra-terms.html',
    deletion: {
      account: 'You only have an Elementra account if you signed in (with your email, Google or Apple). Playing against the computer needs no account.',
      inApp: 'In the app, sign in and go to <strong>Profile → Account → Delete account</strong>. It takes effect straight away.',
      steps: [
        `Can't sign in any more? Email ${mail('Elementra: delete my account')} <strong>from the email address on the account</strong>, with the subject “Elementra: delete my account”, and your player name if you remember it.`,
        'We check that the request comes from the account’s address, then delete the account.',
        'We confirm by email once it’s done.',
      ],
      deleted: ['Your sign-in and email address', 'Your player profile: name, picture, frame and friend code', 'Your progress and collection: cards, upgrades, crystals, shards, quests, events and items', 'Your friends list, friend requests and table invites', 'The codes you have redeemed'],
      kept: ['App Store and Google Play keep their own record of purchases you made, under their own privacy policies.', 'Technical logs and error reports on our game server are kept only for a short time (error reports up to 30 days).', 'Anonymous game statistics and crash reports from the apps aren’t linked to your account and are deleted by Google after a limited time.'],
      device: 'Settings saved on your device (sound, card display, tutorial progress) are removed when you uninstall the app.',
    },
    faq: [
      ['I bought something. How do I get it back?', 'Sign in with the same account, open the <strong>Shop</strong> and tap <strong>Restore Purchases</strong> at the bottom, signed in to the same App Store or Google Play account you paid with.'],
      ['How do I keep my progress on another phone or computer?', 'Sign in with the same email, Google or Apple account. Your collection and progress are saved to your account.'],
      ['How do I play with friends?', 'Add them with their friend code, then invite them to a private table, or share the table link.'],
      ['Someone is using an offensive name.', 'In an online game, tap the player’s name at the table to report them. We review reports and change names that break the rules.'],
      ['How do I turn off game statistics?', 'Profile → Settings → <strong>Share game statistics</strong>.'],
    ],
  },
  {
    slug: 'colorwise',
    name: 'Colorwise',
    type: 'Mobile game · Rhythm',
    tagline: 'Word or hue? Beat the beat. A neon rhythm game of colors that lie.',
    short: 'Swipe toward the color the word says, not the color it’s painted. Coming to phones.',
    appStore: { live: false },
    play: { live: false },
    comingSoon: true,
    info: [['Platforms', 'iPhone and Android (coming soon)'], ['Genre', 'Rhythm / Reflex'], ['Price', 'Free, with optional cosmetics']],
    about: `
<p>Colorwise is a neon rhythm game of colors that lie. Gates fly at you on the beat: swipe toward the color the word
<em>says</em> and ignore the color it's painted. If that color isn't on the ring, tap. And when a gold ring appears,
the rule flips.</p>
<ul>
  <li>Three tracks, a Daily challenge and a Practice mode that teaches every gate</li>
  <li>Earn Prisms as you play and spend them on skins for the gate wheel, the tunnel and the sky</li>
  <li>World leaderboards per track, weekly and all-time</li>
</ul>
<p>Colorwise is coming to iPhone and Android.</p>`,
    // DRAFT (Oct 29, 2026): written from the ColorRun code for the owner's review; see the note in the policy file.
    privacy: 'colorwise-privacy.html',
    deletion: {
      account: 'You only have an account if you signed in to the world leaderboards (with your email, Google or Apple). Playing without signing in needs no account. Your De-Evolution account is shared with our other games that use the same sign-in, such as Candi\'s Swamp Hop.',
      steps: [
        `Email ${mail('Colorwise: delete my account')} <strong>from the email address you signed in with</strong> (for Sign in with Apple's “Hide My Email”, from the Apple ID that address forwards to), with the subject “Colorwise: delete my account”.`,
        'Say whether you want the whole account deleted (for every game that uses it) or only your Colorwise information.',
        'We check that the request comes from the account’s address, delete what you asked for and confirm by email within 30 days.',
      ],
      deleted: ['Your player name and your place on the leaderboards', 'Your best scores on every track', 'Your Prisms, skins and chosen look saved with your account', 'For a whole-account deletion: your sign-in (email address and the Google or Apple sign-in link)'],
      kept: ['Nothing else: Colorwise sends no game statistics, crash reports or ad data, so there is nothing more to delete.', 'Once the phone apps are out, App Store and Google Play will keep their own record of anything you buy.'],
      device: 'Everything the game saves on your phone (scores, settings, Prisms and skins) is deleted when you uninstall the app.',
    },
    faq: [
      ['When is Colorwise coming to phones?', 'We’re working on the iPhone and Android apps now. Follow our news page to hear when it’s out.'],
      ['Do I need an account?', 'No. Sign in only if you want your name on the world leaderboards and your Prisms and skins on every device.'],
    ],
  },
];

// Older and tabletop projects, as on the March 2026 site.
const PROJECTS = [
  { slug: 'elementra-card-game', name: 'Elementra', type: 'card', label: 'Card Game', kind: 'Card Game · Dragon Academy', img: 'elementra-card-game/cover', tag: 'Dragon Academy. All you need is 2 cards to win — but getting there is everything.' },
  { slug: 'elementra', name: 'Elementra: Dragon Academy', type: 'mobile', label: 'Mobile Game', kind: 'Mobile Game · Card duel', img: 'elementra/cover', tag: 'The card game goes digital. Bond a Rider and a Dragon and duel players around the world.' },
  { slug: 'cthulhu', name: "Lil' Cthulhu", type: 'card', label: 'Card Game', kind: 'Card Game · Original IP', img: 'cthulhu/cover', tag: "You thought his dad was bad. A survival card game where winning isn't the point — lasting is." },
  { slug: 'd2048', name: 'D2048', type: 'mobile', label: 'Mobile Game', kind: 'Mobile Game', img: 'd2048/cover', tag: '2048 meets RPG. Merge tiles, battle monsters, survive the waves.' },
  { slug: 'candi', name: "Candi's Swamp Hop", type: 'mobile', label: 'Mobile Game', kind: 'Mobile Game', img: 'candi/cover', tag: 'Play Like a Girl. Hop through a dangerous swamp full of skulls, slime, and surprises.' },
  { slug: 'gravefall', name: 'Grave Fall', type: 'mobile', label: 'Mobile Game', kind: 'Mobile Game', img: 'gravefall/cover', tag: "A Skully & Bony Rabbit Adventure. Cuteness is coming — and it's falling fast." },
  { slug: 'wraps', name: 'Wraps & Isis', type: 'mobile', label: 'Mobile Game', kind: 'Mobile Game · Character Design', img: 'wraps/cover', tag: 'Escape from Giza. A wild cast of mummies, pharaohs, and cats — and one golden box.' },
  { slug: 'hopz', name: 'Hopz', type: 'mobile client', label: 'Mobile Game', client: true, kind: 'Mobile · Client Work', img: 'hopz/cover', tag: 'Mobile arcade built for a client. UFOs, moons, and high scores.' },
];

// Detail pages for the older projects (text from the March 2026 site).
const OLD = {
  'elementra-card-game': {
    name: 'Elementra', eyebrow: 'Card Game · Dragon Academy', tagline: '2 cards are all you need to win it all!',
    gallery: ['rules-of-play', 'box', 'card-aurora-gayle', 'card-blaze', 'card-radiance', 'card-jade-everbloom', 'card-tannis-mortos'],
    info: [['Type', 'Card Game'], ['Players', '2–8'], ['Age', '10+'], ['Platform', 'Tabletop'], ['Theme', 'Fantasy / Anime'], ['Digital edition', '<a href="/elementra/">Elementra: Dragon Academy app</a>']],
    about: `<p>Elementra: Dragon Academy is a dynamic card game that combines strategy, quick thinking, and a touch of anime flair. Designed for 2 to 8 players, this game offers engaging hand management mechanics that keep each session lively and unpredictable.</p>
<p>Players take on the roles of dragon riders competing in a high-stakes academy tournament. Each turn, you draw a card and decide which to keep and which to discard, triggering unique effects that can aid your strategy or hinder your opponents. The objective is to pair a rider with a dragon, optimizing their combined combat strength to outlast rivals.</p>
<p>The game's vibrant artwork and fast-paced gameplay make it a hit for both casual gatherings and dedicated game nights. Its blend of tactical decision-making and interactive play ensures that no two games are alike, offering endless replayability.</p>
<p>Whether you're a seasoned gamer or new to card games, Elementra: Dragon Academy provides an accessible yet challenging experience that will have you coming back for more.</p>
<h3>Play it on your phone</h3>
<p>Elementra is also an app: <a href="/elementra/">Elementra: Dragon Academy</a> for iPhone, iPad and Android, with online matches against players around the world.</p>` },
  cthulhu: {
    name: "Lil' Cthulhu", eyebrow: 'Card Game · Original IP', tagline: 'You cannot win, you can only survive!',
    info: [['Type', 'Card Game'], ['Players', '2–5'], ['Age', '14+'], ['Platform', 'Tabletop'], ['Funding', 'Kickstarter']],
    about: `<p>Lil' Cthulhu is a fast-paced card game of madness, betrayal, and survival for 2 to 5 players. In this darkly fun game, you play as cultists desperately trying to appease the adorable but terrifying Lil' Cthulhu — a pint-sized Great Old One with a very short temper.</p>
<p>Each round, players scramble to offer gifts, complete rituals, and sabotage their fellow cultists. The goal? Keep Lil' Cthulhu entertained… and keep yourself sane. Fail, and you'll be the next sacrifice.</p>
<p>The game blends strategy, take-that mechanics, and a dose of dark humor. Players must balance self-preservation with clever timing to throw others under the bus — because in the end, there are no winners, only survivors.</p>
<p>Originally funded on Kickstarter, Lil' Cthulhu was created by De-Evolution Studios for anyone who loves card games with chaotic energy, a Lovecraftian twist, and backstabbing fun packed into every turn.</p>` },
  gravefall: {
    name: 'Grave Fall', eyebrow: 'Mobile Game · A Skully & Bony Rabbit Adventure', tagline: 'Run! Cuteness is Coming!',
    info: [['Type', 'Mobile Game'], ['Platform', 'iOS / Android'], ['Genre', 'Endless Runner'], ['Age', '7+'], ['Notable', "Studio's First Title"]],
    about: `<p>Grave Fall is the game that started it all for De-Evolution Studios. In this fast-paced mobile escape, you play as Skully — a skeleton on the run from the most dangerous thing in the graveyard: Candi. She's sweet, she's adorable, and she's absolutely terrifying.</p>
<p>Your only goal? Dodge, dive, and fall as fast as you can to escape her relentless, candy-coated affection. The game's increasing difficulty and dynamic environment require quick thinking and precise movements, offering a challenging and engaging experience.</p>
<p>As De-Evolution Studios' inaugural title, Grave Fall laid the foundation for the company's commitment to creating fun, quick-to-learn, and challenging games. Its success paved the way for subsequent titles like Candi's Swamp Hop and Lil' Cthulhu, further establishing the studio's reputation in the gaming community.</p>` },
  wraps: {
    name: 'Wraps & Isis', eyebrow: 'Mobile Game · Escape from Giza', tagline: 'Escape from Giza — if you can!',
    info: [['Type', 'Mobile Game'], ['Platform', 'iOS / Android'], ['Genre', 'Action / Puzzle'], ['Role', 'Story & Character Design'], ['Sequel', 'Wraps & Isis 2']],
    about: `<p>Wraps & Isis: Escape from Giza follows the adventure of Wraps, an awakened mummy trapped deep inside the Great Pyramid of Giza. Confused but determined, Wraps teams up with his loyal cat Isis and the mischievous ghost of Khufu — the pyramid's original occupant and now its restless spirit.</p>
<p>De-Evolution Studios was tasked with creating the story, characters, and character designs for this project — building a world full of personality, humor, and heart. Every detail was crafted from early sketches to final designs to bring this unlikely trio to life.</p>
<p>Together, Wraps, Isis, and Khufu solve puzzles, dodge ancient traps, and outsmart the pyramid's shifting walls as they fight their way to freedom. The game blends action, mythology, and charm — turning one mummy's escape into a fast-paced, character-driven adventure.</p>
<p>The world expanded in Wraps & Isis 2: Riddle of the Sphinx, a candy-crush-style puzzle game where players dive back in. Once again, De-Evolution Studios created the characters, story, and designs — giving players another fun way to explore this lighthearted world full of humor, magic, and adventure.</p>` },
  hopz: {
    name: 'Hopz', eyebrow: 'Mobile Game · Client Work', tagline: 'A competitive strategy game with a twist!',
    info: [['Type', 'Mobile Game'], ['Platform', 'iOS / Android'], ['Genre', 'Strategy'], ['Client', 'External'], ['Series', 'Hopz / Alien Hopz / Caribbean Hops']],
    about: `<p>We had the chance to reimagine a classic with Hopz, Alien Hopz, and Caribbean Hops — a series of competitive strategy games designed and produced for a client.</p>
<p>These games take the simple concept of Tic-Tac-Toe and flip it on its head. Instead of just placing pieces, players hop over opponents to reach new spots, adding layers of movement, strategy, and surprising depth. Every match becomes a fast-paced battle of positioning, forcing players to think ahead and block their opponent while planning their next hop.</p>
<p>Each version brings a unique setting and style — from colorful alien worlds to sun-soaked Caribbean islands — all while keeping the core gameplay tight, fun, and easy to pick up.</p>
<p>The client loved how this twist turned a familiar game into something fresh, competitive, and packed with replayability. For us, it was the perfect project — simple to learn, hard to master, and endlessly fun to play. This is exactly what we love doing: taking an idea and pushing it further until it's something players can't stop playing.</p>` },
};

module.exports = { CONTACT, mail, MOBILE, PROJECTS, OLD };
