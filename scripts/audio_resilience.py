"""Add audio-only operation to original players when WebGL cannot initialize.

Source HTML and embedded media remain unchanged in the repository. Each original
is also published byte-for-byte as original.html alongside the enhanced entry.
"""
from pathlib import Path
import hashlib


def replace_once(data, before, after):
    before, after = before.encode(), after.encode()
    if data.count(before) != 1:
        raise RuntimeError('Original player changed; refusing an ambiguous patch: ' + before.decode())
    return data.replace(before, after, 1)


def enhance_players(out):
    for number in ('03', '05', '08', '09'):
        page = Path(out) / 'museum' / 'halls' / number / 'index.html'
        original = page.read_bytes()
        page.with_name('original.html').write_bytes(original)
        data = replace_once(original,
            "if(!modelReady){soundMessage('3D场景正在准备，请稍后再点播放。');return;}",
            """if(!modelReady){
  film=true;filmAudio=true;
  if(guideWantPlay){pauseGuideAudio();soundMessage('已暂停 · 可继续阅读文献');}
  else{if(guideTime()>=39.99)seekGuideAudio(0);playGuideAudio();}
  return;
 }""")
        data = replace_once(data,
            "if(!modelReady){soundMessage('请等待3D场景准备完成。');return;}",
            "if(!modelReady){film=true;filmAudio=true;seekGuideAudio(requested);updateSoundControls();return;}")
        data = replace_once(data,
            'if(reset){goalTarget.set(0,4,0);',
            'if(reset&&modelReady){goalTarget.set(0,4,0);')
        data = replace_once(data,
            ('请用较新的 Edge 或 Chrome 打开，并启用浏览器硬件加速。您仍可使用' + ('供位' if number == '05' else '文献') + '介绍和馆藏登记入口。'),
            '此设备暂不能显示3D。您仍可直接播放下方双语有声导览、切换语言并阅读全部文献；支持3D的浏览器可正常参观展馆。')
        start = data.index(b'<nav class="alignment-bar"')
        end = data.index(b'</nav>', start)
        link = '<a href="original.html" download>下载原版网页 / Elŝuti la originalon</a>'.encode()
        data = data[:end] + link + data[end:]
        page.write_bytes(data)
        if page.with_name('original.html').read_bytes() != original:
            raise RuntimeError('Original copy changed: ' + number)
        print('Audio fallback ready:', number, 'original SHA-256', hashlib.sha256(original).hexdigest())
