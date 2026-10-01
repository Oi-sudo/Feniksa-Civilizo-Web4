import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';

export async function POST(req:NextRequest){
  const eo=(await getLocale())==='eo';
  const user=await getCurrentUser();
  if(!user)return NextResponse.json({error:eo?'Bonvolu unue ensaluti.':'请先登录。'},{status:401});
  try{
    const body=await req.json();
    if(typeof body.lessonId!=='string')return NextResponse.json({error:eo?'La kursleciono estas nevalida.':'课程章节无效。'},{status:400});

    const result=await withTransaction(async client=>{
      const lessonResult=await client.query<{
        lesson_id:string;course_id:string;course_title:string;content_status:string
      }>(
        `SELECT l.id AS lesson_id,c.id AS course_id,c.title_zh AS course_title,c.content_status
           FROM lessons l JOIN courses c ON c.id=l.course_id
          WHERE l.id=$1 AND l.status='published' AND c.publication_status='published'
          FOR UPDATE`,[body.lessonId]);
      if(!lessonResult.rowCount)throw new Error('NOT_FOUND');
      const lesson=lessonResult.rows[0];

      await client.query(
        `INSERT INTO learning_progress(user_id,course_id,lesson_id,status,progress_percent,started_at,completed_at)
         VALUES($1,$2,$3,'completed',100,NOW(),NOW())
         ON CONFLICT(user_id,course_id,lesson_id) DO UPDATE SET
           status='completed',progress_percent=100,started_at=COALESCE(learning_progress.started_at,NOW()),
           completed_at=COALESCE(learning_progress.completed_at,NOW()),updated_at=NOW()`,
        [user.id,lesson.course_id,lesson.lesson_id]
      );

      const counts=await client.query<{published:string;completed:string}>(
        `SELECT
           COUNT(*) FILTER(WHERE l.status='published')::text AS published,
           COUNT(*) FILTER(WHERE l.status='published' AND EXISTS(
             SELECT 1 FROM learning_progress lp
              WHERE lp.user_id=$1 AND lp.course_id=$2 AND lp.lesson_id=l.id AND lp.status='completed'
           ))::text AS completed
         FROM lessons l WHERE l.course_id=$2`,[user.id,lesson.course_id]);
      const published=Number(counts.rows[0]?.published||0);
      const completed=Number(counts.rows[0]?.completed||0);
      const courseCompleted=lesson.content_status==='complete' && published>0 && published===completed;
      let estValue=0;

      if(courseCompleted){
        const rule=await client.query<{value:string;rule_version:string}>(
          `SELECT value::text,rule_version FROM est_rules
            WHERE activity_type='course_completion'
              AND effective_from<=NOW() AND (effective_to IS NULL OR effective_to>NOW())
            ORDER BY effective_from DESC LIMIT 1`);
        if(rule.rowCount){
          estValue=Number(rule.rows[0].value);
          await client.query(
            `INSERT INTO est_records(user_id,activity_type,course_id,description,est_value,rule_version,review_status,reviewed_at)
             VALUES($1,'course_completion',$2,$3,$4,$5,'approved',NOW())
             ON CONFLICT DO NOTHING`,
            [user.id,lesson.course_id,eo?`Kompletigita plene publikigita kurso: ${lesson.course_title}`:`完成已完整发布课程：${lesson.course_title}`,estValue,rule.rows[0].rule_version]
          );
        }
      }
      return {courseCompleted,estValue,published,completed};
    });

    return NextResponse.json({ok:true,...result});
  }catch(error){
    if(error instanceof Error&&error.message==='NOT_FOUND')return NextResponse.json({error:eo?'La publikigita kursleciono ne estis trovita.':'找不到已发布的课程章节。'},{status:404});
    console.error(error);
    return NextResponse.json({error:eo?'Provizore ne eblas konservi la lernoprogreson.':'暂时无法保存学习进度。'},{status:500});
  }
}
