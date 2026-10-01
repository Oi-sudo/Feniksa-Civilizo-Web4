import { query } from '@/lib/db';

export type Hall={id:string;code:string;title_zh:string;title_eo:string|null;title_en:string|null};
export type AssetCard={
  id:string;permanent_code:string;catalog_code:string|null;catalog_volume:string|null;batch_code:string|null;title_zh:string;title_eo:string|null;title_en:string|null;
  category:string|null;material:string|null;authentication_level:string;ownership_status:string;
  valuation_status:string;digital_rights_status:string;hall_zh:string|null;hall_eo:string|null;
};
export type AssetDetail=AssetCard & {
  period_description:string|null;dimensions:string|null;weight:string|null;provenance:string|null;catalog_source_note:string|null;
  current_location_note:string|null;workflow_status:string;public_status:string;related_display_note:string|null;
};

export async function listMuseumHalls(){
  const r=await query<Hall>(`SELECT id,code,title_zh,title_eo,title_en FROM museum_halls ORDER BY CASE code
    WHEN 'NW_TECH' THEN 1 WHEN 'N_WEB4' THEN 2 WHEN 'NE_BUD' THEN 3 WHEN 'W_GIFTS' THEN 4 WHEN 'C_DHARMA' THEN 5
    WHEN 'E_WISDOM' THEN 6 WHEN 'SW_MUSEUM' THEN 7 WHEN 'S_PHOENIX' THEN 8 WHEN 'SE_ESPERANTO' THEN 9 ELSE 99 END`);
  return r.rows;
}

export async function listPublishedAssets(limit=100){
  const r=await query<AssetCard>(`SELECT a.id,a.permanent_code,a.catalog_code,a.catalog_volume,a.batch_code,a.title_zh,a.title_eo,a.title_en,a.category,a.material,
      a.authentication_level::text,a.ownership_status,a.valuation_status,a.digital_rights_status,
      h.title_zh AS hall_zh,h.title_eo AS hall_eo
    FROM cultural_assets a LEFT JOIN museum_halls h ON h.id=a.primary_hall_id
    WHERE a.public_status='published' AND a.workflow_status='published' AND a.deleted_at IS NULL
    ORDER BY a.created_at DESC LIMIT $1`,[limit]);
  return r.rows;
}

export async function getPublishedAsset(code:string){
  const r=await query<AssetDetail>(`SELECT a.id,a.permanent_code,a.catalog_code,a.catalog_volume,a.batch_code,a.title_zh,a.title_eo,a.title_en,a.category,a.material,
      a.authentication_level::text,a.ownership_status,a.valuation_status,a.digital_rights_status,
      a.period_description,a.dimensions,a.weight,a.provenance,a.catalog_source_note,a.current_location_note,a.workflow_status,a.public_status,a.related_display_note,
      h.title_zh AS hall_zh,h.title_eo AS hall_eo
    FROM cultural_assets a LEFT JOIN museum_halls h ON h.id=a.primary_hall_id
    WHERE a.permanent_code=$1 AND a.public_status='published' AND a.workflow_status='published' AND a.deleted_at IS NULL LIMIT 1`,[code]);
  return r.rows[0]||null;
}

export type MuseumReviewAsset=AssetDetail & {submitted_for_review_by:string|null};
export async function listMuseumReviewQueue(){
  const r=await query<MuseumReviewAsset>(`SELECT a.id,a.permanent_code,a.catalog_code,a.catalog_volume,a.batch_code,a.title_zh,a.title_eo,a.title_en,a.category,a.material,
      a.authentication_level::text,a.ownership_status,a.valuation_status,a.digital_rights_status,
      a.period_description,a.dimensions,a.weight,a.provenance,a.current_location_note,a.workflow_status,a.public_status,a.submitted_for_review_by::text,
      h.title_zh AS hall_zh,h.title_eo AS hall_eo
    FROM cultural_assets a LEFT JOIN museum_halls h ON h.id=a.primary_hall_id
    WHERE a.workflow_status='review' AND a.deleted_at IS NULL ORDER BY a.submitted_for_review_at ASC NULLS LAST`);
  return r.rows;
}


export type AssetMedia={
  id:string; media_type:string; file_url:string; caption:string|null; is_primary:boolean; copyright_status:string; evidence_role:string; verification_status:string; source_note:string|null; source_confirmed_at:string|null; source_confirmed_by_name:string|null; reviewed_at:string|null; reviewed_by_name:string|null; visibility:string; published_at:string|null; published_by_name:string|null; created_at:string;
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
    query<AssetMedia>(`SELECT m.id,m.media_type::text,m.file_url,m.caption,m.is_primary,m.copyright_status,m.evidence_role,m.verification_status,m.source_note,
        m.source_confirmed_at::text,uc.display_name AS source_confirmed_by_name,m.reviewed_at::text,ur.display_name AS reviewed_by_name,
        m.visibility,m.published_at::text,up.display_name AS published_by_name,m.created_at::text
      FROM asset_media m
      LEFT JOIN users uc ON uc.id=m.source_confirmed_by
      LEFT JOIN users ur ON ur.id=m.reviewed_by
      LEFT JOIN users up ON up.id=m.published_by
      WHERE m.asset_id=$1
        AND m.visibility='public'
        AND m.copyright_status IN ('owned','authorized','public_domain')
      ORDER BY is_primary DESC,created_at ASC`,[assetId]),
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
  const r=await query<AssetCard>(`SELECT a.id,a.permanent_code,a.catalog_code,a.catalog_volume,a.batch_code,a.title_zh,a.title_eo,a.title_en,a.category,a.material,
      a.authentication_level::text,a.ownership_status,a.valuation_status,a.digital_rights_status,
      h.title_zh AS hall_zh,h.title_eo AS hall_eo
    FROM cultural_assets a
    LEFT JOIN museum_halls h ON h.id=a.primary_hall_id
    WHERE a.primary_hall_id=$1 AND a.public_status='published' AND a.workflow_status='published' AND a.deleted_at IS NULL
    ORDER BY a.created_at DESC LIMIT $2`,[hallId,limit]);
  return r.rows;
}

export async function listCatalogVolumes(){
  const r=await query<{catalog_volume:string;asset_count:string}>(`
    SELECT catalog_volume,COUNT(*)::text AS asset_count
      FROM cultural_assets
     WHERE catalog_volume IS NOT NULL AND public_status='published' AND workflow_status='published' AND deleted_at IS NULL
     GROUP BY catalog_volume
     ORDER BY MIN(created_at)`);
  return r.rows;
}
export async function listAssetsByCatalogVolume(volume:string){
  const r=await query<AssetCard>(`SELECT a.id,a.permanent_code,a.catalog_code,a.catalog_volume,a.batch_code,a.title_zh,a.title_eo,a.title_en,a.category,a.material,
      a.authentication_level::text,a.ownership_status,a.valuation_status,a.digital_rights_status,
      h.title_zh AS hall_zh,h.title_eo AS hall_eo
    FROM cultural_assets a LEFT JOIN museum_halls h ON h.id=a.primary_hall_id
    WHERE a.catalog_volume=$1 AND a.public_status='published' AND a.workflow_status='published' AND a.deleted_at IS NULL
    ORDER BY a.catalog_code`,[volume]);
  return r.rows;
}


export async function getMuseumAssetForEvidence(code:string){
  const r=await query<{id:string;permanent_code:string;catalog_code:string|null;title_zh:string}>(`
    SELECT id,permanent_code,catalog_code,title_zh
      FROM cultural_assets
     WHERE permanent_code=$1 AND deleted_at IS NULL
     LIMIT 1`,[code]);
  return r.rows[0]||null;
}


export type AdminMuseumAsset={
  id:string;permanent_code:string;catalog_code:string|null;catalog_volume:string|null;title_zh:string;
  workflow_status:string;public_status:string;hall_zh:string|null;evidence_count:string;
  evidence_unverified:string;evidence_source_confirmed:string;evidence_reviewed:string;
};
export type MuseumEvidenceFilter='all'|'missing'|'unverified'|'source_confirmed'|'reviewed';
export async function listAdminMuseumAssets(limit=200,filter:MuseumEvidenceFilter='all',catalogVolume:string|null=null,hallCode:string|null=null){
  const r=await query<AdminMuseumAsset>(`SELECT a.id,a.permanent_code,a.catalog_code,a.catalog_volume,a.title_zh,
      a.workflow_status,a.public_status,h.title_zh AS hall_zh,
      COUNT(m.id)::text AS evidence_count,
      COUNT(m.id) FILTER(WHERE m.verification_status='unverified')::text AS evidence_unverified,
      COUNT(m.id) FILTER(WHERE m.verification_status='source_confirmed')::text AS evidence_source_confirmed,
      COUNT(m.id) FILTER(WHERE m.verification_status='reviewed')::text AS evidence_reviewed
    FROM cultural_assets a
    LEFT JOIN museum_halls h ON h.id=a.primary_hall_id
    LEFT JOIN asset_media m ON m.asset_id=a.id
    WHERE a.deleted_at IS NULL
      AND ($3::text IS NULL OR a.catalog_volume=$3)
      AND ($4::text IS NULL OR h.code=$4)
    GROUP BY a.id,a.permanent_code,a.catalog_code,a.catalog_volume,a.title_zh,a.workflow_status,a.public_status,h.title_zh
    HAVING (
      $2='all'
      OR ($2='missing' AND COUNT(m.id)=0)
      OR ($2='unverified' AND COUNT(m.id) FILTER(WHERE m.verification_status='unverified')>0)
      OR ($2='source_confirmed' AND COUNT(m.id) FILTER(WHERE m.verification_status='source_confirmed')>0)
      OR ($2='reviewed' AND COUNT(m.id) FILTER(WHERE m.verification_status='reviewed')>0)
    )
    ORDER BY
      CASE WHEN COUNT(m.id)=0 THEN 0
           WHEN COUNT(m.id) FILTER(WHERE m.verification_status='reviewed')=0
            AND COUNT(m.id) FILTER(WHERE m.verification_status='source_confirmed')=0 THEN 1
           WHEN COUNT(m.id) FILTER(WHERE m.verification_status='reviewed')=0 THEN 2
           ELSE 3 END,
      COALESCE(a.catalog_volume,''),COALESCE(a.catalog_code,a.permanent_code),a.created_at DESC
    LIMIT $1`,[limit,filter,catalogVolume,hallCode]);
  return r.rows;
}


export type EvidenceReviewEvent={
  id:string;media_id:string;asset_id:string;from_status:string|null;to_status:string;
  note:string|null;created_at:string;actor_name:string|null;caption:string|null;media_type:string;
};
export async function listEvidenceReviewEvents(assetId:string){
  const r=await query<EvidenceReviewEvent>(`
    SELECT e.id,e.media_id,e.asset_id,e.from_status,e.to_status,e.note,e.created_at::text,
           u.display_name AS actor_name,m.caption,m.media_type::text
      FROM asset_media_review_events e
      JOIN asset_media m ON m.id=e.media_id
      LEFT JOIN users u ON u.id=e.actor_id
     WHERE e.asset_id=$1
     ORDER BY e.created_at DESC`,[assetId]);
  return r.rows;
}


export type MuseumEvidenceOverview={
  asset_count:string;evidence_count:string;unverified_count:string;source_confirmed_count:string;reviewed_count:string;
  assets_without_evidence:string;assets_only_unverified:string;
};
export async function getMuseumEvidenceOverview(){
  const r=await query<MuseumEvidenceOverview>(`
    WITH per_asset AS (
      SELECT a.id,
             COUNT(m.id) AS evidence_count,
             COUNT(m.id) FILTER(WHERE m.verification_status='unverified') AS unverified_count,
             COUNT(m.id) FILTER(WHERE m.verification_status='source_confirmed') AS source_confirmed_count,
             COUNT(m.id) FILTER(WHERE m.verification_status='reviewed') AS reviewed_count
        FROM cultural_assets a
        LEFT JOIN asset_media m ON m.asset_id=a.id
       WHERE a.deleted_at IS NULL
       GROUP BY a.id
    )
    SELECT COUNT(*)::text AS asset_count,
           COALESCE(SUM(evidence_count),0)::text AS evidence_count,
           COALESCE(SUM(unverified_count),0)::text AS unverified_count,
           COALESCE(SUM(source_confirmed_count),0)::text AS source_confirmed_count,
           COALESCE(SUM(reviewed_count),0)::text AS reviewed_count,
           COUNT(*) FILTER(WHERE evidence_count=0)::text AS assets_without_evidence,
           COUNT(*) FILTER(WHERE evidence_count>0 AND source_confirmed_count=0 AND reviewed_count=0)::text AS assets_only_unverified
      FROM per_asset`);
  return r.rows[0];
}


export async function listAdminCatalogVolumes(){
  const r=await query<{catalog_volume:string;asset_count:string}>(`
    SELECT catalog_volume,COUNT(*)::text AS asset_count
      FROM cultural_assets
     WHERE deleted_at IS NULL AND catalog_volume IS NOT NULL
     GROUP BY catalog_volume
     ORDER BY MIN(created_at)`);
  return r.rows;
}


export async function getAssetDossierAdmin(assetId:string){
  const [media,labels,research,versions]=await Promise.all([
    query<AssetMedia>(`SELECT m.id,m.media_type::text,m.file_url,m.caption,m.is_primary,m.copyright_status,m.evidence_role,m.verification_status,m.source_note,
        m.source_confirmed_at::text,uc.display_name AS source_confirmed_by_name,m.reviewed_at::text,ur.display_name AS reviewed_by_name,
        m.visibility,m.published_at::text,up.display_name AS published_by_name,m.created_at::text
      FROM asset_media m
      LEFT JOIN users uc ON uc.id=m.source_confirmed_by
      LEFT JOIN users ur ON ur.id=m.reviewed_by
      LEFT JOIN users up ON up.id=m.published_by
      WHERE m.asset_id=$1 ORDER BY m.is_primary DESC,m.created_at ASC`,[assetId]),
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
