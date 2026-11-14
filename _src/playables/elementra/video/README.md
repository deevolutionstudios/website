# Elementra's 30-second video ad (Nov 14, 2026)

How playables/elementra/ad.mp4 was made, to redo or change it:

1. Run the game locally (`npx vite --port 5173` in the elementra repo).
2. `node record.mjs table`, `node record.mjs upgrade`, `node record.mjs home`: record the game at 720x1280 (CDP screencast),
   then `python3 tovid.py <clip>` turns each into raw-<clip>.mp4.
3. `node text.mjs`: the captions, PLAY FREE, badges and tagline as PNGs in the game's own font (Cinzel).
4. `bash build.sh`: the seven scenes (hook on the launch art, deal, peek, battle, upgrade to Master, Home, end card),
   joined, with the Elementra theme. The end card starts at 26.4 s (END in playables/elementra/video.html).

The paths in the scripts point at the folder they were made in; adjust them before running.
