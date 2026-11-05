# Makes the small copies of each game's art the playable ads use (run from this folder; needs the game repos beside the website repo).
from PIL import Image
import os, shutil
C='/home/claude/candi/www/assets'; D='/home/claude/d2048/assets'
def save(src, dst, w=None, h=None, q=72, crop=None):
    im = Image.open(src).convert('RGBA')
    if crop: im = im.crop(crop)
    if w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    if h: im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=q, method=6)
# Candi
o='candi/assets/'
save(f'{C}/img/scenery/sky.webp', o+'sky.webp', w=600, q=60)
save(f'{C}/img/scenery/mid-trees.webp', o+'trees.webp', w=700, q=65)
save(f'{C}/img/scenery/reeds.webp', o+'reeds.webp', w=700, q=65)
for i in (1, 3, 5): save(f'{C}/img/stumps/trees/{i}.webp', o+f'stump{i}.webp', h=700, q=70)
save(f'{C}/img/moss/1.webp', o+'moss.webp', q=80)
save(f'{C}/img/ui/logo.webp', o+'logo.webp', w=520, q=80)
save(f'{C}/img/candi/classic/pose.webp', o+'pose.webp', h=300, q=80)
# a strip of the frames used: stand 30, fly 18-21, fall 2-3, run 22-29, splash 8-10 (1-based, sheet 6 across, 276x272 cells)
frames=[30,18,19,20,21,2,3,22,24,26,28,8,9,10]
sh=Image.open(f'{C}/img/candi/classic/sheet.webp').convert('RGBA'); cw,ch=276,272
strip=Image.new('RGBA',(138*len(frames),136))
for k,f in enumerate(frames):
    i=f-1; cell=sh.crop(((i%6)*cw,(i//6)*ch,(i%6+1)*cw,(i//6+1)*ch)).resize((138,136),Image.LANCZOS)
    strip.paste(cell,(138*k,0))
strip.save(o+'candi.webp','WEBP',quality=80,method=6)
for a in ('float','land','perfect','splash'): shutil.copy(f'{C}/audio/{a}.mp3', o+a+'.mp3')
# D2048
o='d2048/assets/'
save(f'{D}/ui/bg/crypt.webp', o+'bg.webp', w=600, q=60)
save(f'{D}/game/boards/cryptFrame.webp', o+'frame.webp', w=480, q=75)
save(f'{D}/game/boards/cryptTile.webp', o+'cell.webp', w=128, q=75)
names={1:'Copper-Coin',2:'Copper-Coins',3:'Silver-Coin',4:'Silver-Coins',5:'Silver-Bar',6:'Gold-Coin',7:'Gold-Coins',8:'Gold-Bar',9:'Gem'}
for n,s in names.items(): save(f'{D}/game/tiles/tile_{n}_{s}.webp', o+f't{n}.webp', w=128, q=78)
save(f'{D}/game/tiles/tile_Skelleton.webp', o+'skel.webp', w=128, q=78)
save(f'{D}/game/tiles/tile_Chest.webp', o+'chest.webp', w=128, q=78)
save(f'{D}/ui/swordIcon.webp', o+'sword.webp', w=120, q=80)
save(f'{D}/ui/menuLogo.webp', o+'logo.webp', w=560, q=80)
for a,b in (('Coin_Touch','coin'),('Monster_1_Appear','appear'),('Monster_1_Slay_Sound','slay'),('Coins_Explode','explode')): shutil.copy(f'{D}/sounds/{a}.mp3', o+b+'.mp3')
