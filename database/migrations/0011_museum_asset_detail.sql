-- Task 13 — complete museum asset dossier: exhibition texts, evidence indexes, and first version snapshots.

CREATE TABLE IF NOT EXISTS asset_exhibition_texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES cultural_assets(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  short_label TEXT,
  exhibition_text TEXT NOT NULL,
  status publication_status NOT NULL DEFAULT 'draft',
  version TEXT NOT NULL DEFAULT '0.1',
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(asset_id, locale, version),
  CONSTRAINT asset_exhibition_locale_ck CHECK (locale IN ('zh','eo','en'))
);

CREATE INDEX IF NOT EXISTS idx_asset_media_asset_type ON asset_media(asset_id, media_type, created_at);
CREATE INDEX IF NOT EXISTS idx_asset_research_asset_status ON asset_research_notes(asset_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_asset_versions_asset_created ON asset_versions(asset_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_asset_exhibition_asset_locale ON asset_exhibition_texts(asset_id, locale, status);

INSERT INTO asset_exhibition_texts(asset_id, locale, short_label, exhibition_text, status, version)
SELECT a.id, 'zh', '贝叶经馆藏登记页', '本页展示一部登记为佛教贝叶经的实物档案。现有记录包括实物形制与馆藏登记资料；其年代、文字系统、地域来源及历史流传仍须结合原始图像、文献与专业意见继续研究。', 'published', '0.1'
FROM cultural_assets a WHERE a.permanent_code='FC-MUS-0001'
ON CONFLICT (asset_id, locale, version) DO NOTHING;
INSERT INTO asset_exhibition_texts(asset_id, locale, short_label, exhibition_text, status, version)
SELECT a.id, 'eo', 'Muzea registra paĝo de palmfolia manuskripto', 'Ĉi tiu paĝo prezentas objekton registritan kiel budhisma palmfolia manuskripto. La nuna dosiero dokumentas la fizikan objekton kaj la muzean registron; dato, skribsistemo, regiona deveno kaj historia transmisio ankoraŭ bezonas plian esploradon per originaj bildoj, dokumentoj kaj profesiaj opinioj.', 'published', '0.1'
FROM cultural_assets a WHERE a.permanent_code='FC-MUS-0001'
ON CONFLICT (asset_id, locale, version) DO NOTHING;
INSERT INTO asset_exhibition_texts(asset_id, locale, short_label, exhibition_text, status, version)
SELECT a.id, 'en', 'Museum registry page for a palm-leaf manuscript', 'This page presents an object registered as a Buddhist palm-leaf manuscript. The current dossier documents the physical object and museum record; date, script, regional origin and historical transmission still require further study using original images, documents and professional opinions.', 'published', '0.1'
FROM cultural_assets a WHERE a.permanent_code='FC-MUS-0001'
ON CONFLICT (asset_id, locale, version) DO NOTHING;

INSERT INTO asset_versions(asset_id, version_number, change_summary, snapshot)
SELECT a.id, '0.1', 'Task 13 initial public dossier snapshot', jsonb_build_object(
  'permanent_code', a.permanent_code,
  'batch_code', a.batch_code,
  'title_zh', a.title_zh,
  'title_eo', a.title_eo,
  'title_en', a.title_en,
  'authentication_level', a.authentication_level,
  'ownership_status', a.ownership_status,
  'valuation_status', a.valuation_status,
  'digital_rights_status', a.digital_rights_status,
  'public_status', a.public_status
)
FROM cultural_assets a
WHERE a.public_status='published'
ON CONFLICT (asset_id, version_number) DO NOTHING;
