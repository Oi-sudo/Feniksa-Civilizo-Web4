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
