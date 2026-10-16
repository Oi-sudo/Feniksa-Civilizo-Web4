from pathlib import Path
import hashlib,json,shutil
root=Path(__file__).resolve().parents[1]
out=root/'dist'
if out.exists(): shutil.rmtree(out)
shutil.copytree(root,out,ignore=shutil.ignore_patterns('.git','dist','_original_parts','scripts','netlify.toml','.gitignore'))
for item in json.loads((root/'_original_parts/manifest.json').read_text()):
    data=b''.join((root/part).read_bytes() for part in item['parts'])
    if len(data)!=item['bytes'] or hashlib.sha256(data).hexdigest()!=item['sha256']:
        raise RuntimeError('Original integrity check failed: '+item['path'])
    target=out/item['path']
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_bytes(data)
    print('Verified original:',item['path'],len(data))

# Keep exact originals available; add a bounded playback compatibility fix.
from audio_resilience import enhance_players
enhance_players(out)
