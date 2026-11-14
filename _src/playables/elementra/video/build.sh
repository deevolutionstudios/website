#!/bin/bash
# Builds the Elementra 30-second ad (720x1280, 30 fps) from the recorded clips, captions and art.
set -e
cd "$(dirname "$0")"
ENC="-c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -r 30"
ART=/home/claude/elementra/art
mkdir -p seg

# a framed game clip: blurred copy behind, the game at 84% with a thin gold edge, caption on top
framed() { # out src start dur caption
  local out=$1 src=$2 ss=$3 d=$4 cap=$5
  ffmpeg -v error -y -ss "$ss" -t "$d" -i "$src" -loop 1 -t "$d" -i "$cap" -filter_complex "
    [0:v]fps=30,setpts=PTS-STARTPTS,split[a][b];
    [a]scale=720:1280,boxblur=24:2,eq=brightness=-0.28:saturation=1.2[bg];
    [b]scale=604:1074,pad=610:1080:3:3:color=0xE8A93A[fg];
    [bg][fg]overlay=55:188[v1];
    [1:v]format=rgba,fade=in:st=0.05:d=0.25:alpha=1[cap];
    [v1][cap]overlay=0:-12,fade=in:st=0:d=0.12,format=yuv420p" $ENC -t "$d" "seg/$out.tmp.mp4"
  mv "seg/$out.tmp.mp4" "seg/$out.mp4"
}

# 1. hook: the launch art, slowly pushing in, "ALL YOU NEED IS TWO CARDS"
ffmpeg -v error -y -loop 1 -i hl.jpg -loop 1 -i c1.png -loop 1 -i grad.png -filter_complex "
  [0:v]crop=910:1618:85:0,zoompan=z='1+0.0009*on':x='iw/2-(iw/zoom/2)':y='ih/3-(ih/zoom/3)':d=1:s=720x1280:fps=30,eq=brightness=-0.08[bg];
  [1:v]format=rgba,fade=in:st=0.25:d=0.35:alpha=1[cap];
  [bg][2:v]overlay=0:0[bg2];[bg2][cap]overlay=0:60,format=yuv420p" $ENC -t 2.6 seg/s1.tmp.mp4 && mv seg/s1.tmp.mp4 seg/s1.mp4

framed s2 raw-table.mp4 0.8 4.0 c2.png
framed s3 raw-table.mp4 34.2 3.4 c3.png
framed s4 raw-table.mp4 66.6 5.0 c4.png
framed s5 raw-upgrade.mp4 0.4 6.6 c5.png
framed s6 raw-home.mp4 0.4 4.8 c6.png

# 7. end card: dimmed art, the logo pops in, PLAY FREE, the store badges, the tagline
ffmpeg -v error -y -loop 1 -i hl.jpg -loop 1 -i $ART/logo.png -loop 1 -i free.png -loop 1 -i badges.png -loop 1 -i sub.png -filter_complex "
  [0:v]crop=910:1618:85:0,scale=720:1280,boxblur=6:1,eq=brightness=-0.32[bg];
  [1:v]scale=620:-1,format=rgba,fade=in:st=0:d=0.3:alpha=1[logo];
  [2:v]format=rgba,fade=in:st=0.5:d=0.3:alpha=1[free];
  [3:v]format=rgba,fade=in:st=0.8:d=0.3:alpha=1[bad];
  [4:v]format=rgba,fade=in:st=1.1:d=0.3:alpha=1[sub];
  [bg][logo]overlay=(W-w)/2:300[a];[a][free]overlay=(W-w)/2:560[b];[b][bad]overlay=(W-w)/2:700[c];[c][sub]overlay=(W-w)/2:840,format=yuv420p" $ENC -t 3.6 seg/s7.tmp.mp4 && mv seg/s7.tmp.mp4 seg/s7.mp4

printf "file 'seg/s%d.mp4'\n" 1 2 3 4 5 6 7 > concat.txt
ffmpeg -v error -y -f concat -safe 0 -i concat.txt -c copy video-only.mp4
# music: the Elementra theme, faded in and out
ffmpeg -v error -y -i video-only.mp4 -i /home/claude/elementra/public/music/elementra-theme.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -af "afade=in:st=0:d=0.4,afade=out:st=28.3:d=1.7,volume=0.9" -t 30 -movflags +faststart ad.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 ad.mp4
