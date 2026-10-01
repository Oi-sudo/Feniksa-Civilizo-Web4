import fs from 'node:fs';
import path from 'node:path';

const roots=['app','components'];
const sourceFiles=[];

function walk(dir){
  for(const name of fs.readdirSync(dir)){
    const full=path.join(dir,name);
    const st=fs.statSync(full);
    if(st.isDirectory()) walk(full);
    else if(/\.(ts|tsx)$/.test(name)) sourceFiles.push(full);
  }
}
for(const root of roots) if(fs.existsSync(root)) walk(root);

const cjk=/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;
const findings=[];

for(const file of sourceFiles){
  const text=fs.readFileSync(file,'utf8');
  const lines=text.split(/\r?\n/);
  lines.forEach((line,index)=>{
    if(!/eo\s*\?/.test(line) || !cjk.test(line)) return;
    if(/\ben\s*\?/.test(line)) return;
    findings.push({file,line:index+1,text:line.trim()});
  });
}

if(findings.length){
  console.error('Potential ZH/EO binary branches that may omit EN:');
  for(const f of findings) console.error(`${f.file}:${f.line}  ${f.text}`);
  process.exit(1);
}

console.log(`Locale branch scan OK: ${sourceFiles.length} TS/TSX files checked; no obvious EO/ZH-only branch found.`);
