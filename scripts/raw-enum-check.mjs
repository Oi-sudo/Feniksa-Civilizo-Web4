import fs from 'node:fs';
import path from 'node:path';

const roots=['app','components'];
const files=[];
function walk(dir){
  for(const name of fs.readdirSync(dir)){
    const full=path.join(dir,name);
    const st=fs.statSync(full);
    if(st.isDirectory()) walk(full);
    else if(/\.(ts|tsx)$/.test(name)) files.push(full);
  }
}
for(const root of roots) if(fs.existsSync(root)) walk(root);

const fields=[
  'review_status','workflow_status','public_status','project_confirmation_status',
  'service_type','access_level','content_status','verification_status','evidence_role',
  'note_type','work_type','ownership_status','valuation_status','digital_rights_status'
];

const findings=[];
for(const file of files){
  const lines=fs.readFileSync(file,'utf8').split(/\r?\n/);
  lines.forEach((line,i)=>{
    for(const field of fields){
      const direct=new RegExp('\\{\\s*[A-Za-z_$][\\w$]*\\.'+field+'\\s*\\}');
      if(direct.test(line)){
        const trimmed=line.trim();
        const propPattern='\\w+\\s*=\\s*\\{\\s*[A-Za-z_$][\\w$]*\\.'+field+'\\s*\\}';
        const looksLikeProp=new RegExp(propPattern).test(trimmed);
        if(!looksLikeProp) findings.push({file,line:i+1,field,text:trimmed});
      }
    }
  });
}

if(findings.length){
  console.error('Potential raw internal values rendered directly:');
  for(const f of findings) console.error(`${f.file}:${f.line} [${f.field}] ${f.text}`);
  process.exit(1);
}

console.log(`Raw enum leak scan OK: ${files.length} TS/TSX files checked; no direct internal-field rendering found.`);
