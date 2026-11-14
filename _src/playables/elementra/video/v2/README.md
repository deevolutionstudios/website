# Elementra video ad, version 2 (Nov 14, 2026: the one in playables/elementra/ad.mp4)

Cut to the game's battle music (public/music/battle.mp3, 148 bpm, 29.6 s): every cut and hit is on a beat.
ad.html draws every frame from one function, render(t); capture.mjs screenshots it at 30 fps (`node capture.mjs all`),
from the version-1 folder's recorded gameplay cut into frame sequences (seq/<name>/NNNN.jpg) and stills of the
Radiance upgrade (up_*.png). Then: music at 0.8 plus the game's sound effects on the hits (public/sfx: clash, flip,
deal, peek, battle-start, victory, upgrade, unlock, match-found, notify, reward), encoded at 1.5 Mb/s (about 6 MB).
The end card starts at 26.5 s (END in playables/elementra/video.html); the logo slams in at 27.45 s.
