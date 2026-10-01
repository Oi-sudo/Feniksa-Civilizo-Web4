import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasAnyRole } from '@/lib/permissions/rbac';
import { listAdminMuseumAssets,type MuseumEvidenceFilter } from '@/lib/museum/data';

function esc(v:unknown){const s=String(v??'');return '"'+s.replaceAll('"','""')+'"';}
export async function GET(req:NextRequest){
 const user=await getCurrentUser();
 if(!user||!hasAnyRole(user,['admin','curator','museum_reviewer']))return NextResponse.json({error:'需要馆藏管理权限。'},{status:403});
 const sp=req.nextUrl.searchParams;
 const raw=sp.get('evidence')||'all'; const allowed=new Set<MuseumEvidenceFilter>(['all','missing','unverified','source_confirmed','reviewed']);
 const evidence=allowed.has(raw as MuseumEvidenceFilter)?raw as MuseumEvidenceFilter:'all';
 const volume=sp.get('volume')||null, hall=sp.get('hall')||null;
 const rows=await listAdminMuseumAssets(1000,evidence,volume,hall);
 const head=['编号','藏品名称','分册','主馆籍','总证据','未核','来源已确认','已审阅','下一步'];
 const lines=[head.map(esc).join(',')];
 for(const a of rows){
  const next=Number(a.evidence_count)===0?'补充原始证据':Number(a.evidence_unverified)>0?'确认未核附件来源':Number(a.evidence_source_confirmed)>0?'进行档案审阅':'证据流程已完成';
  lines.push([a.catalog_code||a.permanent_code,a.title_zh,a.catalog_volume||'独立登记',a.hall_zh||'待定',a.evidence_count,a.evidence_unverified,a.evidence_source_confirmed,a.evidence_reviewed,next].map(esc).join(','));
 }
 const csv='\uFEFF'+lines.join('\r\n');
 return new NextResponse(csv,{status:200,headers:{'content-type':'text/csv; charset=utf-8','content-disposition':'attachment; filename="museum-evidence-worklist.csv"'}});
}
