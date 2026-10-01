import { spawn } from 'node:child_process';

const port=Number(process.env.PORT||3000);
const base=process.env.APP_URL||`http://127.0.0.1:${port}`;
const routes=[
  '/api/health',
  '/dad',
  '/dad/archive',
  '/dad/archive/snapshots',
  '/dad/archive/compare',
  '/dad/archive/reports',
  '/dad/archive/years',
  '/dad/archive/annual-reports',
  '/dad/archive/years/2026',
  '/dad/archive/years/2026/10',
  '/dad/archive/years/2026/summary'
];

const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p',String(port)],{
  stdio:['ignore','pipe','pipe'],
  env:{...process.env,PORT:String(port)}
});

let stderr='';
server.stderr.on('data',d=>{stderr+=String(d);});

const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const fetchWithTimeout=(url,ms=10000)=>fetch(url,{redirect:'manual',signal:AbortSignal.timeout(ms)});

async function waitForServer(){
  for(let i=0;i<40;i++){
    try{
      const res=await fetchWithTimeout(base+'/api/health',3000);
      if(res.status<500) return;
    }catch{}
    await sleep(500);
  }
  throw new Error('Next.js server did not become ready. '+stderr.slice(-2000));
}

try{
  await waitForServer();
  const failures=[];
  for(const route of routes){
    try{
      const res=await fetchWithTimeout(base+route,10000);
      if(res.status<200||res.status>=400) failures.push(`${route} -> HTTP ${res.status}`);
      else console.log(`runtime route ok: ${route} -> ${res.status}`);
    }catch(e){
      failures.push(`${route} -> ${e instanceof Error?e.message:String(e)}`);
    }
  }
  if(failures.length){
    console.error('Runtime route verification failed:\n'+failures.join('\n'));
    process.exitCode=1;
  }else{
    console.log(`Runtime route verification passed: ${routes.length} routes.`);
  }
} finally {
  if(!server.killed) server.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve=>server.once('exit',resolve)),
    sleep(2000)
  ]);
}
