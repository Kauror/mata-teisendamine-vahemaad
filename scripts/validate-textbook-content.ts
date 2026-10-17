// Validate every textbook course in src/content/textbook (SPEC B12).
//
//   npm run content:validate                 all courses
//   npm run content:validate -- textbook-demo  one course
//   npm run content:validate -- --strict     also fail on warnings
//
// Exit code 1 when a course has course-level errors or a unit marked 'ready'
// is not publishable. Draft units are listed as not publishable but do not
// fail the run (they are expected to be incomplete).

import { TEXTBOOK_COURSES } from '../src/content/textbook/registry';
import { formatIssues, validateCourse } from '../src/lib/textbook/validator';
import { textbookImageExists } from '../src/lib/server/textbook/imageFiles';

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const strict = args.includes('--strict');
const wanted = args.filter((arg) => !arg.startsWith('--'));
const courses = wanted.length > 0 ? TEXTBOOK_COURSES.filter((course) => wanted.includes(course.id)) : [...TEXTBOOK_COURSES];

if (wanted.length > 0 && courses.length !== wanted.length) {
  console.error(`Tundmatu kursus: ${wanted.filter((id) => !courses.some((course) => course.id === id)).join(', ')}`);
  process.exit(2);
}

let failed = false;
for (const course of courses) {
  const result = validateCourse(course, { imageExists: (src) => textbookImageExists(src) });
  console.log(`\n${course.id} — ${course.title}${course.previewOnly ? ' [ainult eelvaade]' : ''}`);
  for (const line of formatIssues([...result.errors, ...result.warnings])) console.log(`  ${line}`);
  if (result.errors.length > 0) failed = true;
  for (const unit of result.units) {
    const source = course.units.find((item) => item.id === unit.unitId);
    const isDraft = source?.status === 'draft';
    const state = unit.publishable ? 'AVALDATAV' : isDraft ? 'MUSTAND' : 'EI OLE AVALDATAV';
    const s = unit.stats;
    const counts = isDraft && s.questions === 0
      ? ''
      : ` — ${s.lessons} teksti (${s.sections} osa, ${s.blocks} plokki), ${s.requiredObjectives}/${s.objectives} eesmärki, ${s.questions} küsimust: ${s.practiceQuestions} harjutus-, ${s.testQuestions} testiküsimust (${s.testVariantGroups} rühma; F/M/R ${s.testLevels.factual}/${s.testLevels.understanding}/${s.testLevels.application})`;
    console.log(`  ${String(unit.unitNumber).padStart(3)} ${unit.title}: ${state}${counts}`);
    const issues = isDraft && !unit.publishable && unit.errors.every((issue) => issue.code === 'unit_draft' || issue.code === 'unit_no_content')
      ? []
      : [...unit.errors, ...unit.warnings];
    for (const line of formatIssues(issues)) console.log(`      ${line}`);
    if (!isDraft && !unit.publishable) failed = true;
    if (strict && unit.warnings.length > 0 && !isDraft) failed = true;
  }
}

console.log(failed ? '\nSisu kontroll: VIGU LEITI.' : '\nSisu kontroll: korras.');
process.exit(failed ? 1 : 0);
