-- Task 08 representative course catalog seed.
-- Catalog entries are educational metadata; actual lesson content is imported separately.

INSERT INTO courses (slug,title_zh,title_eo,title_en,description_zh,description_eo,description_en,category,level,version,publication_status,access_level,featured_order,estimated_lessons,content_status,learning_objectives_zh,learning_objectives_eo,learning_objectives_en) VALUES
('esperanto-40-900','世界语40课900句','Esperanto: 40 Lecionoj kaj 900 Frazoj','Esperanto: 40 Lessons and 900 Sentences','面向系统学习世界语的长期课程框架，以分课、例句和实际使用为主。','Longdaŭra kurso por sistema lernado de Esperanto per lecionoj, frazoj kaj praktika uzo.','A structured long-form Esperanto course centered on lessons, model sentences and practical use.','esperanto','foundation','0.1','published','public',1,40,'outline','建立稳定的基础语法、常用表达、阅读与口语使用能力。','Konstrui stabilan bazon en gramatiko, oftaj esprimoj, legado kaj parolado.','Build a stable foundation in grammar, common expressions, reading and speaking.'),
('zagreb-method-12','萨格勒布教学法12课','Zagreba Metodo · 12 Lecionoj','Zagreb Method · 12 Lessons','以短课、重复、高频结构和主动表达为核心的世界语入门课程。','Enkonduka Esperanto-kurso bazita sur mallongaj lecionoj, ripeto, oftaj strukturoj kaj aktiva esprimado.','An introductory Esperanto course built around short lessons, repetition, high-frequency structures and active expression.','esperanto','foundation','0.1','published','public',2,12,'outline','快速建立基本理解与主动表达能力。','Rapide konstrui bazan komprenon kaj aktivan esprimkapablon.','Rapidly build basic comprehension and active expression.'),
('six-yao-esperanto-dialogues','凤凰六爻世界语问答课程','Feniksa Ses-Linia Esperanto-Dialogaro','Phoenix Six-Yao Esperanto Dialogues','通过问答、字幕和日常主题，把世界语表达与六爻反思训练结合。','Per demandoj, respondoj, subtitoloj kaj ĉiutagaj temoj, la kurso kunligas Esperanton kun ses-linia reflektado.','A dialogue-based course combining Esperanto expression with Six-Yao reflective practice.','esperanto','intermediate','0.1','published','public',3,108,'partial','训练自然问答、倾听、表达与主题词汇。','Ekzerci naturan demandadon, aŭskultadon, esprimadon kaj teman vortprovizon.','Practice natural Q&A, listening, expression and thematic vocabulary.'),
('controlled-esperanto-0-1','受控世界语明典 REAI 0.1','Kontrolita Esperanto · REAI 0.1','Controlled Esperanto · REAI 0.1','面向受控表达、术语一致性、翻译与AI协作的高级学习入口。','Altnivela enirejo por kontrolita esprimado, terminologia konsekvenco, tradukado kaj kunlaboro kun AI.','An advanced entry point for controlled expression, terminological consistency, translation and AI-assisted work.','esperanto','advanced','0.1','published','registered',4,100,'partial','理解受控语言原则，并能在翻译、教学和知识库中保持术语一致。','Kompreni principojn de kontrolita lingvo kaj konservi terminologian konsekvencon en tradukado, instruado kaj sciobazoj.','Understand controlled-language principles and maintain terminology consistency across translation, teaching and knowledge bases.'),
('controlled-buddhist-translation','受控佛经翻译学习课程','Kurso pri Kontrolita Budhisma Tradukado','Controlled Buddhist Translation Course','学习如何区分原文、术语、句法、解释层与冻结版本，并进行汉—世界语受控翻译。','Lerni distingi fontotekston, terminojn, sintakson, interpretajn tavolojn kaj frostigitajn versiojn en ĉina–Esperanta budhisma tradukado.','Learn to distinguish source text, terminology, syntax, interpretive layers and frozen versions in controlled Chinese–Esperanto Buddhist translation.','buddhist_study','advanced','0.1','published','registered',5,26,'outline','掌握可追溯、跨经一致、可审校的受控翻译工作流。','Majstri spureblan, intersutran kaj revizieblan kontrolitan tradukfluuon.','Master a traceable, cross-text consistent and reviewable controlled-translation workflow.'),
('six-yao-practice-144','六爻转识成慧双语实修课程','Ses-Linia Praktika Kurso: De Konscio al Saĝo','Six-Yao Practice Course: From Consciousness to Wisdom','以觉醒、无我、开悟、愿行、菩萨愿行与大同共行识为六条学习与实践路径。','Ses lernaj kaj praktikaj vojoj: vekiĝo, senmemo, kompreno, vola agado, bodisatva agado kaj komuna mondo.','Six learning and practice paths: awakening, non-self, insight, vow-action, bodhisattva action and common-world action.','six_yao','multi-level','0.1','published','public',6,144,'partial','把理解转化为观察、倾听、行动、服务与长期共同建设。','Transformi komprenon en observadon, aŭskultadon, agadon, servadon kaj longdaŭran kunlaboron.','Turn understanding into observation, listening, action, service and long-term common work.')
ON CONFLICT (slug) DO UPDATE SET
 title_zh=EXCLUDED.title_zh,title_eo=EXCLUDED.title_eo,title_en=EXCLUDED.title_en,
 description_zh=EXCLUDED.description_zh,description_eo=EXCLUDED.description_eo,description_en=EXCLUDED.description_en,
 category=EXCLUDED.category,level=EXCLUDED.level,version=EXCLUDED.version,publication_status=EXCLUDED.publication_status,access_level=EXCLUDED.access_level,
 featured_order=EXCLUDED.featured_order,estimated_lessons=EXCLUDED.estimated_lessons,content_status=EXCLUDED.content_status,
 learning_objectives_zh=EXCLUDED.learning_objectives_zh,learning_objectives_eo=EXCLUDED.learning_objectives_eo,learning_objectives_en=EXCLUDED.learning_objectives_en;

-- One public orientation lesson per representative course.
INSERT INTO lessons (course_id, lesson_number, title_zh, title_eo, title_en, content_zh, content_eo, content_en, status)
SELECT id, 1,
  CASE slug
   WHEN 'esperanto-40-900' THEN '课程导言：怎样使用40课900句'
   WHEN 'zagreb-method-12' THEN '课程导言：短课与主动表达'
   WHEN 'six-yao-esperanto-dialogues' THEN '课程导言：问答、倾听与表达'
   WHEN 'controlled-esperanto-0-1' THEN '课程导言：什么是受控世界语'
   WHEN 'controlled-buddhist-translation' THEN '课程导言：原文、译文与解释层'
   ELSE '课程导言：六爻是学习与实践路径' END,
  CASE slug
   WHEN 'esperanto-40-900' THEN 'Enkonduko: Kiel uzi la 40 lecionojn kaj 900 frazojn'
   WHEN 'zagreb-method-12' THEN 'Enkonduko: Mallongaj lecionoj kaj aktiva esprimado'
   WHEN 'six-yao-esperanto-dialogues' THEN 'Enkonduko: Demandoj, aŭskultado kaj esprimado'
   WHEN 'controlled-esperanto-0-1' THEN 'Enkonduko: Kio estas Kontrolita Esperanto?'
   WHEN 'controlled-buddhist-translation' THEN 'Enkonduko: Fontoteksto, traduko kaj interpreto'
   ELSE 'Enkonduko: Ses linioj kiel lernaj kaj praktikaj vojoj' END,
  CASE slug
   WHEN 'esperanto-40-900' THEN 'Orientation: How to use the 40 lessons and 900 sentences'
   WHEN 'zagreb-method-12' THEN 'Orientation: Short lessons and active expression'
   WHEN 'six-yao-esperanto-dialogues' THEN 'Orientation: Questions, listening and expression'
   WHEN 'controlled-esperanto-0-1' THEN 'Orientation: What is Controlled Esperanto?'
   WHEN 'controlled-buddhist-translation' THEN 'Orientation: Source text, translation and interpretation'
   ELSE 'Orientation: Six Yao as learning and practice paths' END,
  '本页是课程目录与学习入口。完整教材按版本与审核状态分批导入；未导入部分不会由系统自动冒充正式课程正文。',
  'Ĉi tiu paĝo estas la kursa katalogo kaj lerna enirejo. La plena materialo estos importata laŭ versioj kaj revizia stato; mankantaj partoj ne estos aŭtomate prezentataj kiel oficiala kursa teksto.',
  'This page is the course catalog and learning entry point. Full materials are imported by version and review status; missing material is never auto-presented as official course text.',
  'published'::publication_status
FROM courses c
WHERE c.slug IN ('esperanto-40-900','zagreb-method-12','six-yao-esperanto-dialogues','controlled-esperanto-0-1','controlled-buddhist-translation','six-yao-practice-144')
ON CONFLICT (course_id, lesson_number) DO NOTHING;
