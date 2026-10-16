"""Publish complete supplied DOCX text as accessible reading pages, without editing originals."""
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from html import escape
from html.parser import HTMLParser
from urllib.parse import quote
import hashlib,json,re

W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
STYLE='''<style>
:root{--reading-size:20px;--ink:#203c35;--paper:#f8f5ec}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:18px/1.8 "Microsoft YaHei",system-ui,sans-serif}a{color:#285e51}a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid #b1730d;outline-offset:4px}.reader-nav{background:#18342f;color:#fff2cf;padding:12px 20px;display:flex;gap:10px;flex-wrap:wrap}.reader-nav a{display:inline-flex;align-items:center;min-height:44px;padding:7px 12px;border:1px solid #b9a375;border-radius:7px;color:inherit;text-decoration:none}.reader-nav a:hover{background:#34584c}main{max-width:900px;padding:30px 24px 70px;margin:auto}h1{font-size:clamp(27px,4vw,38px);line-height:1.5;overflow-wrap:anywhere}h2{font-size:1.35em;line-height:1.6;margin:2em 0 .7em;scroll-margin-top:100px}p{margin:.65em 0;overflow-wrap:anywhere}.reader-text{font-size:var(--reading-size);line-height:1.95;white-space:normal}.reader-text .subtitle{color:#526e60}.reader-text .empty{min-height:.4em;margin:0}.reader-text [lang=eo]{color:#34594b}.reader-tools{position:sticky;top:0;z-index:10;background:#f8f5ecf5;border-bottom:1px solid #c6cfc4;display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:10px 0}.reader-tools button{min-height:44px;min-width:48px;padding:6px 13px;border:1px solid #8c9f8b;border-radius:6px;background:#fffdf6;color:#203c35;font:18px/1.5 system-ui,sans-serif;cursor:pointer}.reader-tools button:disabled{opacity:.45;cursor:default}.reader-tools output{font-size:15px}.book-note{font-size:16px;color:#536557}details{margin:22px 0;padding:14px 18px;border:1px solid #b8c3b2;border-radius:8px}summary{cursor:pointer;min-height:36px;font-weight:600}details a{display:inline-block;padding:6px 0;min-height:40px}details li{padding-left:4px}.books-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:18px}.book-card{padding:22px;border:1px solid #b8c3b2;border-radius:10px;background:#fffdf7}.book-card h2{font-size:23px;margin:0 0 12px}.book-card a{display:inline-block;min-height:44px;padding:8px 0;margin-right:15px}.reader-footer{margin-top:40px;display:flex;flex-wrap:wrap;gap:20px}.reader-footer a{min-height:44px;padding:8px 0}@media(max-width:600px){main{padding:20px 16px 55px}.reader-nav{padding:10px 12px;font-size:15px;gap:7px}.reader-nav a{flex:1 1 auto;justify-content:center}.reader-tools{gap:7px}.reader-text{line-height:1.95}}@media print{.reader-nav,.reader-tools,details,.reader-footer{display:none}main{max-width:none;padding:0}.reader-text{font-size:12pt;color:#000}}
</style>'''

class ParagraphCheck(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.values=[];self.current=None;self.tag=None
    def handle_starttag(self,tag,attrs):
        if dict(attrs).get('data-source-paragraph') is not None:self.current='';self.tag=tag
        elif tag=='br' and self.current is not None:self.current+='\n'
    def handle_data(self,data):
        if self.current is not None:self.current+=data
    def handle_endtag(self,tag):
        if self.current is not None and tag==self.tag:self.values.append(self.current);self.current=None;self.tag=None

def paragraph(para):
    chunks=[];plain=[]
    for run in para.iter(W+'r'):
        text=''
        for node in run.iter():
            if node.tag==W+'t':text+=node.text or ''
            elif node.tag==W+'br':text+='\n'
            elif node.tag==W+'tab':text+='\t'
        plain.append(text);markup=escape(text).replace('\n','<br>')
        for prop,tag in [('b','strong'),('i','em')]:
            node=run.find(W+'rPr/'+W+prop)
            if node is not None and node.get(W+'val','true') not in ('0','false','off'):markup=f'<{tag}>'+markup+f'</{tag}>'
        chunks.append(markup)
    return ''.join(chunks),''.join(plain)

def shell(title,body):
    return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+' · 凤凰文明数字博物馆</title>'+STYLE+'</head><body>'+body+'</body></html>'

def publish_reading_room(out):
    out=Path(out);halls=json.loads((out/'museum/original-source-manifest.json').read_text())['halls'];catalogue=[]
    for index,hall in enumerate(halls):
        number=hall['number'];directory=out/'museum/halls' if number=='01' else out/'museum/halls'/number
        docs=list(directory.glob('*.docx'))
        if len(docs)!=1:raise RuntimeError('Expected one original DOCX: '+number)
        doc=docs[0]
        with ZipFile(doc) as z:
            xml=ET.fromstring(z.read('word/document.xml'))
            # Stop if a future source requires richer conversion; never silently omit it.
            for tag in ('tbl','drawing','pict','ins','del','fldSimple','instrText','numPr','footnoteReference','endnoteReference'):
                if xml.find('.//'+W+tag) is not None:raise RuntimeError('Unsupported DOCX content '+tag+' in '+number)
            extras=[n for n in z.namelist() if re.match(r'word/(?:media/|header\d|footer\d|footnotes\.xml|endnotes\.xml)',n)]
            if extras:raise RuntimeError('Additional source content requires review: '+str(extras))
            paras=list(xml.find(W+'body').iter(W+'p'))
        rendered=[];plain=[];toc=[];title='';chapter=0
        for position,para in enumerate(paras):
            markup,text=paragraph(para);plain.append(text)
            style=para.find(W+'pPr/'+W+'pStyle');style=style.get(W+'val') if style is not None else 'Normal'
            language='zh-CN' if re.search('[\u3400-\u9fff]',text) else 'eo'
            attrs=f' data-source-paragraph="{position}" lang="{language}"'
            if style=='Title':
                if title:raise RuntimeError('Multiple source titles: '+number)
                title=text;tag='h1'
            elif style.startswith('Heading'):
                chapter+=1;tag='h2';attrs+=f' id="chapter-{chapter}"';toc.append((chapter,text))
            else:
                tag='p'
                if style=='Subtitle':attrs+=' class="subtitle"'
                if not text:attrs+=' class="empty" aria-hidden="true"'
            rendered.append(f'<{tag}{attrs}>{markup}</{tag}>')
        if not title:raise RuntimeError('Missing source title: '+number)
        content=''.join(rendered);check=ParagraphCheck();check.feed(content)
        if check.values!=plain:raise RuntimeError('Paragraph loss in HTML: '+number)
        document_url='/'+quote(str(doc.relative_to(out)),safe='/')
        nav='<nav class="reader-nav" aria-label="读本导航"><a href="/museum/">九馆目录 / Naŭ haloj</a><a href="/museum/books/">读本目录 / Libroj</a><a href="/museum/'+hall['url']+'">进入本馆 / Eniri la halon</a><a href="'+document_url+'" download>下载原版Word / Elŝuti</a></nav>'
        tools='<div class="reader-tools" aria-label="阅读字号"><span>文字大小 / Tekstogrando</span><button type="button" id="text-smaller" aria-label="缩小文字">A−</button><button type="button" id="text-larger" aria-label="放大文字">A＋</button><output id="text-size" aria-live="polite">20 px</output></div>'
        contents='<details id="book-contents"><summary>本册目录 · '+str(len(toc))+'节 / Enhavo</summary><ol>'+''.join('<li><a href="#chapter-'+str(n)+'">'+escape(t)+'</a></li>' for n,t in toc)+'</ol></details>'
        footer='<nav class="reader-footer" aria-label="相邻读本">'
        if index:footer+='<a rel="prev" href="/museum/books/'+halls[index-1]['number']+'/">← 上一本 / Antaŭa</a>'
        if index+1<len(halls):footer+='<a rel="next" href="/museum/books/'+halls[index+1]['number']+'/">下一本 / Sekva →</a>'
        footer+='</nav>'
        body=nav+'<main><p class="book-note">第'+number+'馆完整双语读本。文字与顺序按原版Word保留，原版排版请下载查看。</p>'+tools+contents+'<article class="reader-text" aria-label="完整双语读本">'+content+'</article>'+footer+'</main><script src="/museum/book-reader.js" defer></script>'
        target=out/'museum/books'/number/'index.html';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(shell(title,body))
        catalogue.append({'number':number,'title':title,'url':'/museum/books/'+number+'/','docx_url':document_url,'source_sha256':hashlib.sha256(doc.read_bytes()).hexdigest(),'paragraphs':len(plain),'chapters':len(toc),'text_sha256':hashlib.sha256(json.dumps(plain,ensure_ascii=False).encode()).hexdigest(),'all_source_paragraphs_preserved':True})
        print('Complete reader verified:',number,len(plain),'paragraphs')
    cards=''.join('<article class="book-card"><h2>'+b['number']+' · '+escape(b['title'].replace('汉语世界语双语读本','').strip())+'</h2><p>'+str(b['chapters'])+'节 · 汉语—世界语完整读本</p><a href="'+b['url']+'">在线阅读全文 / Legi</a><a href="'+b['docx_url']+'" download>原版Word / Originalo</a></article>' for b in catalogue)
    index='<nav class="reader-nav" aria-label="读本导航"><a href="/museum/">返回九馆 / Naŭ haloj</a><a href="/museum/#videos">十二集视频 / Filmoj</a></nav><main><h1>九馆双语读本</h1><p lang="eo">La kompletaj dulingvaj legolibroj de la naŭ haloj</p><p>汉语与世界语原文完整保留，可按章节阅读、放大文字，或下载原版Word。</p><div class="books-grid">'+cards+'</div></main>'
    (out/'museum/books/index.html').write_text(shell('九馆双语读本',index))
    (out/'museum/books/source-manifest.json').write_text(json.dumps(catalogue,ensure_ascii=False,indent=2)+'\n')
