import { addAppDays } from '@/lib/appDate';

// Child-facing Estonian sentences for the school feed ("Teisipäeval on eesti
// keele kontrolltöö."). Pure, no data access — shared by the child card and the
// parent panel.

const WEEKDAY_STEMS = ['pühapäeva', 'esmaspäeva', 'teisipäeva', 'kolmapäeva', 'neljapäeva', 'reede', 'laupäeva'];
const MONTH_STEMS = ['jaanuari', 'veebruari', 'märtsi', 'aprilli', 'mai', 'juuni', 'juuli', 'augusti', 'septembri', 'oktoobri', 'novembri', 'detsembri'];

type DayCase = 'on' | 'by'; // on = adessive ("teisipäeval"), by = translative ("teisipäevaks")

function capitalise(text: string) {
  return text ? text[0].toLocaleUpperCase('et') + text.slice(1) : text;
}

// "Täna" / "Homme" / "Teisipäeval" / "1. detsembril" (or the -ks forms).
export function dayPhrase(date: string, today: string, form: DayCase) {
  const ending = form === 'on' ? 'l' : 'ks';
  if (date === today) return form === 'on' ? 'Täna' : 'Tänaseks';
  if (date === addAppDays(today, 1)) return form === 'on' ? 'Homme' : 'Homseks';
  const at = new Date(`${date}T12:00:00Z`);
  const ahead = Math.round((at.getTime() - new Date(`${today}T12:00:00Z`).getTime()) / 86_400_000);
  if (ahead > 1 && ahead < 7) return capitalise(WEEKDAY_STEMS[at.getUTCDay()] + ending);
  return `${at.getUTCDate()}. ${MONTH_STEMS[at.getUTCMonth()]}${ending}`;
}

const GENITIVE: Record<string, string> = {
  matemaatika: 'matemaatika',
  ajalugu: 'ajaloo',
  'kehaline kasvatus': 'kehalise kasvatuse',
  'käsitöö ja kodundus': 'käsitöö ja kodunduse',
  käsitöö: 'käsitöö',
  kunst: 'kunsti',
  muusika: 'muusika',
  geograafia: 'geograafia',
  bioloogia: 'bioloogia',
  füüsika: 'füüsika',
  keemia: 'keemia',
  kirjandus: 'kirjanduse'
};

// "Eesti keel" -> "eesti keele", "Loodusõpetus" -> "loodusõpetuse"; null
// when the subject is not one we can bend safely.
export function subjectGenitive(subject: string) {
  const low = subject.trim().toLocaleLowerCase('et');
  if (GENITIVE[low]) return GENITIVE[low];
  if (/^[a-zõäöü]+ keel$/.test(low)) return `${low}e`;
  if (/^[a-zõäöü]+(õpetus|kasvatus)$/.test(low)) return `${low}e`;
  return null;
}

export type SchoolTaskLine = { date: string; subject: string; type: string; kind: 'test' | 'homework'; text: string };

// One headline per task:
//   test     -> "Teisipäeval on eesti keele kontrolltöö."
//   homework -> "Kolmapäevaks: tehnoloogiaõpetus"
export function taskHeadline(task: SchoolTaskLine, today: string) {
  if (task.kind === 'test') {
    const what = (task.type || 'kontrolltöö').toLocaleLowerCase('et');
    const genitive = subjectGenitive(task.subject);
    const day = dayPhrase(task.date, today, 'on');
    return genitive ? `${day} on ${genitive} ${what}.` : `${day} on ${what}: ${task.subject}.`;
  }
  return `${dayPhrase(task.date, today, 'by')}: ${task.subject.toLocaleLowerCase('et')}`;
}
