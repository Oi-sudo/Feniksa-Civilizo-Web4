import fs from 'node:fs';

const requiredFiles=[
  'CITATION-SPEC.md',
  'components/archive/CopyCitationButton.tsx',
  'app/projects/[id]/page.tsx',
  'app/dad/proposals/[id]/page.tsx',
  'app/dad/timeline/page.tsx',
  'app/dad/index/page.tsx',
  'app/dad/archive/page.tsx',
  'app/dad/archive/snapshots/page.tsx',
  'app/dad/archive/compare/page.tsx',
  'app/dad/archive/reports/page.tsx',
  'app/passport/projects/[id]/page.tsx',
  'app/passport/page.tsx'
];

const requiredTokens={
  'app/projects/[id]/page.tsx':[
    'Phoenix Project Dossier','PROJECT','MILESTONE','OUTPUT','RISK','STATUS','BUDGET','CopyCitationButton','slice(0,8)'
  ],
  'app/dad/proposals/[id]/page.tsx':[
    'Phoenix DAD Proposal Dossier','PROPOSAL','DECISION','PROPOSAL-STATUS','CopyCitationButton','slice(0,8)'
  ],
  'app/dad/timeline/page.tsx':[
    'Phoenix DAD Governance Timeline','GOV-EVENT','CopyCitationButton','eventAnchor','eventCitation'
  ],
  'app/dad/index/page.tsx':[
    'PROPOSAL','DECISION','GOV-EVENT','PROJECT','MILESTONE','/dad/proposals/','/dad/decisions','/dad/timeline','/projects/'
  ],
  'app/dad/archive/page.tsx':[
    'PROPOSAL','DECISION','GOV-EVENT','PROJECT','MILESTONE','/dad/decisions','/dad/timeline','/dad/index'
  ],
  'app/dad/archive/snapshots/page.tsx':[
    'Phoenix DAD Governance Archive','ARCHIVE-SNAPSHOT','CopyCitationButton','archive-snapshot-'
  ],
  'app/dad/archive/compare/page.tsx':[
    'ARCHIVE-SNAPSHOT','ARCHIVE-REPORT','Phoenix DAD Governance Change Report','PassportPrintButton','proposal-print-header','proposal-print-footer',
    '/dad/archive/snapshots','proposal_count','decision_count','governance_event_count','project_count','milestone_count',
    'PROPOSAL','DECISION','PROJECT','MILESTONE','getGovernanceArchiveChangeDetails','categoryStats','percent.toFixed'
  ],
  'app/dad/archive/reports/page.tsx':[
    'ARCHIVE-REPORT','/dad/archive/compare','/dad/archive/snapshots','listGovernanceArchiveReports'
  ],
  'app/passport/projects/[id]/page.tsx':[
    'Phoenix Personal Project Passport','PERSONAL-PROJECT','MEMBERSHIP','MEMBERSHIP-END','EST','BUD','CopyCitationButton','slice(0,8)'
  ],
  'app/passport/page.tsx':[
    'Phoenix Passport','EST','BUD','PROJECT','WORK','CopyCitationButton','slice(0,8)'
  ]
};

const errors=[];
for(const file of requiredFiles){
  if(!fs.existsSync(file)) errors.push(`Missing required citation file: ${file}`);
}

for(const [file,tokens] of Object.entries(requiredTokens)){
  if(!fs.existsSync(file)) continue;
  const text=fs.readFileSync(file,'utf8');
  for(const token of tokens){
    if(!text.includes(token)) errors.push(`${file}: missing citation token "${token}"`);
  }

  const citationLines=text.split(/\r?\n/).filter(line=>/citation/i.test(line));
  for(const line of citationLines){
    if(/updated_at/.test(line)) errors.push(`${file}: citation line uses mutable updated_at`);
    if(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(line)){
      errors.push(`${file}: citation line appears to expose a full UUID`);
    }
  }
}

const spec=fs.existsSync('CITATION-SPEC.md')?fs.readFileSync('CITATION-SPEC.md','utf8'):'';
for(const token of ['Phoenix Passport','Phoenix Project Dossier','Phoenix DAD Proposal Dossier','Phoenix DAD Governance Timeline','GOV-EVENT','Phoenix DAD Governance Archive','ARCHIVE-SNAPSHOT','Phoenix DAD Governance Change Report','ARCHIVE-REPORT','Phoenix Personal Project Passport','CopyCitationButton']){
  if(spec && !spec.includes(token)) errors.push(`CITATION-SPEC.md: missing "${token}"`);
}

if(errors.length){
  console.error('Citation integrity check failed:');
  for(const error of errors) console.error('- '+error);
  process.exit(1);
}

console.log('Citation integrity check OK: stable prefixes, short references, copy actions, and citation documentation are present.');
