import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { EARNING_LEDGER_SOURCES, SPENDING_LEDGER_SOURCES, pointsRules } from '@/lib/server/pointsRules';
import { GET } from '@/app/api/points-rules/route';

const TODAY = '2026-10-21';
const NOW = '2026-10-01T00:00:00.000Z';

function lines(id: string) {
  return pointsRules(TODAY).find((section) => section.id === id)?.lines ?? [];
}

beforeEach(() => {
  db.exec(`
    DELETE FROM learning_point_settings;
    DELETE FROM reward_rules;
    DELETE FROM task_templates;
    DELETE FROM parent_settings WHERE key = 'monthly_trophy_prize_stars';
  `);
  db.prepare(`INSERT INTO learning_point_settings (id, baseValue, decayStep, minimumValue, dailyCap, streakIntervalDays, streakBonusAmount, learningPointsEnabled, streakBonusEnabled, updatedAt)
    VALUES (1, 1.5, 0.5, 0.5, 8, 5, 2, 1, 1, ?)`).run(NOW);
  db.prepare("INSERT INTO reward_rules (thresholdDays, rewardStars, learnerScope, enabled, createdAt, updatedAt) VALUES (10, 5, 'both', 1, ?, ?)").run(NOW, NOW);
  db.prepare("INSERT INTO reward_rules (thresholdDays, rewardStars, learnerScope, enabled, createdAt, updatedAt) VALUES (3, 1, 'kirsi', 1, ?, ?)").run(NOW, NOW);
  db.prepare("INSERT INTO reward_rules (thresholdDays, rewardStars, learnerScope, enabled, createdAt, updatedAt) VALUES (20, 9, 'both', 0, ?, ?)").run(NOW, NOW);
  db.prepare("INSERT INTO parent_settings (key, value, updatedAt) VALUES ('monthly_trophy_prize_stars', '15', ?)").run(NOW);
});

function addTask(title: string, points: number, extra: Partial<{ assignmentMode: string; recurrenceType: string; selectedWeekdaysJson: string | null; onceDate: string | null; requiresApproval: number; deletedAt: string | null }> = {}) {
  const task = { assignmentMode: 'both_independent', recurrenceType: 'daily', selectedWeekdaysJson: null, onceDate: null, requiresApproval: 0, deletedAt: null, ...extra };
  db.prepare(`INSERT INTO task_templates (title, points, assignmentMode, recurrenceType, selectedWeekdaysJson, startDate, onceDate, requiresApproval, createdAt, deletedAt)
    VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?)`).run(title, points, task.assignmentMode, task.recurrenceType, task.selectedWeekdaysJson, task.onceDate, task.requiresApproval, NOW, task.deletedAt);
}

describe('Mille eest tähti saab', () => {
  it('describes exercises from the parent\'s learning-point settings', () => {
    expect(lines('harjutused').slice(0, 3)).toEqual([
      'Iga tehtud harjutus annab 1,5 ⭐, kui vähemalt 50% vastustest on õiged.',
      'Sama harjutus samal päeval uuesti: iga kord 0,5 ⭐ vähem, aga vähemalt 0,5 ⭐.',
      'Harjutustest saab päevas kokku kuni 8 ⭐.'
    ]);
  });

  it('lists the streak bonus and the enabled streak rules, shortest first', () => {
    expect(lines('jarjest')).toEqual([
      'Iga 5. päev järjest harjutades: +2 ⭐.',
      '3 päeva järjest harjutatud (Kirsi): +1 ⭐.',
      '10 päeva järjest harjutatud: +5 ⭐.'
    ]);
  });

  it('lists the active daily tasks and changes by itself when one is added or removed', () => {
    expect(pointsRules(TODAY).some((section) => section.id === 'tegevused')).toBe(false);
    addTask('Pese hambad', 1);
    addTask('Koristan toa', 3, { assignmentMode: 'first_completer', recurrenceType: 'selected_weekdays', selectedWeekdaysJson: '[3,6]', requiresApproval: 1 });
    addTask('Matkapäev', 5, { assignmentMode: 'kiur', recurrenceType: 'once', onceDate: '2026-10-25' });
    addTask('Möödunud üritus', 4, { recurrenceType: 'once', onceDate: '2026-10-01' });
    addTask('Kustutatud', 2, { deletedAt: NOW });
    expect(lines('tegevused')).toEqual([
      'Matkapäev: +5 ⭐ (Kiur, 25.10)',
      'Koristan toa: +3 ⭐ (kes jõuab esimesena, K, L, vanem kinnitab)',
      'Pese hambad: +1 ⭐ (mõlemad, iga päev)',
      'Kui mõlemad lapsed teevad kõik päeva tegevused ära: mõlemale +1 ⭐ boonust.'
    ]);
  });

  it('shows the monthly prize the parent set, and says when exercises give nothing', () => {
    expect(lines('kuu')).toContain('Kuu lõpus saab kõige rohkem karikaid kogunu +15 ⭐, kui harjutas üle poole kuu päevadest.');
    db.prepare('UPDATE learning_point_settings SET learningPointsEnabled = 0').run();
    expect(lines('harjutused')).toEqual(['Harjutustest praegu tähti ei saa.']);
    expect(lines('jarjest')).toEqual(['3 päeva järjest harjutatud (Kirsi): +1 ⭐.', '10 päeva järjest harjutatud: +5 ⭐.']);
  });

  it('is served at /api/points-rules', async () => {
    const body = await (await GET()).json() as { sections: Array<{ id: string }> };
    expect(body.sections.map((section) => section.id)).toEqual(['harjutused', 'jarjest', 'kuu', 'vanem']);
  });

  // A new way to earn stars must also be explained on the home page.
  it('covers every point_ledger source the code writes', () => {
    const sources = new Set<string>();
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const file = path.join(dir, name);
        if (statSync(file).isDirectory()) walk(file);
        else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) {
          const text = readFileSync(file, 'utf8');
          for (const match of text.matchAll(/INSERT (?:OR \w+ )?INTO point_ledger[\s\S]{0,1200}?VALUES\s*\(([^)]*)\)/g)) {
            const literal = /'([a-z0-9_]+)'/.exec(match[1].split(',').slice(2).join(','));
            if (literal) sources.add(literal[1]);
          }
        }
      }
    };
    walk(path.resolve(process.cwd(), 'src'));
    // The protocol-v2 exercise reward is an INSERT OR IGNORE; it must still be seen.
    expect(sources).toContain('reward_v2');
    expect(sources.size).toBeGreaterThan(5);
    const known = new Set<string>([...Object.keys(EARNING_LEDGER_SOURCES), ...SPENDING_LEDGER_SOURCES]);
    expect([...sources].filter((source) => !known.has(source))).toEqual([]);
  });
});
