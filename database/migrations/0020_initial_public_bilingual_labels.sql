-- Task 20: bilingual exhibition summaries for the initial public four-hall archive.
-- These are Web4 0.1 exhibition summaries derived from the frozen public compilation, not new authentication findings.

CREATE TEMP TABLE initial_public_labels(
  permanent_code TEXT,
  zh_label TEXT,
  zh_text TEXT,
  eo_label TEXT,
  eo_text TEXT
) ON COMMIT DROP;

INSERT INTO initial_public_labels VALUES
('FC-PUB-B08',
 '世界语教学与顾问证据线',
 '本档案组保存与世界语教学及后续顾问联系有关的证明函、书面往来与旁证资料，用于呈现一段从课堂教学延续到长期语言服务的经历。其公开展示重点在文献证据链，而非扩大原文未能证明的事实。',
 'Esperanta instruado kaj konsila dokumentaro',
 'Ĉi tiu dosiero konservas atestajn leterojn, korespondadon kaj rilatajn dokumentojn pri Esperanto-instruado kaj posta konsila kontakto. La publika prezento emfazas la dokumentan pruvĉenon kaj ne etendas la konkludojn preter tio, kion la fontoj subtenas.'),

('FC-PUB-B05',
 '世界语题词与存录线索',
 '本页保存一份世界语文化题词及其后续存录线索，重点在前辈鼓励、纸本文献保存与传播历史。题词作者、年代与馆藏关系以原始文件和后续核验资料为准。',
 'Esperanta dediĉaĵo kaj arkiva spuro',
 'Ĉi tiu paĝo konservas Esperantan kulturan dediĉaĵon kaj postajn arkivajn spurojn. La fokuso estas la historia rilato inter kuraĝigo, papera dokumento kaj konservado; aŭtoreco, dato kaj muzeaj rilatoj sekvas la originajn dokumentojn kaj postan kontrolon.'),

('FC-PUB-B02',
 '世界语佛经翻译与弘法档案',
 '本档案组连接世界语学习、佛典翻译与长期修学愿心，保存译稿目录、修订记录与相关工作痕迹。它记录的是翻译实践与文化传播过程，不以档案本身认证宗教修证境界。',
 'Arkivo pri Esperanta tradukado de budhismaj tekstoj',
 'Ĉi tiu dosiero ligas lernadon de Esperanto, tradukadon de budhismaj tekstoj kaj longdaŭran praktikaspiron. Ĝi konservas listojn de tradukoj, reviziajn spurojn kaj laborajn dokumentojn, sen prezenti ilin kiel ateston pri spirita rango.'),

('FC-PUB-B15',
 '国际世界语交流影像',
 '本档案保存国际世界语交流活动中的合影及相关刊物发表线索，用于记录世界语如何进入跨国友谊、家庭同行与公共交流。具体活动名称、日期与原刊信息仍以原始资料核验为准。',
 'Bildarkivo de internacia Esperanta interŝanĝo',
 'La dosiero konservas grupfoton el internacia Esperanta interŝanĝo kaj spurojn pri ebla publikigo en periodaĵo. Ĝi dokumentas translandan amikecon kaj komunan partoprenon; precizaj evento-nomo, dato kaj publikaĵfonto restas submetitaj al fonta kontrolo.'),

('FC-PUB-B11',
 '皈依与寺院书证',
 '本档案组保存皈依证、手书字样及寺院信笺等材料，用于呈现个人佛法修学历程中的书面法缘。其意义在于文献留痕，不将私人宗教经验转化为对他人的认证标准。',
 'Rifuĝa kaj monaĥeja dokumentaro',
 'Ĉi tiu dosiero konservas rifuĝan atestilon, manskribajn notojn kaj monaĥejan korespondadon kiel dokumentajn spurojn de persona budhisma praktikvojo. Ĝi registras fontojn sen transformi privatan religian sperton en normon por aliaj.'),

('FC-PUB-B03',
 '居士菩萨戒牒',
 '本页保存居士菩萨戒牒及相关书证，作为受戒经历的个人档案。公开展示仅说明文献及其修学背景，不据此评价任何人的修证层级。',
 'Laika bodisatva precepta dokumento',
 'Ĉi tiu paĝo konservas laikan bodisatvan preceptan dokumenton kiel personan arkivan ateston pri ricevado de preceptoj. La publika prezento montras la dokumenton kaj ĝian praktikan kuntekston sen taksi spiritan rangon.'),

('FC-PUB-B10',
 '五台山寺院手写信笺',
 '这份手写信笺作为修学往来中的纸本文献保存，呈现寺院交流中的人情温度与书面痕迹。其人物、日期与具体背景以原件和后续档案为准。',
 'Manskribita letero el monaĥeja rilato',
 'La manskribita letero estas konservata kiel papera spuro de budhisma interrilato kaj monaĥeja korespondado. Personoj, dato kaj preciza kunteksto sekvas la originalon kaj postan arkivan kontrolon.'),

('FC-PUB-B06',
 '贝叶经装古写本',
 '本件以“贝叶经装古写本”作为馆藏登记名称，重点展示其经卷形制、装帧与佛教文献文化意义。年代、文字系统、地域来源及材质仍需原始图像、文献与专业研究进一步核定。',
 'Palmfolia-stila malnova manuskripto',
 'La objekto estas registrita kiel malnova manuskripto en palmfolia stilo kaj estas prezentata pro sia formo, bindado kaj budhisma dokumenta signifo. Dato, skribsistemo, regiona deveno kaj materialo ankoraŭ bezonas plian fontan kaj fakan esploradon.'),

('FC-PUB-B12',
 '2020年居家小佛堂',
 '本影像档案记录居家佛堂的空间布置与日常修学环境，呈现佛法如何进入普通生活空间。它属于生活史与修学史记录，不作为寺院、机构或宗教资格认证。',
 'Hejma budhisma altaro en 2020',
 'La bildarkivo dokumentas hejman budhisman altaron kaj ĉiutagan praktikan medion, montrante kiel budhisma praktiko eniras ordinaran vivspacon. Ĝi estas viv- kaj praktik-historia registro, ne institucia aŭ religia akredito.'),

('FC-PUB-B13',
 '巴黎和平祈祷与祭祖法会影像',
 '本照片组保存巴黎相关和平祈祷、祭祖与法会活动的现场影像，用于记录个人修学如何进入公共和平与纪念场域。活动名称、主办关系与日期以原始活动资料为准。',
 'Bildoj pri pacpreĝo kaj memora ceremonio en Parizo',
 'La fotoj konservas surlokajn bildojn de pacpreĝo, memora ceremonio kaj budhisma evento en Parizo. Ili dokumentas partoprenon en publika paca kaj memora medio; evento-nomo, organizaj rilatoj kaj dato sekvas la originajn eventajn fontojn.'),

('FC-PUB-B01',
 '妙音凤归扇',
 '本件以“妙音凤归扇”为公开馆藏名，结合扇面实物、证书、封套及图录线索形成档案组。其年代、工艺归属与历史来源应继续依据实物、证书与专业研究分别核定。',
 'La ventumilo “Miaoyin Fenikso Revenas”',
 'La objekto estas publike registrita kiel la ventumilo “Miaoyin Fenikso Revenas”, kun dosiero konsistanta el la objekto mem, atestilo, kovrilo kaj katalogaj spuroj. Dato, tekniko kaj historia deveno devas esti aparte kontrolataj per objekta kaj faka esplorado.'),

('FC-PUB-B04',
 '桃花园里可耕田？',
 '这是一页凤凰文明愿景文献，以“桃花园里可耕田？”提出数字文明时代如何继续耕心、学习、互助与共同生活的问题。它属于未来构想与公共讨论文本，不是已经建成项目的事实说明。',
 'Ĉu eblas kultivi kampon en la Persikflora Ĝardeno?',
 'Ĉi tiu vizia dokumento de Feniksa Civilizo demandas kiel en cifereca epoko oni povas plu kultivi menson, lernadon, reciprokan helpon kaj komunan vivon. Ĝi estas teksto por estonta konceptado kaj publika diskuto, ne priskribo de jam finita projekto.');

INSERT INTO asset_exhibition_texts(asset_id,locale,short_label,exhibition_text,status,version)
SELECT a.id,'zh',l.zh_label,l.zh_text,'published','web4-0.1'
FROM initial_public_labels l JOIN cultural_assets a ON a.permanent_code=l.permanent_code
ON CONFLICT(asset_id,locale,version) DO NOTHING;

INSERT INTO asset_exhibition_texts(asset_id,locale,short_label,exhibition_text,status,version)
SELECT a.id,'eo',l.eo_label,l.eo_text,'published','web4-0.1'
FROM initial_public_labels l JOIN cultural_assets a ON a.permanent_code=l.permanent_code
ON CONFLICT(asset_id,locale,version) DO NOTHING;
