-- Import selected frozen records from the Phoenix Web initial public four-hall compilation.
-- Titles are catalog labels and do not themselves establish authentication, dating, provenance or valuation.

ALTER TABLE cultural_assets ADD COLUMN IF NOT EXISTS related_display_note TEXT;

CREATE TEMP TABLE initial_public_import(
  permanent_code TEXT,
  catalog_code TEXT,
  title_zh TEXT,
  hall_code TEXT,
  category TEXT
) ON COMMIT DROP;

INSERT INTO initial_public_import VALUES
('FC-PUB-B08','B08','合肥工业大学世界语教学与顾问证明函组','SE_ESPERANTO','世界语教学文献'),
('FC-PUB-B05','B05','世界语题词文献及博物馆存录线索','SE_ESPERANTO','世界语历史文献'),
('FC-PUB-B02','B02','世界语佛经翻译与弘法档案组','SE_ESPERANTO','世界语与佛经翻译档案'),
('FC-PUB-B15','B15','国际友谊和平世界语大会合影及刊物发表线索','SE_ESPERANTO','世界语国际交流影像档案'),
('FC-PUB-B11','B11','皈依证、手书“传”字与寺院信笺','NE_BUD','佛法修学文献'),
('FC-PUB-B03','B03','居士菩萨戒牒','NE_BUD','佛法修学文献'),
('FC-PUB-B10','B10','五台山寺院手写信笺','NE_BUD','佛法修学文献'),
('FC-PUB-B06','B06','贝叶经装古写本','NE_BUD','佛教文献'),
('FC-PUB-B12','B12','2020年居家小佛堂影像档案','NE_BUD','佛法修学影像档案'),
('FC-PUB-B13','B13','2019年巴黎和平祈祷与祭祖法会照片组','NE_BUD','公共和平愿行影像档案'),
('FC-PUB-B01','B01','妙音凤归扇','W_GIFTS','礼物与藏品'),
('FC-PUB-B04','B04','桃花园里可耕田？','S_PHOENIX','凤凰文明愿景文献');

INSERT INTO cultural_assets(
  permanent_code,catalog_code,catalog_volume,catalog_source_note,batch_code,title_zh,primary_hall_id,category,
  ownership_status,authentication_level,valuation_status,digital_rights_status,public_status,workflow_status,published_at
)
SELECT i.permanent_code,i.catalog_code,'凤凰网初编公开版',
       '来源：《凤凰网初编本（公开版）四馆首批重点页总合稿》。登记标题用于数字档案编目，不替代专业鉴定、年代确认、版权核定或市场估值。',
       '初编公开版',i.title_zh,h.id,i.category,
       'private','D','not_valued','pending','published','published',NOW()
FROM initial_public_import i
JOIN museum_halls h ON h.code=i.hall_code
ON CONFLICT(permanent_code) DO UPDATE SET
 catalog_code=COALESCE(cultural_assets.catalog_code,EXCLUDED.catalog_code),
 catalog_volume=COALESCE(cultural_assets.catalog_volume,EXCLUDED.catalog_volume),
 catalog_source_note=COALESCE(cultural_assets.catalog_source_note,EXCLUDED.catalog_source_note);

UPDATE cultural_assets SET related_display_note='初编同时设有礼物与藏品馆双归页；Web4 仅计一个主馆籍，关联展示不重复计数。'
WHERE permanent_code='FC-PUB-B06';

INSERT INTO asset_versions(asset_id,version_number,change_summary,snapshot)
SELECT id,'public-book-import-0.1','Imported from initial public four-hall compilation',
 jsonb_build_object('catalog_code',catalog_code,'catalog_volume',catalog_volume,'title_zh',title_zh,'primary_hall_id',primary_hall_id,'category',category)
FROM cultural_assets WHERE catalog_volume='凤凰网初编公开版'
ON CONFLICT(asset_id,version_number) DO NOTHING;
