import { query } from '@/lib/db';

export type Hall={id:string;code:string;title_zh:string;title_eo:string|null;title_en:string|null};
export type AssetCard={
  id:string;permanent_code:string;batch_code:string|null;title_zh:string;title_eo:string|null;title_en:string|null;
  category:string|null;material:string|null;authentication_level:string;ownership_status:string;
  valuation_status:string;digital_rights_status:string;hall_zh:string|null;hall_eo:string|null;
};
export type AssetDetail=AssetCard & {
  period_description:string|null;dimensions:string|null;weight:string|null;provenance:string|null;
  current_location_note:string|null;workflow_status:string;public_status:string;
};

export async function listMuseumHalls(){
  const r=await query<Hall>(`SELECT id,code,title_zh,title_eo,title_en FROM museum_halls ORDER BY CASE code
    WHEN 'NW_TECH' THEN 1 WHEN 'N_WEB4' THEN 2 WHEN 'NE_BUD' THEN 3 WHEN 'W_GIFTS' THEN 4 WHEN 'C_DHARMA' THEN 5
    WHEN 'E_WISDOM' THEN 6 WHEN 'SW_MUSEUM' THEN 7 WHEN 'S_PHOENIX' THEN 8 WHEN 'SE_ESPERANTO' THEN 9 ELSE 99 END`);
  return r.rows;
}

export async function listPublishedAssets(limit=100){
  const r=await query<AssetCard>(`SELECT a.id,a.permanent_code,a.batch_code,a.title_zh,a.title_eo,a.title_en,a.category,a.material,
      a.authentication_level::text,a.ownership_status,a.valuation_status,a.digital_rights_status,
      h.title_zh AS hall_zh,h.title_eo AS hall_eo
    FROM cultural_assets a LEFT JOIN museum_halls h ON h.id=a.primary_hall_id
    WHERE a.public_status='published' AND a.workflow_status='published' AND a.deleted_at IS NULL
    ORDER BY a.created_at DESC LIMIT $1`,[limit]);
  return r.rows;
}

export async function getPublishedAsset(code:string){
  const r=await query<AssetDetail>(`SELECT a.id,a.permanent_code,a.batch_code,a.title_zh,a.title_eo,a.title_en,a.category,a.material,
      a.authentication_level::text,a.ownership_status,a.valuation_status,a.digital_rights_status,
      a.period_description,a.dimensions,a.weight,a.provenance,a.current_location_note,a.workflow_status,a.public_status,
      h.title_zh AS hall_zh,h.title_eo AS hall_eo
    FROM cultural_assets a LEFT JOIN museum_halls h ON h.id=a.primary_hall_id
    WHERE a.permanent_code=$1 AND a.public_status='published' AND a.workflow_status='published' AND a.deleted_at IS NULL LIMIT 1`,[code]);
  return r.rows[0]||null;
}

export async function listMuseumReviewQueue(){
  const r=await query<AssetDetail>(`SELECT a.id,a.permanent_code,a.batch_code,a.title_zh,a.title_eo,a.title_en,a.category,a.material,
      a.authentication_level::text,a.ownership_status,a.valuation_status,a.digital_rights_status,
      a.period_description,a.dimensions,a.weight,a.provenance,a.current_location_note,a.workflow_status,a.public_status,
      h.title_zh AS hall_zh,h.title_eo AS hall_eo
    FROM cultural_assets a LEFT JOIN museum_halls h ON h.id=a.primary_hall_id
    WHERE a.workflow_status='review' AND a.deleted_at IS NULL ORDER BY a.submitted_for_review_at ASC NULLS LAST`);
  return r.rows;
}


export type AssetMedia={
  id:string; media_type:string; file_url:string; caption:string|null; is_primary:boolean; copyright_status:string; created_at:string;
};
export type ExhibitionText={
  id:string; locale:'zh'|'eo'|'en'; short_label:string|null; exhibition_text:string; version:string; reviewed_at:string|null;
};
export type ResearchNote={
  id:string; note_type:string; content:string; source_reference:string|null; created_at:string; author_name:string|null;
};
export type AssetVersion={
  id:string; version_number:string; change_summary:string; created_at:string; changed_by_name:string|null;
};

export async function getAssetDossier(assetId:string){
  const [media,labels,research,versions]=await Promise.all([
    query<AssetMedia>(`SELECT id,media_type::text,file_url,caption,is_primary,copyright_status,created_at::text
      FROM asset_media WHERE asset_id=$1 ORDER BY is_primary DESC,created_at ASC`,[assetId]),
    query<ExhibitionText>(`SELECT id,locale,short_label,exhibition_text,version,reviewed_at::text
      FROM asset_exhibition_texts WHERE asset_id=$1 AND status='published'
      ORDER BY CASE locale WHEN 'zh' THEN 1 WHEN 'eo' THEN 2 ELSE 3 END,version DESC`,[assetId]),
    query<ResearchNote>(`SELECT n.id,n.note_type,n.content,n.source_reference,n.created_at::text,u.display_name AS author_name
      FROM asset_research_notes n LEFT JOIN users u ON u.id=n.author_id
      WHERE n.asset_id=$1 AND n.status='published' ORDER BY n.created_at DESC`,[assetId]),
    query<AssetVersion>(`SELECT v.id,v.version_number,v.change_summary,v.created_at::text,u.display_name AS changed_by_name
      FROM asset_versions v LEFT JOIN users u ON u.id=v.changed_by
      WHERE v.asset_id=$1 ORDER BY v.created_at DESC`,[assetId])
  ]);
  return {media:media.rows,labels:labels.rows,research:research.rows,versions:versions.rows};
}


export type HallWithCount=Hall & { asset_count:string };
export async function listMuseumHallsWithCounts(){
  const r=await query<HallWithCount>(`SELECT h.id,h.code,h.title_zh,h.title_eo,h.title_en,
      COUNT(a.id) FILTER(WHERE a.public_status='published' AND a.workflow_status='published' AND a.deleted_at IS NULL)::text AS asset_count
    FROM museum_halls h
    LEFT JOIN cultural_assets a ON a.primary_hall_id=h.id
    GROUP BY h.id,h.code,h.title_zh,h.title_eo,h.title_en
    ORDER BY CASE h.code
      WHEN 'NW_TECH' THEN 1 WHEN 'N_WEB4' THEN 2 WHEN 'NE_BUD' THEN 3 WHEN 'W_GIFTS' THEN 4 WHEN 'C_DHARMA' THEN 5
      WHEN 'E_WISDOM' THEN 6 WHEN 'SW_MUSEUM' THEN 7 WHEN 'S_PHOENIX' THEN 8 WHEN 'SE_ESPERANTO' THEN 9 ELSE 99 END`);
  return r.rows;
}

export async function getHallByCode(code:string){
  const r=await query<HallWithCount>(`SELECT h.id,h.code,h.title_zh,h.title_eo,h.title_en,
      COUNT(a.id) FILTER(WHERE a.public_status='published' AND a.workflow_status='published' AND a.deleted_at IS NULL)::text AS asset_count
    FROM museum_halls h
    LEFT JOIN cultural_assets a ON a.primary_hall_id=h.id
    WHERE h.code=$1
    GROUP BY h.id,h.code,h.title_zh,h.title_eo,h.title_en
    LIMIT 1`,[code]);
  return r.rows[0]||null;
}

export async function listPublishedAssetsByHall(hallId:string,limit=100){
  const r=await query<AssetCard>(`SELECT a.id,a.permanent_code,a.batch_code,a.title_zh,a.title_eo,a.title_en,a.category,a.material,
      a.authentication_level::text,a.ownership_status,a.valuation_status,a.digital_rights_status,
      h.title_zh AS hall_zh,h.title_eo AS hall_eo
    FROM cultural_assets a
    LEFT JOIN museum_halls h ON h.id=a.primary_hall_id
    WHERE a.primary_hall_id=$1 AND a.public_status='published' AND a.workflow_status='published' AND a.deleted_at IS NULL
    ORDER BY a.created_at DESC LIMIT $2`,[hallId,limit]);
  return r.rows;
}
