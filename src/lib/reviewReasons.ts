// Why something waits for the parent, in words a parent understands. The
// codes are stored on attempts and offline task actions; the parent area used
// to show them raw ("not_permitted", "template_changed").
const REASONS: Record<string, string> = {
  not_permitted: 'harjutus oli tegemise ajal peidetud',
  unknown_catalogue_grant: 'harjutuse luba polnud seadmes veel olemas',
  catalogue_unknown: 'harjutus polnud seadmes teada',
  clock_drift: 'seadme kell oli vale',
  completion_too_old: 'tehtud ammu, jõudis serverisse hilja',
  completion_before_grant: 'tehtud enne, kui harjutus lubati',
  completion_after_grant: 'tehtud pärast harjutuse loa lõppu',
  completion_before_start: 'lõpuaeg on enne algust',
  impossible_future_timestamp: 'aeg on tulevikus',
  invalid_completion_date: 'kuupäev on vigane',
  reward_policy_changed: 'tähtede reeglid muutusid vahepeal',
  unknown_reward_policy: 'tähtede reegel on tundmatu',
  exercise_removed: 'harjutus on vahepeal eemaldatud',
  runner_exercise_mismatch: 'harjutus ei klapi',
  question_contract_mismatch: 'küsimused ei klapi',
  metadata_mismatch: 'andmed ei klapi',
  too_fast: 'tehtud kahtlaselt kiiresti',
  template_changed: 'tegevus on vahepeal muutunud',
  template_deleted: 'tegevus on vahepeal kustutatud',
  template_removed: 'tegevust enam ei ole',
  no_assignment: 'tegevust polnud sel päeval',
  late_completion: 'tehtud varasemal päeval, jõudis hiljem',
  future_task_date: 'kuupäev on tulevikus'
};

export function reviewReasonLabel(code: string | null | undefined): string {
  if (!code) return '';
  return REASONS[code] ?? 'vajab ülevaatust';
}
