import fs from 'node:fs';

const zh=JSON.parse(fs.readFileSync(new URL('../locales/zh.json', import.meta.url),'utf8'));
const eo=JSON.parse(fs.readFileSync(new URL('../locales/eo.json', import.meta.url),'utf8'));

const zhKeys=Object.keys(zh).sort();
const eoKeys=Object.keys(eo).sort();
const missing=zhKeys.filter(k=>!(k in eo));
const extra=eoKeys.filter(k=>!(k in zh));
const cjk=/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;
const eoWithCjk=eoKeys.filter(k=>cjk.test(String(eo[k])));

function placeholders(value){
  return [...String(value).matchAll(/\{([A-Za-z0-9_]+)\}/g)].map(m=>m[1]).sort();
}

const placeholderMismatches=zhKeys.filter(k=>{
  if(!(k in eo)) return false;
  return JSON.stringify(placeholders(zh[k]))!==JSON.stringify(placeholders(eo[k]));
});

if(missing.length||extra.length||eoWithCjk.length||placeholderMismatches.length){
  console.error('Esperanto i18n integrity check failed.');
  if(missing.length) console.error('Missing EO keys:',missing.join(', '));
  if(extra.length) console.error('Unexpected EO keys:',extra.join(', '));
  if(eoWithCjk.length) console.error('EO values containing CJK characters:',eoWithCjk.join(', '));
  if(placeholderMismatches.length) console.error('Placeholder mismatches:',placeholderMismatches.join(', '));
  process.exit(1);
}

console.log(`Esperanto i18n integrity OK: ${zhKeys.length} keys, no CJK fallback text, placeholders aligned.`);
