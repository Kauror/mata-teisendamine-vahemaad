import db from '@/lib/db';
import { formatStars } from '@/lib/formatStars';
import { getMonthlyPrizeStars } from '@/lib/monthlyCompetition';
import { snapshotCurrentRewardPolicy } from '@/lib/server/rewards/policy';
import { parseSelectedWeekdays } from '@/lib/shared/taskProjection';
import { todayDateString, type AssignmentMode, type RecurrenceType } from '@/lib/tasks';

// "Mille eest tärne saab" on the home page (Kaur, 21.10). It is built from the
// live settings on every request, so it changes by itself when the parent edits
// learning points, adds a streak rule, a daily task or the monthly prize.
//
// Every point_ledger source that EARNS stars must appear here; pointsRules.test
// fails when code inserts a new earning source that is not listed below.
export const EARNING_LEDGER_SOURCES = {
  study_exercise: 'harjutused',
  streak_bonus: 'jarjest',
  reward_streak: 'jarjest',
  real_world_task: 'tegevused',
  daily_task_bonus: 'tegevused',
  monthly_trophy_prize: 'kuu',
  point_gift: 'vanem',
  manual_adjustment: 'vanem'
} as const;
// Sources that only spend stars: not "how to earn" rules.
export const SPENDING_LEDGER_SOURCES = ['store_purchase', 'streak_freeze'] as const;

export type PointsRuleSection = { id: string; title: string; lines: string[] };

const stars = (value: number) => `${formatStars(value)} ⭐`;
const WEEKDAYS = ['', 'E', 'T', 'K', 'N', 'R', 'L', 'P'];

function who(mode: AssignmentMode) {
  if (mode === 'kiur') return 'Kiur';
  if (mode === 'kirsi') return 'Kirsi';
  if (mode === 'first_completer') return 'kes jõuab esimesena';
  return 'mõlemad';
}

function when(template: { recurrenceType: RecurrenceType; selectedWeekdaysJson: string | null; onceDate: string | null }) {
  if (template.recurrenceType === 'daily') return 'iga päev';
  if (template.recurrenceType === 'weekdays') return 'tööpäeviti';
  if (template.recurrenceType === 'weekends') return 'nädalavahetusel';
  if (template.recurrenceType === 'once') return template.onceDate ? `${template.onceDate.slice(8, 10)}.${template.onceDate.slice(5, 7)}` : 'üks kord';
  return parseSelectedWeekdays(template.selectedWeekdaysJson).map((day) => WEEKDAYS[day]).join(', ');
}

function learningSection(): PointsRuleSection {
  const { learning } = snapshotCurrentRewardPolicy();
  if (!learning.learningPointsEnabled) {
    return { id: 'harjutused', title: '📚 Harjutused', lines: ['Harjutustest praegu tärne ei saa.'] };
  }
  const lines = [
    `Iga tehtud harjutus annab ${stars(learning.baseValue)}, kui vähemalt ${Math.round(learning.minimumScorePercent * 100)}% vastustest on õiged.`
  ];
  if (learning.decayStep > 0) {
    lines.push(`Sama harjutus samal päeval uuesti: iga kord ${stars(learning.decayStep)} vähem${learning.minimumValue > 0 ? `, aga vähemalt ${stars(learning.minimumValue)}` : ''}.`);
  }
  lines.push(`Harjutustest saab päevas kokku kuni ${stars(learning.dailyCap)}.`);
  lines.push('Loodusõpetuse õpik ja inglise sõnavara: tärnid tulevad läbitud testi eest. Lugemine ja harjutamine on ajaloos näha, aga tärne ei anna.');
  lines.push('Inglise sprint loeb, kui tulemus on vähemalt pool senisest rekordist.');
  return { id: 'harjutused', title: '📚 Harjutused', lines };
}

function streakSection(): PointsRuleSection | null {
  const { learning, rules } = snapshotCurrentRewardPolicy();
  const lines: string[] = [];
  if (learning.learningPointsEnabled && learning.streakBonusEnabled && learning.streakBonusAmount > 0) {
    lines.push(`Iga ${learning.streakIntervalDays}. päev järjest harjutades: +${stars(learning.streakBonusAmount)}.`);
  }
  for (const rule of [...rules].sort((left, right) => left.thresholdDays - right.thresholdDays)) {
    const scope = rule.learnerScope === 'both' ? '' : ` (${rule.learnerScope === 'kiur' ? 'Kiur' : 'Kirsi'})`;
    lines.push(`${rule.thresholdDays} päeva järjest harjutatud${scope}: +${stars(rule.rewardStars)}.`);
  }
  return lines.length ? { id: 'jarjest', title: '🔥 Päevad järjest', lines } : null;
}

type TemplateRow = {
  title: string;
  points: number;
  assignmentMode: AssignmentMode;
  recurrenceType: RecurrenceType;
  selectedWeekdaysJson: string | null;
  onceDate: string | null;
  requiresApproval: number;
};

function tasksSection(today: string): PointsRuleSection | null {
  // Active templates: not deleted, and a one-off task only until its day.
  const templates = db.prepare(`
    SELECT title, points, assignmentMode, recurrenceType, selectedWeekdaysJson, onceDate, requiresApproval
    FROM task_templates
    WHERE deletedAt IS NULL AND (recurrenceType <> 'once' OR onceDate >= ?)
    ORDER BY points DESC, title ASC
  `).all(today) as TemplateRow[];
  if (templates.length === 0) return null;
  const lines = templates.map((template) => {
    const approval = template.requiresApproval ? ', vanem kinnitab' : '';
    return `${template.title}: +${stars(template.points)} (${who(template.assignmentMode)}, ${when(template)}${approval})`;
  });
  lines.push(`Kui mõlemad lapsed teevad kõik päeva tegevused ära: mõlemale +${stars(1)} boonust.`);
  return { id: 'tegevused', title: '✅ Päevategevused', lines };
}

function monthSection(): PointsRuleSection {
  const prize = getMonthlyPrizeStars();
  const lines = ['Päeva karika saab see, kes tegi sel päeval rohkem harjutusi.'];
  if (prize > 0) lines.push(`Kuu lõpus saab kõige rohkem karikaid kogunu +${stars(prize)}, kui harjutas üle poole kuu päevadest.`);
  return { id: 'kuu', title: '🏆 Karikad ja kuu võitja', lines };
}

export function pointsRules(today = todayDateString()): PointsRuleSection[] {
  return [
    learningSection(),
    streakSection(),
    tasksSection(today),
    monthSection(),
    { id: 'vanem', title: '🎁 Vanemalt', lines: ['Vanem võib tärne ka kinkida või parandada.'] }
  ].filter((section): section is PointsRuleSection => section !== null);
}
