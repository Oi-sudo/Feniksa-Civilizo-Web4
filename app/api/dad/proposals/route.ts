import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasRole,ROLE } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';

const CURRENCIES=new Set(['EUR','USD','CNY']);

export async function POST(req:NextRequest){
  const user=await getCurrentUser();
  if(!user)return NextResponse.json({error:'请先登录。'},{status:401});
  if(!hasRole(user,ROLE.MEMBER))return NextResponse.json({error:'需要成员权限。'},{status:403});
  try{
    const body=await req.json();
    const title=String(body.title||'').trim();
    const problem=String(body.problemStatement||'').trim();
    const solution=String(body.proposedSolution||'').trim();
    const publicValue=String(body.publicValue||'').trim()||null;
    const risk=String(body.riskDescription||'').trim()||null;
    const currency=String(body.currency||'EUR').toUpperCase();
    const budget=Number(body.budgetRequested||0);

    if(title.length<4||title.length>160)return NextResponse.json({error:'提案标题需为4—160个字符。'},{status:400});
    if(problem.length<20||problem.length>5000)return NextResponse.json({error:'问题陈述需为20—5000个字符。'},{status:400});
    if(solution.length<20||solution.length>8000)return NextResponse.json({error:'建议方案需为20—8000个字符。'},{status:400});
    if(publicValue&&publicValue.length>4000)return NextResponse.json({error:'公共价值说明过长。'},{status:400});
    if(risk&&risk.length>4000)return NextResponse.json({error:'风险说明过长。'},{status:400});
    if(!CURRENCIES.has(currency))return NextResponse.json({error:'币种无效。'},{status:400});
    if(!Number.isFinite(budget)||budget<0||budget>999999999999)return NextResponse.json({error:'申请预算无效。'},{status:400});

    const created=await withTransaction(async client=>{
      const r=await client.query<{id:string}>(
        `INSERT INTO proposals(title,author_id,problem_statement,proposed_solution,budget_requested,currency,public_value,risk_description,status)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,'draft') RETURNING id`,
        [title,user.id,problem,solution,budget,currency,publicValue,risk]
      );
      const id=r.rows[0].id;
      const short=await client.query<{short_code:string}>(`
        UPDATE proposals
        SET short_code='DAD-'||upper(substr(replace(id::text,'-',''),1,8))
        WHERE id=$1
        RETURNING short_code`,[id]);
      await client.query(
        `INSERT INTO proposal_status_events(proposal_id,from_status,to_status,actor_id,note)
         VALUES($1,NULL,'draft',$2,'Proposal draft created')`,
        [id,user.id]
      );
      await client.query(
        `INSERT INTO proposal_revisions(proposal_id,revision_number,editor_id,snapshot,change_summary)
         VALUES($1,1,$2,$3::jsonb,'Initial draft')`,
        [id,user.id,JSON.stringify({title,problem_statement:problem,proposed_solution:solution,budget_requested:budget,currency,public_value:publicValue,risk_description:risk,status:'draft'})]
      );
      await client.query(
        `INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
         VALUES($1,'dad.proposal.create','proposal',$2,$3::jsonb)`,
        [user.id,id,JSON.stringify({shortCode:short.rows[0].short_code,status:'draft',title})]
      );
      return {id,shortCode:short.rows[0].short_code};
    });

    return NextResponse.json({ok:true,...created},{status:201});
  }catch(e){
    console.error(e);
    return NextResponse.json({error:'暂时无法建立提案草案。'},{status:500});
  }
}
