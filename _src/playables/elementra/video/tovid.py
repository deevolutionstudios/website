import sys,subprocess
clip=sys.argv[1]; d=f'frames/{clip}'
rows=[l.split() for l in open(f'{d}/times.txt') if l.strip()]
with open(f'{d}/list.txt','w') as f:
    for i,(n,t) in enumerate(rows):
        dur=(float(rows[i+1][1])-float(t)) if i+1<len(rows) else 0.5
        f.write(f"file '{n}'\nduration {max(dur,0.001):.4f}\n")
    f.write(f"file '{rows[-1][0]}'\n")
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',f'{d}/list.txt','-vf','fps=30,scale=720:1280,format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','16',f'raw-{clip}.mp4'],check=True)
print(clip, subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'raw-{clip}.mp4'],capture_output=True,text=True).stdout.strip())
