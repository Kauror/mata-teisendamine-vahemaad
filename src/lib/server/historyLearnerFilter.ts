import { KIRSI_CATEGORIES } from '@/lib/history';
import type { Learner } from '@/lib/tasks';

// SQL twin of isKirsiAttempt(category, learner): rows with an explicit learner
// belong to that learner; legacy rows without one (NULL or an unknown value) are
// assigned by category, exactly as the client classified them. Without this a
// learner-filtered history query would silently drop those legacy rows.
export function historyLearnerClause(learner: Learner, column = 'a') {
  const categories = [...KIRSI_CATEGORIES];
  const placeholders = categories.map(() => '?').join(', ');
  const unassigned = `(${column}.learner IS NULL OR ${column}.learner NOT IN ('kiur', 'kirsi'))`;
  const byCategory = learner === 'kirsi'
    ? `${column}.category IN (${placeholders})`
    : `${column}.category NOT IN (${placeholders})`;
  return {
    sql: `(${column}.learner = ? OR (${unassigned} AND ${byCategory}))`,
    params: [learner, ...categories]
  };
}
