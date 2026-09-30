-- Task 18: import frozen museum catalog registers into the Web4 public catalog layer.
-- Sources: 第二批第一册30件九宫分类版 + 第三册30件藏品登记册九宫分类版.
-- Catalog titles preserve collector/registry naming. They are not scientific authentication conclusions.

ALTER TABLE cultural_assets ADD COLUMN IF NOT EXISTS catalog_code TEXT;
ALTER TABLE cultural_assets ADD COLUMN IF NOT EXISTS catalog_volume TEXT;
ALTER TABLE cultural_assets ADD COLUMN IF NOT EXISTS catalog_source_note TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS cultural_assets_catalog_code_uq ON cultural_assets(catalog_code) WHERE catalog_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS cultural_assets_catalog_volume_idx ON cultural_assets(catalog_volume,catalog_code);

CREATE TEMP TABLE import_catalog(
  permanent_code TEXT,
  catalog_code TEXT,
  catalog_volume TEXT,
  title_zh TEXT,
  hall_code TEXT
) ON COMMIT DROP;

INSERT INTO import_catalog(permanent_code,catalog_code,catalog_volume,title_zh,hall_code) VALUES
('FC-D2-01','D2-01','第二批第一册','元代铜雕掐丝珐琅彩香炉《天鸡高鸣》','S_PHOENIX'),
('FC-D2-02','D2-02','第二批第一册','五代柴窑绿度母鎏金宝石釉瓷器','NE_BUD'),
('FC-D2-03','D2-03','第二批第一册','1300 克青黄玉老寿星雕','E_WISDOM'),
('FC-D2-04','D2-04','第二批第一册','寿山石老黄寿星人物雕','E_WISDOM'),
('FC-D2-05','D2-05','第二批第一册','“世界之最锎陨石”','N_WEB4'),
('FC-D2-06','D2-06','第二批第一册','贺知章“金龟天官印玺”','SW_MUSEUM'),
('FC-D2-07','D2-07','第二批第一册','碳质微纳米红钻石蛋形陨石','NW_TECH'),
('FC-D2-08','D2-08','第二批第一册','灵神星碳质稀有金属锎微纳米钻石陨石','NW_TECH'),
('FC-D2-09','D2-09','第二批第一册','高碳微纳米钻石陨石','NW_TECH'),
('FC-D2-10','D2-10','第二批第一册','山海经期古青玉雕龙之九子貔貅','E_WISDOM'),
('FC-D2-11','D2-11','第二批第一册','五代柴窑天青釉一对貔貅','SW_MUSEUM'),
('FC-D2-12','D2-12','第二批第一册','碳质晶体无色透明灵空玻璃陨石','NW_TECH'),
('FC-D2-13','D2-13','第二批第一册','天然桃花源画面玉石','S_PHOENIX'),
('FC-D2-14','D2-14','第二批第一册','海蓝色玻璃陨石','NW_TECH'),
('FC-D2-15','D2-15','第二批第一册','古黄玉雕件·唐人吹笛','SE_ESPERANTO'),
('FC-D2-16','D2-16','第二批第一册','灵神星稀有贵金属黄金钻石陨石','NW_TECH'),
('FC-D2-17','D2-17','第二批第一册','象形大雄猫碳质无球璃陨石','E_WISDOM'),
('FC-D2-18','D2-18','第二批第一册','鹤顶红玻璃陨石','E_WISDOM'),
('FC-D2-19','D2-19','第二批第一册','南红玛瑙心形天然美女舞纹饰品','W_GIFTS'),
('FC-D2-20','D2-20','第二批第一册','七彩象形鹦鹉鸟玻璃陨石','SE_ESPERANTO'),
('FC-D2-21','D2-21','第二批第一册','灵神星带磁性的金属锎陨石','NW_TECH'),
('FC-D2-22','D2-22','第二批第一册','玉石鱼象形奇石','E_WISDOM'),
('FC-D2-23','D2-23','第二批第一册','有磁性的外太空人机合一身的球粒铁陨石','N_WEB4'),
('FC-D2-24','D2-24','第二批第一册','蓝莓火星虹光紫伽迦身微纳米钻石陨石','S_PHOENIX'),
('FC-D2-25','D2-25','第二批第一册','灵神星天然彩钻解陨石','NW_TECH'),
('FC-D2-26','D2-26','第二批第一册','罕见的月球绿色碳质球粒预石','NW_TECH'),
('FC-D2-27','D2-27','第二批第一册','枣红玻璃陨石','S_PHOENIX'),
('FC-D2-28','D2-28','第二批第一册','火星陨石','NW_TECH'),
('FC-D2-29','D2-29','第二批第一册','火星尹丁石陨石','S_PHOENIX'),
('FC-D2-30','D2-30','第二批第一册','金红玻璃陨石','S_PHOENIX'),
('FC-V3-01','第三册-01','第三册','五代柴窑手中佛头（青釉）','C_DHARMA'),
('FC-V3-02','第三册-02','第三册','蛋形月球陨石','NW_TECH'),
('FC-V3-03','第三册-03','第三册','灵神星纳米黑钻陨石','NW_TECH'),
('FC-V3-04','第三册-04','第三册','有磁性的颗粒稀有贵金属锎陨石','NW_TECH'),
('FC-V3-05','第三册-05','第三册','灵神星贵金属锎陨石','NW_TECH'),
('FC-V3-06','第三册-06','第三册','火星如意金箍棒','NW_TECH'),
('FC-V3-07','第三册-07','第三册','红土沉香《马到成功》大摆件雕','E_WISDOM'),
('FC-V3-08','第三册-08','第三册','元代仿官釉套白玫花鸟竹纹花觚（插花瓶）','SW_MUSEUM'),
('FC-V3-09','第三册-09','第三册','火星伊丁红陨石','NW_TECH'),
('FC-V3-10','第三册-10','第三册','古代青玉美人镂空雕','E_WISDOM'),
('FC-V3-11','第三册-11','第三册','清代珐琅彩开光《西厢记》纹将军罐','SW_MUSEUM'),
('FC-V3-12','第三册-12','第三册','灵神星贵金属金刚陨石','NW_TECH'),
('FC-V3-13','第三册-13','第三册','火星宝石红多彩高晶玻璃陨石','NW_TECH'),
('FC-V3-14','第三册-14','第三册','灵神星含磁性的纳米钻石陨石','NW_TECH'),
('FC-V3-15','第三册-15','第三册','灵神星微磁金属微纳米钻陨石','NW_TECH'),
('FC-V3-16','第三册-16','第三册','月球海蓝宝玻璃陨石','NW_TECH'),
('FC-V3-17','第三册-17','第三册','火星定向微磁黑纳米钻石陨石','NW_TECH'),
('FC-V3-18','第三册-18','第三册','灵神星微纳米黄金钻陨石','NW_TECH'),
('FC-V3-19','第三册-19','第三册','火星纳米钻石陨石','NW_TECH'),
('FC-V3-20','第三册-20','第三册','灵神星微纳米钻稀有贵金属锎陨石','NW_TECH'),
('FC-V3-21','第三册-21','第三册','宋钧蓝釉小罐','SW_MUSEUM'),
('FC-V3-22','第三册-22','第三册','灵神星稀有贵金属锎陨石','NW_TECH'),
('FC-V3-23','第三册-23','第三册','灵神星含微磁微纳米的哮天犬钻石陨石','NW_TECH'),
('FC-V3-24','第三册-24','第三册','灵神星磁性黑纳米钻石陨石','NW_TECH'),
('FC-V3-25','第三册-25','第三册','清老坑翡翠双柄福字云纹雕鼻烟壶','W_GIFTS'),
('FC-V3-26','第三册-26','第三册','圣元通宝古汉字铜母钱','SW_MUSEUM'),
('FC-V3-27','第三册-27','第三册','行云流光金凤尾玉石','S_PHOENIX'),
('FC-V3-28','第三册-28','第三册','清中期珐琅彩青花釉瓷碗','SW_MUSEUM'),
('FC-V3-29','第三册-29','第三册','灵神星稀有金属纳米钻石陨石','NW_TECH'),
('FC-V3-30','第三册-30','第三册','菩提凤眼项链佛珠','NE_BUD');

-- Reuse the already seeded porcelain-bowl record as 第三册-28 instead of duplicating it.
UPDATE cultural_assets
SET catalog_code='第三册-28',catalog_volume='第三册',
    catalog_source_note='来源：凤凰文明数字博物馆《第三册30件藏品登记册·九宫分类版》；登记名称不等于专业鉴定结论。',
    batch_code='第三册',
    primary_hall_id=(SELECT id FROM museum_halls WHERE code='SW_MUSEUM')
WHERE permanent_code='FC-MUS-0005' AND catalog_code IS NULL;

DELETE FROM import_catalog WHERE catalog_code='第三册-28';

INSERT INTO cultural_assets(
  permanent_code,catalog_code,catalog_volume,catalog_source_note,batch_code,title_zh,primary_hall_id,
  category,ownership_status,authentication_level,valuation_status,digital_rights_status,public_status,workflow_status,
  published_at
)
SELECT i.permanent_code,i.catalog_code,i.catalog_volume,
       CASE WHEN i.catalog_volume='第二批第一册'
         THEN '来源：凤凰文明数字博物馆《第二批第一册30件·九宫分类版》；藏家登记名及历史网络称谓原样保存，不作为年代、材质、元素成分或天体来源的独立科学鉴定结论。'
         ELSE '来源：凤凰文明数字博物馆《第三册30件藏品登记册·九宫分类版》；暂定名称与来源判断待后续专业鉴定或检测。'
       END,
       i.catalog_volume,i.title_zh,h.id,
       '数字博物馆藏品','private','D','not_valued','pending','published','published',NOW()
FROM import_catalog i
JOIN museum_halls h ON h.code=i.hall_code
ON CONFLICT(permanent_code) DO UPDATE SET
  catalog_code=COALESCE(cultural_assets.catalog_code,EXCLUDED.catalog_code),
  catalog_volume=COALESCE(cultural_assets.catalog_volume,EXCLUDED.catalog_volume),
  catalog_source_note=COALESCE(cultural_assets.catalog_source_note,EXCLUDED.catalog_source_note);

INSERT INTO asset_versions(asset_id,version_number,change_summary,snapshot)
SELECT a.id,'catalog-import-0.1','Imported from frozen museum catalog register',
       jsonb_build_object('catalog_code',a.catalog_code,'catalog_volume',a.catalog_volume,'title_zh',a.title_zh,
         'primary_hall_id',a.primary_hall_id,'authentication_level',a.authentication_level,
         'ownership_status',a.ownership_status,'valuation_status',a.valuation_status,
         'digital_rights_status',a.digital_rights_status)
FROM cultural_assets a
WHERE a.catalog_volume IN ('第二批第一册','第三册')
ON CONFLICT(asset_id,version_number) DO NOTHING;
