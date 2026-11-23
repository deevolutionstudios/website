// Project Flip: the studio's secret game page (/flip/). Richard, Nov 23, 2026: hide the game's name, show no screens,
// a roster of Season 1 fighters in silhouette, one revealed every Monday, and an alpha tester sign-up.
// THIS REPO IS PUBLIC: only fighters already revealed may be listed here, and only their art may be in assets/img/flip.
// The full plan (who comes out when) lives in the game's own private repo (docs/project-flip-reveals.md); the
// weekly reveal adds the next fighter here, copies its art in as f-<random>.webp, rebuilds and pushes.
// shadow-N.webp are the silhouettes, in reveal order; `n` is the fighter's place in that order.
module.exports = {
  total: 8,
  start: '2026-11-23', // the first Monday; fighter n is revealed on start + 7 * (n - 1) days, 09:00 Berlin
  revealed: [
    { n: 1, name: 'Fritz', file: 'f-5c44ba965a', faction: 'Storm',
      line: 'A marten who chews through cables for fun. Sparks follow him everywhere, and so does trouble.' },
  ],
};
