import db from '@/lib/db';

// better-sqlite3 enables `PRAGMA foreign_keys = ON` by default, so an attempt
// row cannot be removed while anything still references it. Several tables point
// at attempts(id): the reward tables (attemptId), the mistake pool
// (sourceAttemptId / resolvedByAttemptId) and remediation sessions
// (historyAttemptId). Every reference must be cleared first or the DELETE throws
// "FOREIGN KEY constraint failed" and the whole transaction rolls back — which
// is exactly why deleting a real exercise from history used to fail.
//
// Note: the point_ledger entries earned by an attempt are intentionally left in
// place, so deleting a history row does not retroactively change a child's star
// balance (matching the previous behaviour).

const deleteAttemptTx = db.transaction((attemptId: number): number => {
  db.prepare('DELETE FROM reward_rule_awards WHERE attemptId = ?').run(attemptId);
  db.prepare('DELETE FROM streak_bonus_awards WHERE attemptId = ?').run(attemptId);
  db.prepare('DELETE FROM study_attempt_rewards WHERE attemptId = ?').run(attemptId);
  // Keep the mistakes/sessions, just drop the now-dangling attempt link.
  db.prepare('UPDATE mistake_pool SET sourceAttemptId = NULL WHERE sourceAttemptId = ?').run(attemptId);
  db.prepare('UPDATE mistake_pool SET resolvedByAttemptId = NULL WHERE resolvedByAttemptId = ?').run(attemptId);
  db.prepare('UPDATE remediation_sessions SET historyAttemptId = NULL WHERE historyAttemptId = ?').run(attemptId);
  return db.prepare('DELETE FROM attempts WHERE id = ?').run(attemptId).changes;
});

// Removes a single attempt and everything that references it. Returns the number
// of attempt rows deleted (0 if the id did not exist).
export function deleteAttempt(attemptId: number): number {
  return deleteAttemptTx(attemptId);
}

const deleteAllHistoryTx = db.transaction(() => {
  // Children first (remediation items reference sessions and mistakes), then the
  // tables that reference attempts, then attempts themselves.
  db.prepare('DELETE FROM remediation_session_items').run();
  db.prepare('DELETE FROM remediation_sessions').run();
  db.prepare('DELETE FROM mistake_pool').run();
  db.prepare('DELETE FROM reward_rule_awards').run();
  db.prepare('DELETE FROM streak_bonus_awards').run();
  db.prepare('DELETE FROM study_attempt_rewards').run();
  db.prepare('DELETE FROM attempts').run();
});

// Wipes the entire exercise history and all of its derived learning data.
export function deleteAllHistory() {
  deleteAllHistoryTx();
}
