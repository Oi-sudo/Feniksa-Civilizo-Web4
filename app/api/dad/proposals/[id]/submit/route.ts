import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasRole,ROLE } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';

const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(_req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const user=await getCurrentUser();
  if(!user)return NextResponse.json({error:'请先登录。'},{status:401});
  const {id}=await params;
  if(!UUID_RE.test(id))return NextResponse.json({error:'提案编号无效。'},{status:400});

  try{
    const result=await withTransaction(async client=>{
      const q=await client.query<{author_id:string|null;status:string;title:string;short_code:string|null}>(
        `SELECT author_id,status::text,title,short_code FROM proposals WHERE id=$1 FOR UPDATE`,[id]
      );
      const p=q.rows[0];
      if(!p)throw new Error('NOT_FOUND');
      if(p.status!=='draft')throw new Error('BAD_STATUS');
      const isAuthor=p.author_id===user.id;
      const isAdmin=hasRole(user,ROLE.ADMIN);
      if(!isAuthor&&!isAdmin)throw new Error('FORBIDDEN');

      await client.query(
        `UPDATE proposals
            SET status='discussion',
                discussion_start=COALESCE(discussion_start,NOW()),
                last_submitted_at=NOW(),
                revision_reason=NULL
          WHERE id=$1`,[id]
      );
      await client.query(
        `INSERT INTO proposal_status_events(proposal_id,from_status,to_status,actor_id,note)
         VALUES($1,'draft','discussion',$2,'Submitted for public discussion')`,
        [id,user.id]
      );
      await client.query(
        `INSERT INTO audit_logs(user_id,action,entity_type,entity_id,old_value,new_value)
         VALUES($1,'dad.proposal.submit_discussion','proposal',$2,$3::jsonb,$4::jsonb)`,
        [user.id,id,JSON.stringify({status:'draft'}),JSON.stringify({status:'discussion',shortCode:p.short_code,title:p.title})]
      );
      return {shortCode:p.short_code};
    });
    return NextResponse.json({ok:true,status:'discussion',...result});
  }catch(e){
    if(e instanceof Error&&e.message==='NOT_FOUND')return NextResponse.json({error:'未找到该提案。'},{status:404});
    if(e instanceof Error&&e.message==='BAD_STATUS')return NextResponse.json({error:'只有草案状态可以提交公开讨论。'},{status:409});
    if(e instanceof Error&&e.message==='FORBIDDEN')return NextResponse.json({error:'只有提案作者或管理员可以执行此操作。'},{status:403});
    console.error(e);
    return NextResponse.json({error:'暂时无法提交公开讨论。'},{status:500});
  }
}
