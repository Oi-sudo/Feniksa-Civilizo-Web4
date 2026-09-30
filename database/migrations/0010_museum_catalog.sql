-- Task 12 — museum catalog indexes and cautious representative seed records.

CREATE INDEX IF NOT EXISTS idx_assets_batch_code ON cultural_assets(batch_code);
CREATE INDEX IF NOT EXISTS idx_assets_title_zh_lower ON cultural_assets(lower(title_zh));
CREATE INDEX IF NOT EXISTS idx_assets_code_lower ON cultural_assets(lower(permanent_code));
CREATE INDEX IF NOT EXISTS idx_asset_media_primary ON asset_media(asset_id,is_primary,created_at);

WITH hall AS (SELECT id FROM museum_halls WHERE code='NE_BUD')
INSERT INTO cultural_assets(permanent_code,batch_code,title_zh,title_eo,title_en,primary_hall_id,category,material,period_description,ownership_status,authentication_level,valuation_status,digital_rights_status,public_status)
SELECT 'FC-MUS-0001','D1','佛教贝叶经','Budhisma palmfolia manuskripto','Buddhist palm-leaf manuscript',hall.id,'佛教文献','贝叶','登记资料：年代待专业核定','private','C','not_valued','authorized_noncommercial','published' FROM hall
ON CONFLICT (permanent_code) DO NOTHING;

WITH hall AS (SELECT id FROM museum_halls WHERE code='NW_TECH')
INSERT INTO cultural_assets(permanent_code,batch_code,title_zh,title_eo,title_en,primary_hall_id,category,material,period_description,ownership_status,authentication_level,valuation_status,digital_rights_status,public_status)
SELECT 'FC-MUS-0002','D1','1876年费城世博会银奖章','Arĝenta medalo de la Filadelfia Monda Ekspozicio de 1876','1876 Philadelphia Centennial Exhibition silver medal',hall.id,'世界博览会文献与器物','金属','登记名称；具体材质、年代与来源以档案证据为准','private','C','not_valued','authorized_noncommercial','published' FROM hall
ON CONFLICT (permanent_code) DO NOTHING;

WITH hall AS (SELECT id FROM museum_halls WHERE code='SE_ESPERANTO')
INSERT INTO cultural_assets(permanent_code,batch_code,title_zh,title_eo,title_en,primary_hall_id,category,material,period_description,ownership_status,authentication_level,valuation_status,digital_rights_status,public_status)
SELECT 'FC-MUS-0003','D1','1982世界语真丝邮票与首日封','Esperanta silka poŝtmarko kaj unuataga koverto de 1982','1982 Esperanto silk stamp and first-day cover',hall.id,'世界语文献','纸与丝质材料','登记资料；待完整文献编目','private','C','not_valued','authorized_noncommercial','published' FROM hall
ON CONFLICT (permanent_code) DO NOTHING;

WITH hall AS (SELECT id FROM museum_halls WHERE code='E_WISDOM')
INSERT INTO cultural_assets(permanent_code,batch_code,title_zh,title_eo,title_en,primary_hall_id,category,material,period_description,ownership_status,authentication_level,valuation_status,digital_rights_status,public_status)
SELECT 'FC-MUS-0004','D1','沉香木观音立像','Staranta figuro de Avalokiteŝvaro el agarligno','Standing Avalokitesvara figure in agarwood',hall.id,'佛教造像','木','登记名称；年代与材质待进一步核定','private','D','not_valued','authorized_noncommercial','published' FROM hall
ON CONFLICT (permanent_code) DO NOTHING;

WITH hall AS (SELECT id FROM museum_halls WHERE code='W_GIFTS')
INSERT INTO cultural_assets(permanent_code,batch_code,title_zh,title_eo,title_en,primary_hall_id,category,material,period_description,ownership_status,authentication_level,valuation_status,digital_rights_status,public_status)
SELECT 'FC-MUS-0005','D2','清中期珐琅彩青花釉瓷碗','Porcelana bovlo kun blua-kaj-kolora dekoracio, registrita kiel meza Qing','Porcelain bowl with blue-and-color decoration, registered as mid-Qing',hall.id,'瓷器','瓷','馆藏登记名称；年代与工艺仍待专业核定','private','D','not_valued','authorized_noncommercial','published' FROM hall
ON CONFLICT (permanent_code) DO NOTHING;
