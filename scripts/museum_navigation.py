"""Build consistent navigation around complete original hall pages."""
from pathlib import Path
import hashlib,json,re

STYLE='''<style id="museum-route-style">
#museum-route-nav{box-sizing:border-box;width:100%;margin:0;padding:12px 20px;background:#132b2b;color:#fff4d7;border-bottom:1px solid #b59756;font:15px/1.6 "Microsoft YaHei",system-ui,sans-serif}
#museum-route-nav .museum-route-inner{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;max-width:1500px;margin:auto}
#museum-route-nav .museum-route-title{min-width:0;overflow-wrap:anywhere;font-weight:600}
#museum-route-nav .museum-route-links{display:flex;align-items:center;flex-wrap:wrap;gap:8px}
#museum-route-nav a{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:7px 12px;border:1px solid #9e8a5f;border-radius:7px;background:#203c3b;color:#fff4d7;font:inherit;line-height:1.5;text-decoration:none;white-space:nowrap}
#museum-route-nav a:hover{background:#385550}#museum-route-nav a:focus-visible{outline:3px solid #ffe49d;outline-offset:3px}
@media(max-width:720px){#museum-route-nav{padding:10px 12px;font-size:14px}#museum-route-nav .museum-route-inner{display:block}#museum-route-nav .museum-route-title{display:block;margin-bottom:8px}#museum-route-nav .museum-route-links{gap:7px}#museum-route-nav a{flex:1 1 auto;padding:7px 9px}}
</style>'''


def connect_halls(out):
    out=Path(out)
    manifest_path=out/'museum/original-source-manifest.json'
    manifest=json.loads(manifest_path.read_text())
    halls=manifest['halls']
    for index,hall in enumerate(halls):
        number=hall['number']
        rel=Path(hall['url'])
        page=out/'museum'/rel
        if page.is_dir():page=page/'index.html'
        original=page.with_name('01-original.html' if number=='01' else 'original.html')
        if not original.exists():original.write_bytes(page.read_bytes())
        if hashlib.sha256(original.read_bytes()).hexdigest()!=hall['sha256']:
            raise RuntimeError('Untouched original hash mismatch: '+number)
        data=page.read_bytes()
        if b'id="museum-route-nav"' in data:raise RuntimeError('Navigation already applied')
        def url(h):return '/museum/'+h['url']
        links=['<a href="/museum/">九馆目录 / Naŭ haloj</a>']
        if index>0:links.append('<a rel="prev" href="'+url(halls[index-1])+'">← 上一馆 / Antaŭa</a>')
        if index+1<len(halls):links.append('<a rel="next" href="'+url(halls[index+1])+'">下一馆 / Sekva →</a>')
        links+=['<a href="/museum/#videos">十二集视频 / Filmoj</a>', '<a href="'+original.name+'" download="phoenix-hall-'+number+'-original.html">下载原版 / Originalo</a>']
        nav='<nav id="museum-route-nav" aria-label="九馆参观导航"><div class="museum-route-inner"><span class="museum-route-title">凤凰文明数字博物馆 · 第'+number+'馆 / Halo '+number+'</span><div class="museum-route-links">'+''.join(links)+'</div></div></nav>'
        if data.count(b'</head>')!=1:raise RuntimeError('Ambiguous head: '+number)
        data=data.replace(b'</head>',STYLE.encode()+b'</head>',1)
        data,count=re.subn(rb'(<body(?:\s[^>]*)?>)',lambda m:m.group(1)+nav.encode(),data,count=1)
        if count!=1:raise RuntimeError('Missing body: '+number)
        # The originals retain their historic Vercel links; live entries return to this museum.
        data=re.sub(rb'https://feniksa-civilizo-web4\.vercel\.app/museum/halls/[A-Z_]+',b'/museum/#nine',data)
        page.write_bytes(data)
        hall['untouched_original_url']=str(original.relative_to(out/'museum'))
        hall['entry_navigation']='Museum directory, adjacent halls, original download and 12 videos; complete original content retained.'
        print('Connected hall:',number)
    manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
