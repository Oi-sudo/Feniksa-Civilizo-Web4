import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';

const allowedInterests=new Set([
  'esperanto_teaching','translation','proofreading','buddhist_controlled_language',
  'museum_documentation','media_subtitles','website_testing','3d_design',
  'dad_archiving','elder_learning_support'
]);
const allowedLanguages=new Set(['zh','eo','en','fr','nl','de','other']);

export async function POST(req:NextRequest){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const user=await getCurrentUser();
  if(!user)return NextResponse.json({error:eo?'Bonvolu unue ensaluti.':en?'Please log in first.':'请先登录。'},{status:401});
  try{
    const b=await req.json();
    const interests=Array.isArray(b.interests)?b.interests.map(String).filter((x:string)=>allowedInterests.has(x)):[];
    const languages=Array.isArray(b.languages)?b.languages.map(String).filter((x:string)=>allowedLanguages.has(x)):[];
    const availability=String(b.availability||'').trim().slice(0,120);
    const note=String(b.note||'').trim().slice(0,2000);
    const consentPublicContact=Boolean(b.consentPublicContact);
    if(interests.length===0)return NextResponse.json({error:eo?'Elektu almenaŭ unu kunlaboran direkton.':en?'Choose at least one participation area.':'请至少选择一个参与方向。'},{status:400});

    await withTransaction(async client=>{
      await client.query(
        `INSERT INTO volunteer_profiles(user_id,interests,languages,availability,note,consent_public_contact,status)
         VALUES($1,$2,$3,$4,$5,$6,'active')
         ON CONFLICT(user_id) DO UPDATE SET
           interests=EXCLUDED.interests,
           languages=EXCLUDED.languages,
           availability=EXCLUDED.availability,
           note=EXCLUDED.note,
           consent_public_contact=EXCLUDED.consent_public_contact,
           status='active',
           updated_at=NOW()`,
        [user.id,interests,languages,availability||null,note||null,consentPublicContact]
      );
      await client.query(
        `INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
         VALUES($1,'volunteer.profile.upsert','volunteer_profile',$1,$2::jsonb)`,
        [user.id,JSON.stringify({interests,languages,availability:availability||null,consentPublicContact})]
      );
    });
    return NextResponse.json({ok:true});
  }catch(e){
    console.error(e);
    return NextResponse.json({error:eo?'Provizore ne eblas konservi la registron.':en?'The participation record cannot be saved right now.':'暂时无法保存参与登记。'},{status:500});
  }
}
