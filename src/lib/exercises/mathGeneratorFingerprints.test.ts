import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import {
  MATH_GENERATOR_VERSION_V1,
  MATH_GENERATOR_VERSION_V2,
  MATH_GENERATOR_VERSION_V3,
  MATH_GENERATOR_VERSION_V4,
  type MathGeneratorVersion
} from '@/lib/exercises/mathGeneratorVersion';
import type { Difficulty } from '@/lib/types';

// Broad replay fingerprints. mathGeneratorVersion.test.ts pins five sessions at
// 'Lihtne'; these pin EVERY Kiur topic, every one of its categories, all three
// difficulties, the text problems, multiplication and every Kirsi mode, for
// each frozen version. A phone may hold an unsynced attempt or a paused run made
// by any of them, and the server re-generates it from its seed to verify it, so
// none of these may ever change. Taken from 957a532 (production main) before
// math-2026-11 was added. NEVER update them.

const DIFFICULTIES: Difficulty[] = ['Lihtne', 'Keskmine', 'Raske'];
const KIUR_TOPICS: Record<string, string[]> = {
  'jagamine-kahekohaline-uhekohaline': ['Arvuta jagatis', 'Jaga osadeks', 'Vali sobiv jaotus', 'Jaga võrdselt', 'Jaga rühmadesse', 'Vali jagamistehe', 'Kontrolli korrutamisega', 'Vali jagatis', 'Rühmadega jagamine', 'Kas arvutus on õige?', 'Jaga sama arvuga', 'Vali abitehe', 'Segaharjutus'],
  'arvud-10000-piires': ['Liida sajalised', 'Lahuta sajalised', 'Liida tuhandelised', 'Lahuta tuhandelised', 'Liida 2- või 3-kohaline arv', 'Lahuta 2- või 3-kohaline arv', 'Liida kaks 4-kohalist arvu', 'Lahuta 4-kohalised arvud', 'Lahuta arv järkudeks', 'Pane arv kokku', 'Numbri väärtus', 'Ümardamine', 'Ligikaudne arvutus', 'Leia arvutusviga', 'Plokid ja järgud', 'Segaharjutus'],
  'ring-ja-ringjoon': ['Ring või ringjoon', 'Leia raadius', 'Leia läbimõõt', 'Läbimõõt raadiusest', 'Raadius läbimõõdust', 'Punkti asukoht', 'Sama keskpunkt', 'Võrdle raadiuseid', 'Ringi kraadid', 'Puuduv kraad', 'Segaharjutus'],
  mustrid: ['Segaharjutus'],
  'mootuhikud-pikkused': ['Segaharjutus']
};
const KIRSI_MODES = ['Loendamine', 'Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100', 'Segaülesanded', 'Kellaaeg'] as const;
const SEEDS = 20;

function fingerprintSessions(version: MathGeneratorVersion): Record<string, string> {
  const out: Record<string, string> = {};
  const digest = (feed: (hash: ReturnType<typeof createHash>) => void) => {
    const hash = createHash('sha256');
    feed(hash);
    return hash.digest('hex').slice(0, 16);
  };
  for (const [topic, categories] of Object.entries(KIUR_TOPICS)) {
    for (const difficulty of DIFFICULTIES) {
      out[`${topic}/${difficulty}`] = digest((hash) => {
        for (const category of categories) {
          for (let seed = 1; seed <= SEEDS; seed += 1) hash.update(JSON.stringify(generateKiurMathSession(topic, category, difficulty, 15, seed, version)));
        }
      });
    }
  }
  out.tekstulesanded = digest((hash) => {
    for (let seed = 1; seed <= 100; seed += 1) hash.update(JSON.stringify(generateKiurMathSession('tekstulesanded', 'Tekstülesanded', 'Lihtne', 5, seed, version)));
  });
  out.korrutamine = digest((hash) => {
    for (let seed = 1; seed <= SEEDS; seed += 1) hash.update(JSON.stringify(generateKiurMathSession('korrutamine', 'Korrutamine', 'Lihtne', 15, seed, version)));
  });
  for (const mode of KIRSI_MODES) {
    out[`kirsi/${mode}`] = digest((hash) => {
      for (let seed = 1; seed <= SEEDS; seed += 1) hash.update(JSON.stringify(generateKirsiSession(mode, 15, seed, version)));
    });
  }
  return out;
}

const FROZEN: Record<string, Record<string, string>> = {
  '2026-07-1': {
    'jagamine-kahekohaline-uhekohaline/Lihtne': '9bd19b6bab62a1ea',
    'jagamine-kahekohaline-uhekohaline/Keskmine': '0404e768dd9eee30',
    'jagamine-kahekohaline-uhekohaline/Raske': '721b869b590ce9ea',
    'arvud-10000-piires/Lihtne': '943241a873b39e2f',
    'arvud-10000-piires/Keskmine': 'b283ddf501fefeba',
    'arvud-10000-piires/Raske': '3882ed0299a6db2b',
    'ring-ja-ringjoon/Lihtne': '7215ebefa593e2e6',
    'ring-ja-ringjoon/Keskmine': '9eb71127b09c60e0',
    'ring-ja-ringjoon/Raske': '9dc4425572dbfcb3',
    'mustrid/Lihtne': '447b448a031ef95b',
    'mustrid/Keskmine': 'd5d52e8ae7f1d1f9',
    'mustrid/Raske': 'b06af4df8e55fb63',
    'mootuhikud-pikkused/Lihtne': '43597cf327b9f657',
    'mootuhikud-pikkused/Keskmine': '87df72f6d232154f',
    'mootuhikud-pikkused/Raske': '00f8376178d0d368',
    'tekstulesanded': '4aa90cb758687801',
    'korrutamine': 'b8bfd863ea0b6f3b',
    'kirsi/Loendamine': 'bad34578e72b158a',
    'kirsi/Arvutamine 10 piires': 'a57c22a9680e1f34',
    'kirsi/Arvutamine 20 piires': '604b8d1660203422',
    'kirsi/Suurem või väiksem kuni 100': 'a7039083f4d6865c',
    'kirsi/Segaülesanded': '23b4a9b6dee16862',
    'kirsi/Kellaaeg': '496649bb0661ed39'
  },
  'math-2026-10': {
    'jagamine-kahekohaline-uhekohaline/Lihtne': '42fe9b851d43f40c',
    'jagamine-kahekohaline-uhekohaline/Keskmine': '21c7410dec81c1b3',
    'jagamine-kahekohaline-uhekohaline/Raske': '7dfbf5554bfbe3e5',
    'arvud-10000-piires/Lihtne': 'b1c6c2997811a6a0',
    'arvud-10000-piires/Keskmine': '7e9ef99af59117b7',
    'arvud-10000-piires/Raske': 'ddc7edc1c01943ad',
    'ring-ja-ringjoon/Lihtne': 'fa7df132c07bd311',
    'ring-ja-ringjoon/Keskmine': '98c98e090ba3cce9',
    'ring-ja-ringjoon/Raske': '8290c0a399f86403',
    'mustrid/Lihtne': '447b448a031ef95b',
    'mustrid/Keskmine': 'd5d52e8ae7f1d1f9',
    'mustrid/Raske': 'b06af4df8e55fb63',
    'mootuhikud-pikkused/Lihtne': 'a0e4349864817c04',
    'mootuhikud-pikkused/Keskmine': '0bb3d0cffe622211',
    'mootuhikud-pikkused/Raske': '9c1c8aa30e2c399d',
    'tekstulesanded': '4aa90cb758687801',
    'korrutamine': 'b8bfd863ea0b6f3b',
    'kirsi/Loendamine': 'bad34578e72b158a',
    'kirsi/Arvutamine 10 piires': 'a57c22a9680e1f34',
    'kirsi/Arvutamine 20 piires': '604b8d1660203422',
    'kirsi/Suurem või väiksem kuni 100': 'a7039083f4d6865c',
    'kirsi/Segaülesanded': '23b4a9b6dee16862',
    'kirsi/Kellaaeg': '4ce6d9d22d8cf447'
  },
  'math-2026-10b': {
    'jagamine-kahekohaline-uhekohaline/Lihtne': '42fe9b851d43f40c',
    'jagamine-kahekohaline-uhekohaline/Keskmine': '21c7410dec81c1b3',
    'jagamine-kahekohaline-uhekohaline/Raske': '7dfbf5554bfbe3e5',
    'arvud-10000-piires/Lihtne': '6c21b32e1693cf71',
    'arvud-10000-piires/Keskmine': '6c852b92c1fb6e3f',
    'arvud-10000-piires/Raske': '70f4a9c58d745464',
    'ring-ja-ringjoon/Lihtne': 'c9e0cdab8c41e1e5',
    'ring-ja-ringjoon/Keskmine': '63bce52f723c6810',
    'ring-ja-ringjoon/Raske': 'c55c8c78a8a45ac7',
    'mustrid/Lihtne': '447b448a031ef95b',
    'mustrid/Keskmine': 'd5d52e8ae7f1d1f9',
    'mustrid/Raske': 'b06af4df8e55fb63',
    'mootuhikud-pikkused/Lihtne': 'a0e4349864817c04',
    'mootuhikud-pikkused/Keskmine': '0bb3d0cffe622211',
    'mootuhikud-pikkused/Raske': '9c1c8aa30e2c399d',
    'tekstulesanded': '4aa90cb758687801',
    'korrutamine': 'b8bfd863ea0b6f3b',
    'kirsi/Loendamine': 'bad34578e72b158a',
    'kirsi/Arvutamine 10 piires': 'a57c22a9680e1f34',
    'kirsi/Arvutamine 20 piires': '604b8d1660203422',
    'kirsi/Suurem või väiksem kuni 100': 'a7039083f4d6865c',
    'kirsi/Segaülesanded': '23b4a9b6dee16862',
    'kirsi/Kellaaeg': '4ce6d9d22d8cf447'
  },
  'math-2026-10c': {
    'jagamine-kahekohaline-uhekohaline/Lihtne': '2b65e60147807626',
    'jagamine-kahekohaline-uhekohaline/Keskmine': '341b0c9ad08e8157',
    'jagamine-kahekohaline-uhekohaline/Raske': '3ef6f5c741994941',
    'arvud-10000-piires/Lihtne': '41e6d5337b56b894',
    'arvud-10000-piires/Keskmine': 'c1ecc6ec42b92cb0',
    'arvud-10000-piires/Raske': '25fe5f966c994025',
    'ring-ja-ringjoon/Lihtne': 'ff675321f121f4ce',
    'ring-ja-ringjoon/Keskmine': 'ec98a5538091e350',
    'ring-ja-ringjoon/Raske': 'e741048086ba198f',
    'mustrid/Lihtne': 'e53af7b1a3c80091',
    'mustrid/Keskmine': 'bd3b81cef5bf86c3',
    'mustrid/Raske': '7564f2bb7b4f3bdd',
    'mootuhikud-pikkused/Lihtne': '2e25e3b0e3a932a9',
    'mootuhikud-pikkused/Keskmine': 'ced50decbfdc0bf7',
    'mootuhikud-pikkused/Raske': 'e0308a047708d87f',
    'tekstulesanded': 'b8331631351ae140',
    'korrutamine': 'b8bfd863ea0b6f3b',
    'kirsi/Loendamine': 'bad34578e72b158a',
    'kirsi/Arvutamine 10 piires': 'a57c22a9680e1f34',
    'kirsi/Arvutamine 20 piires': '604b8d1660203422',
    'kirsi/Suurem või väiksem kuni 100': 'a7039083f4d6865c',
    'kirsi/Segaülesanded': '23b4a9b6dee16862',
    'kirsi/Kellaaeg': '4ce6d9d22d8cf447'
  }
};

describe('frozen maths generator versions', () => {
  it.each([MATH_GENERATOR_VERSION_V1, MATH_GENERATOR_VERSION_V2, MATH_GENERATOR_VERSION_V3, MATH_GENERATOR_VERSION_V4])('%s generates exactly what it generated', (version) => {
    expect(fingerprintSessions(version)).toEqual(FROZEN[version]);
  }, 120_000);
});
