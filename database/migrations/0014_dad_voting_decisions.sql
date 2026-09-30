-- Feniksa Civilizo Web4 0.1 Alpha
-- Task 16: DAD voting, eligibility snapshots, thresholds and permanent decision records.

ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS decision_rule TEXT NOT NULL DEFAULT 'simple_majority',
  ADD COLUMN IF NOT EXISTS eligibility_snapshot_count INTEGER,
  ADD COLUMN IF NOT EXISTS voting_opened_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS decision_finalized_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS final_outcome TEXT,
  ADD COLUMN IF NOT EXISTS decision_summary JSONB;

DO $$ BEGIN
  ALTER TABLE proposals ADD CONSTRAINT proposals_decision_rule_ck
    CHECK (decision_rule IN ('simple_majority','two_thirds','three_quarters'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE proposals ADD CONSTRAINT proposals_final_outcome_ck
    CHECK (final_outcome IS NULL OR final_outcome IN ('approved','rejected','revision','no_quorum'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS proposal_voter_eligibility (
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  eligibility_basis TEXT NOT NULL DEFAULT 'active_member_snapshot',
  snapshotted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (proposal_id,user_id)
);

CREATE INDEX IF NOT EXISTS proposal_voter_eligibility_user_idx
  ON proposal_voter_eligibility(user_id,proposal_id);

CREATE TABLE IF NOT EXISTS proposal_vote_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  previous_vote vote_type,
  new_vote vote_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS proposal_vote_events_proposal_idx
  ON proposal_vote_events(proposal_id,created_at ASC);

CREATE TABLE IF NOT EXISTS proposal_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL UNIQUE REFERENCES proposals(id) ON DELETE CASCADE,
  decision_rule TEXT NOT NULL,
  eligible_count INTEGER NOT NULL,
  participation_count INTEGER NOT NULL,
  approve_count INTEGER NOT NULL,
  reject_count INTEGER NOT NULL,
  abstain_count INTEGER NOT NULL,
  revise_count INTEGER NOT NULL,
  decision_vote_count INTEGER NOT NULL,
  approvals_required INTEGER NOT NULL,
  outcome TEXT NOT NULL,
  finalized_by UUID REFERENCES users(id) ON DELETE SET NULL,
  finalized_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT proposal_decisions_rule_ck CHECK (decision_rule IN ('simple_majority','two_thirds','three_quarters')),
  CONSTRAINT proposal_decisions_outcome_ck CHECK (outcome IN ('approved','rejected','revision','no_quorum')),
  CONSTRAINT proposal_decisions_nonnegative_ck CHECK (
    eligible_count >= 0 AND participation_count >= 0 AND approve_count >= 0 AND reject_count >= 0 AND abstain_count >= 0 AND revise_count >= 0 AND decision_vote_count >= 0 AND approvals_required >= 0
  )
);

COMMENT ON TABLE proposal_voter_eligibility IS 'Immutable eligibility snapshot made when voting opens. Token holdings and EST/BUD/WFB values are not eligibility criteria.';
COMMENT ON TABLE proposal_vote_events IS 'Append-only vote-change history; proposal_votes stores only the current effective vote.';
COMMENT ON TABLE proposal_decisions IS 'Permanent final decision snapshot. Abstentions are excluded from the approval-threshold denominator.';
