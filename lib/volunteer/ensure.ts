import { query } from '@/lib/db';

let ready:Promise<void>|null=null;

export function ensureVolunteerTaskSchema(){
  if(!ready) ready=(async()=>{
    await query(`
      CREATE TABLE IF NOT EXISTS volunteer_tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT NOT NULL UNIQUE,
        title_zh TEXT NOT NULL,
        title_eo TEXT,
        title_en TEXT,
        description_zh TEXT NOT NULL,
        description_eo TEXT,
        description_en TEXT,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL DEFAULT 'starter',
        status TEXT NOT NULL DEFAULT 'open',
        max_claims INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT volunteer_tasks_status_ck CHECK (status IN ('open','paused','closed')),
        CONSTRAINT volunteer_tasks_difficulty_ck CHECK (difficulty IN ('starter','intermediate','advanced')),
        CONSTRAINT volunteer_tasks_max_claims_ck CHECK (max_claims >= 1)
      )
    `);
    await query(`
      CREATE TABLE IF NOT EXISTS volunteer_task_assignments (
        task_id UUID NOT NULL REFERENCES volunteer_tasks(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'claimed',
        claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        result_url TEXT,
        result_note TEXT,
        completed_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (task_id,user_id),
        CONSTRAINT volunteer_task_assignments_status_ck CHECK (status IN ('claimed','completed','withdrawn'))
      )
    `);
    await query(`CREATE INDEX IF NOT EXISTS volunteer_task_assignments_user_idx ON volunteer_task_assignments(user_id,status,updated_at DESC)`);
    await query(`ALTER TABLE volunteer_task_assignments ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'pending'`);
    await query(`ALTER TABLE volunteer_task_assignments ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL`);
    await query(`ALTER TABLE volunteer_task_assignments ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ`);
    await query(`ALTER TABLE volunteer_task_assignments ADD COLUMN IF NOT EXISTS review_note TEXT`);
    await query(`
      DO $volunteer$
      BEGIN
        ALTER TABLE volunteer_task_assignments
          ADD CONSTRAINT volunteer_task_assignments_review_status_ck
          CHECK (review_status IN ('pending','approved','rejected'));
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END
      $volunteer$
    `);
    await query(`CREATE INDEX IF NOT EXISTS volunteer_task_assignments_review_idx ON volunteer_task_assignments(review_status,completed_at DESC) WHERE status='completed'`);

    const rows=[
      ['VOL-EO-001','校对一篇汉—世界语双语文章','Revizii unu ĉina–Esperantan artikolon','Proofread one Chinese–Esperanto article','检查世界语语法、自然度与术语一致性，并记录需要修改的地方。','Kontrolu gramatikon, naturecon kaj terminologian konsekvencon de Esperanto kaj registru proponitajn ŝanĝojn.','Check Esperanto grammar, naturalness and terminology consistency and record proposed changes.','proofreading','starter',3],
      ['VOL-MUS-001','整理一件数字博物馆藏品资料','Ordigi unu ciferecan muzean dosieron','Organize one digital museum collection record','依据现有图片或文字，整理外观、尺寸、来源备注与“文玩赏玩”说明，不作未经证实的鉴定。','Laŭ disponeblaj bildoj aŭ tekstoj, ordigu aspekton, dimensiojn, devenajn notojn kaj kultur-ĝuan priskribon sen nekonfirmita aŭtentikigo.','Using existing images or text, organize appearance, dimensions, provenance notes and cultural-appreciation wording without unverified authentication.','museum_documentation','starter',3],
      ['VOL-WEB-001','测试一个 Web4 页面','Testi unu Web4-paĝon','Test one Web4 page','用电脑或手机检查页面能否打开、文字是否完整、按钮是否清楚，并记录发现的问题。','Per komputilo aŭ telefono kontrolu ĉu la paĝo malfermiĝas, ĉu teksto estas kompleta kaj ĉu butonoj estas klaraj; registru problemojn.','On desktop or mobile, check that the page opens, text is complete and buttons are clear, then record issues.','website_testing','starter',5],
      ['VOL-MEDIA-001','整理一集视频字幕','Ordigi subtitolojn por unu epizodo','Prepare subtitles for one episode','检查中文与世界语字幕的对应、断句与口播可读性。','Kontrolu kongruon inter ĉinaj kaj Esperantaj subtitoloj, segmentadon kaj legeblecon por parolado.','Check alignment, segmentation and spoken readability of Chinese and Esperanto subtitles.','media_subtitles','starter',3],
      ['VOL-DAD-001','检查一条 DAD 公共档案记录','Kontroli unu publikan DAD-arkivan registron','Review one DAD public archive record','检查标题、状态、时间与公开说明是否一致；只检查公开信息，不接触私人投票或非公开讨论。','Kontrolu ĉu titolo, stato, tempo kaj publika klarigo kongruas; laboru nur kun publikaj informoj, ne privataj voĉoj aŭ nepublikaj diskutoj.','Check title, status, time and public description for consistency; use only public information, never private ballots or non-public discussion.','dad_archiving','starter',3]
    ] as const;
    for(const row of rows){
      await query(`
        INSERT INTO volunteer_tasks(code,title_zh,title_eo,title_en,description_zh,description_eo,description_en,category,difficulty,max_claims)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT(code) DO NOTHING
      `,[...row]);
    }
  })().catch(error=>{ready=null;throw error});
  return ready;
}
