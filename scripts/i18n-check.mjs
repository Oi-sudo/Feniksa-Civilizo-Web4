import fs from 'node:fs';

const zh=JSON.parse(fs.readFileSync(new URL('../locales/zh.json', import.meta.url),'utf8'));
const eo=JSON.parse(fs.readFileSync(new URL('../locales/eo.json', import.meta.url),'utf8'));
const en=JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url),'utf8'));

const zhKeys=Object.keys(zh).sort();
const eoKeys=Object.keys(eo).sort();
const enKeys=Object.keys(en).sort();
const missing=zhKeys.filter(k=>!(k in eo));
const extra=eoKeys.filter(k=>!(k in zh));
const enMissing=zhKeys.filter(k=>!(k in en));
const enExtra=enKeys.filter(k=>!(k in zh));
const cjk=/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;
const eoWithCjk=eoKeys.filter(k=>cjk.test(String(eo[k])));
const enWithCjk=enKeys.filter(k=>cjk.test(String(en[k])));

function placeholders(value){
  return [...String(value).matchAll(/\{([A-Za-z0-9_]+)\}/g)].map(m=>m[1]).sort();
}

const placeholderMismatches=zhKeys.filter(k=>{
  if(!(k in eo)) return false;
  return JSON.stringify(placeholders(zh[k]))!==JSON.stringify(placeholders(eo[k]));
});
const enPlaceholderMismatches=zhKeys.filter(k=>{
  if(!(k in en)) return false;
  return JSON.stringify(placeholders(zh[k]))!==JSON.stringify(placeholders(en[k]));
});

if(missing.length||extra.length||enMissing.length||enExtra.length||eoWithCjk.length||enWithCjk.length||placeholderMismatches.length||enPlaceholderMismatches.length){
  console.error('Esperanto i18n integrity check failed.');
  if(missing.length) console.error('Missing EO keys:',missing.join(', '));
  if(extra.length) console.error('Unexpected EO keys:',extra.join(', '));
  if(enMissing.length) console.error('Missing EN keys:',enMissing.join(', '));
  if(enExtra.length) console.error('Unexpected EN keys:',enExtra.join(', '));
  if(eoWithCjk.length) console.error('EO values containing CJK characters:',eoWithCjk.join(', '));
  if(enWithCjk.length) console.error('EN values containing CJK characters:',enWithCjk.join(', '));
  if(placeholderMismatches.length) console.error('EO placeholder mismatches:',placeholderMismatches.join(', '));
  if(enPlaceholderMismatches.length) console.error('EN placeholder mismatches:',enPlaceholderMismatches.join(', '));
  process.exit(1);
}

console.log(`Trilingual i18n integrity OK: ${zhKeys.length} keys in ZH/EO/EN, no CJK fallback text in EO/EN, placeholders aligned.`);
