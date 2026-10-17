// Content validation for textbook courses (SPEC B12, A2, A3). Errors block
// publication; warnings are advice for the author and the parent. Messages are
// Estonian and written for the parent UI; `code` is stable for tests and
// tooling, `path` points into the content for authors.

import { correctResponseFor, gradeAnswer } from '@/lib/textbook/grading';
import { defaultDiagramLookup, type DiagramLookup } from '@/lib/textbook/diagramRegistry';
import { canBuildTest, retakeDiversity, testEligiblePool, type RetakeDiversity, type TestBuildability } from '@/lib/textbook/testSelection';
import {
  ANSWER_TYPES,
  COGNITIVE_LEVELS,
  CONTENT_BLOCK_TYPES,
  ID_PATTERN,
  TEXTBOOK_IMAGE_PATTERN,
  type AnswerSpec,
  type AnswerType,
  type CognitiveLevel,
  type ContentBlock,
  type Course,
  type CourseSettings,
  type LevelDistribution,
  type Question,
  type QuestionContext,
  type RichText,
  type SourceRef,
  type Unit
} from '@/lib/textbook/types';

export type ValidationSeverity = 'error' | 'warning';

export type ValidationIssue = {
  severity: ValidationSeverity;
  code: string;
  message: string;
  path?: string;
};

export type UnitStats = {
  lessons: number;
  requiredLessons: number;
  sections: number;
  blocks: number;
  objectives: number;
  requiredObjectives: number;
  questions: number;
  practiceQuestions: number;
  testQuestions: number;
  testVariantGroups: number;
  answerTypes: Record<AnswerType, number>;
  testLevels: LevelDistribution;
};

export type UnitValidation = {
  unitId: string;
  unitNumber: number;
  title: string;
  // No errors (warnings allowed) and the content status is 'ready'.
  publishable: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  stats: UnitStats;
  buildability: TestBuildability | null;
  diversity: RetakeDiversity | null;
};

export type CourseValidation = {
  courseId: string;
  // Course-level problems (settings, unit numbering). Units report their own.
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  units: UnitValidation[];
  // No course-level errors and every unit marked 'ready' is publishable.
  valid: boolean;
};

export type ValidatorOptions = {
  diagrams?: DiagramLookup;
  // Does an image block's local file exist? Only the server and the CLI can
  // look at the disk; without this the file itself is not checked.
  imageExists?: (src: string) => boolean;
};

const LEVEL_LABELS: Record<CognitiveLevel, string> = {
  factual: 'faktiteadmise',
  understanding: 'mõistmise',
  application: 'rakendamise'
};

const TYPE_LABELS: Record<AnswerType, string> = {
  single_choice: 'üks õige vastus',
  multiple_selection: 'mitu õiget vastust',
  matching: 'paaride sobitamine',
  grouping: 'rühmitamine',
  ordering: 'järjestamine',
  diagram_hotspot: 'joonisel näitamine'
};

class Collector {
  readonly errors: ValidationIssue[] = [];
  readonly warnings: ValidationIssue[] = [];
  error(code: string, message: string, path?: string) {
    this.errors.push({ severity: 'error', code, message, path });
  }
  warn(code: string, message: string, path?: string) {
    this.warnings.push({ severity: 'warning', code, message, path });
  }
}

function blank(value: unknown): boolean {
  return typeof value !== 'string' || value.trim().length === 0;
}

function richBlank(value: RichText | undefined): boolean {
  if (value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  return !Array.isArray(value) || value.length === 0 || value.every((segment) => blank(segment?.text));
}

function q(value: string) {
  return `„${value}“`;
}

function duplicates(values: readonly string[]) {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) dupes.add(value);
    seen.add(value);
  }
  return [...dupes];
}

function validUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

/* --------------------------------------------------------------- settings */

export function validateSettings(settings: CourseSettings, out: Collector = new Collector(), path = 'settings') {
  const { testLength, passNumerator, passDenominator, levelDistribution, practiceTarget } = settings;
  if (!Number.isInteger(testLength) || testLength < 1) out.error('settings_test_length', 'Testi pikkus peab olema positiivne täisarv.', `${path}.testLength`);
  if (!Number.isInteger(passNumerator) || !Number.isInteger(passDenominator) || passDenominator <= 0 || passNumerator <= 0 || passNumerator > passDenominator) {
    out.error('settings_pass_rule', 'Läbimise lävend peab olema murd, nt 95/100.', `${path}.passNumerator`);
  }
  const levels = COGNITIVE_LEVELS.map((level) => levelDistribution?.[level]);
  if (levels.some((value) => !Number.isInteger(value) || (value as number) < 0)) {
    out.error('settings_distribution', 'Küsimuste jaotus tasemete kaupa peab koosnema täisarvudest.', `${path}.levelDistribution`);
  } else if (levels.reduce((sum, value) => (sum as number) + (value as number), 0) !== testLength) {
    out.error('settings_distribution_sum', `Küsimuste jaotus tasemete kaupa peab kokku andma testi pikkuse (${testLength}).`, `${path}.levelDistribution`);
  }
  if (!Number.isInteger(practiceTarget) || practiceTarget < 1) out.error('settings_practice_target', 'Harjutuse küsimuste arv peab olema positiivne täisarv.', `${path}.practiceTarget`);
  return out;
}

/* ----------------------------------------------------------------- blocks */

function validateSources(sources: SourceRef[] | undefined, out: Collector, path: string, label: string, required: boolean) {
  if (!Array.isArray(sources) || sources.length === 0) {
    if (required) out.error('source_missing', `${label}: allikas puudub.`, path);
    else out.warn('source_missing', `${label}: allikas puudub.`, path);
    return;
  }
  sources.forEach((source, index) => validateSource(source, out, `${path}[${index}]`, label));
}

function validateSource(source: SourceRef, out: Collector, path: string, label: string) {
  if (source.kind !== 'textbook' && source.kind !== 'supplementary') {
    out.error('source_kind', `${label}: allika liik peab olema õpik või lisamaterjal.`, path);
    return;
  }
  if (source.url !== undefined && !validUrl(source.url)) out.error('source_url', `${label}: allika aadress peab algama https://.`, path);
  if (source.kind === 'supplementary' && !source.url && blank(source.attribution)) {
    out.warn('source_supplementary_unattributed', `${label}: lisamaterjali allikal puudub aadress või autor.`, path);
  }
}

function validateBlock(block: ContentBlock, out: Collector, path: string, diagrams: DiagramLookup, imageExists?: (src: string) => boolean) {
  const label = `Plokk ${q(block.id ?? '?')}`;
  if (!CONTENT_BLOCK_TYPES.includes(block.type)) {
    out.error('block_type', `${label}: tundmatu sisuploki liik ${q(String((block as { type?: unknown }).type))}.`, path);
    return;
  }
  if (block.source) validateSource(block.source, out, `${path}.source`, label);
  switch (block.type) {
    case 'heading':
    case 'caption':
      if (blank(block.text)) out.error('block_empty', `${label}: tekst puudub.`, path);
      break;
    case 'paragraph':
      if (richBlank(block.text)) out.error('block_empty', `${label}: lõigu tekst puudub.`, path);
      break;
    case 'list':
      if (!Array.isArray(block.items) || block.items.length === 0 || block.items.some((item) => richBlank(item))) out.error('block_empty', `${label}: loetelus on tühi punkt või punktid puuduvad.`, path);
      break;
    case 'definition':
      if (blank(block.term) || richBlank(block.definition)) out.error('block_empty', `${label}: mõiste või selle seletus puudub.`, path);
      break;
    case 'keyFact':
      if (!Array.isArray(block.items) || block.items.length === 0 || block.items.some((item) => richBlank(item))) out.error('block_empty', `${label}: „Jäta meelde!“ kast on tühi.`, path);
      break;
    case 'comparison':
      if (!Array.isArray(block.columns) || block.columns.length < 2) out.error('block_comparison', `${label}: võrdluses peab olema vähemalt kaks veergu.`, path);
      else if (block.columns.some((column) => blank(column.heading) || !Array.isArray(column.points) || column.points.length === 0 || column.points.some((point) => richBlank(point)))) {
        out.error('block_empty', `${label}: võrdluse veerul puudub pealkiri või sisu.`, path);
      }
      break;
    case 'table':
      validateTable(block.headers, block.rows, out, path, label);
      break;
    case 'diagram':
      if (!diagrams(block.diagramId)) out.error('diagram_unknown', `${label}: joonist ${q(block.diagramId)} ei ole joonisteregistris.`, path);
      break;
    case 'image':
      if (blank(block.src) || !TEXTBOOK_IMAGE_PATTERN.test(block.src)) {
        out.error('block_image_src', `${label}: pilt peab olema rakenduse oma kaustas /textbook-images/ (nt /textbook-images/nimi.webp).`, path);
      } else if (imageExists && !imageExists(block.src)) {
        out.error('block_image_missing', `${label}: pildifaili ${q(block.src)} ei leitud kaustast public/.`, path);
      }
      if (blank(block.alt) || block.alt.trim().length < 10) out.error('block_image_alt', `${label}: pildil peab olema sisukas eestikeelne kirjeldus (alt-tekst).`, path);
      if (blank(block.credit)) out.error('block_image_credit', `${label}: pildi autor või allikas puudub.`, path);
      if (!Number.isInteger(block.width) || !Number.isInteger(block.height) || block.width < 1 || block.height < 1) out.error('block_image_size', `${label}: pildi laius ja kõrgus peavad olema positiivsed täisarvud.`, path);
      if (block.caption !== undefined && blank(block.caption)) out.error('block_empty', `${label}: pildiallkiri on tühi.`, path);
      break;
    case 'externalResource':
      if (blank(block.title) || blank(block.intro) || blank(block.publisher)) out.error('block_resource_fields', `${label}: välisallika pealkiri, tutvustus või väljaandja puudub.`, path);
      if (!validUrl(block.url)) out.error('block_resource_url', `${label}: välisallika aadress peab olema kehtiv https:// aadress.`, path);
      if (!['article', 'gallery', 'video', 'interactive'].includes(block.resourceType)) out.error('block_resource_type', `${label}: tundmatu välisallika liik.`, path);
      break;
    case 'enrichment':
      if (block.variant !== 'extra' && block.variant !== 'fun_fact') out.error('block_enrichment_variant', `${label}: lisateadmise liik peab olema „extra“ või „fun_fact“.`, path);
      if (!Array.isArray(block.body) || block.body.length === 0 || block.body.some((item) => richBlank(item))) out.error('block_empty', `${label}: lisateadmise tekst puudub.`, path);
      break;
  }
}

function validateTable(headers: string[], rows: string[][], out: Collector, path: string, label: string) {
  if (!Array.isArray(headers) || headers.length === 0 || headers.some((header) => blank(header))) {
    out.error('table_headers', `${label}: tabeli päis puudub või on tühi.`, path);
    return;
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    out.error('table_rows', `${label}: tabelis ei ole ridu.`, path);
    return;
  }
  rows.forEach((row, index) => {
    if (!Array.isArray(row) || row.length !== headers.length) out.error('table_shape', `${label}: tabeli ${index + 1}. reas peab olema ${headers.length} lahtrit.`, `${path}.rows[${index}]`);
  });
}

/* -------------------------------------------------------------- questions */

function validateContext(context: QuestionContext, out: Collector, path: string, label: string, diagrams: DiagramLookup) {
  switch (context.kind) {
    case 'text':
      if (!Array.isArray(context.paragraphs) || context.paragraphs.length === 0 || context.paragraphs.some((item) => richBlank(item))) out.error('context_empty', `${label}: lisatekst on tühi.`, path);
      break;
    case 'table':
      validateTable(context.headers, context.rows, out, path, label);
      break;
    case 'diagram':
      if (!diagrams(context.diagramId)) out.error('diagram_unknown', `${label}: joonist ${q(context.diagramId)} ei ole joonisteregistris.`, path);
      break;
    default:
      out.error('context_kind', `${label}: tundmatu lisamaterjali liik.`, path);
  }
}

function validateItems(items: Array<{ id: string; text: string }> | undefined, out: Collector, path: string, label: string, what: string, min: number) {
  if (!Array.isArray(items) || items.length < min) {
    out.error('answer_too_few', `${label}: vaja on vähemalt ${min} ${what}.`, path);
    return [];
  }
  const ids = items.map((item) => item.id);
  for (const id of duplicates(ids)) out.error('answer_duplicate_id', `${label}: tunnus ${q(id)} kordub.`, path);
  if (items.some((item) => blank(item.id) || !ID_PATTERN.test(item.id))) out.error('answer_id_invalid', `${label}: valikute tunnused peavad olema väikesed ladina tähed, numbrid või sidekriipsud.`, path);
  if (items.some((item) => blank(item.text))) out.error('answer_text_missing', `${label}: mõne valiku tekst puudub.`, path);
  const texts = items.map((item) => (item.text ?? '').trim().toLocaleLowerCase('et'));
  if (duplicates(texts).length > 0) out.error('answer_duplicate_text', `${label}: kaks valikut on sama tekstiga.`, path);
  return ids;
}

function validateAnswer(answer: AnswerSpec, out: Collector, path: string, label: string, diagrams: DiagramLookup) {
  if (!answer || !ANSWER_TYPES.includes(answer.type)) {
    out.error('answer_type', `${label}: vastuse liik peab olema üks kuuest lubatud liigist.`, path);
    return false;
  }
  const before = out.errors.length;
  switch (answer.type) {
    case 'single_choice': {
      const ids = validateItems(answer.options, out, `${path}.options`, label, 'vastusevarianti', 2);
      if (!ids.includes(answer.correctOptionId)) out.error('answer_key', `${label}: õige vastus ${q(String(answer.correctOptionId))} ei ole valikute hulgas.`, path);
      break;
    }
    case 'multiple_selection': {
      const ids = validateItems(answer.options, out, `${path}.options`, label, 'vastusevarianti', 3);
      const correct = Array.isArray(answer.correctOptionIds) ? answer.correctOptionIds : [];
      if (correct.length === 0) out.error('answer_key', `${label}: õiged vastused puuduvad.`, path);
      if (duplicates(correct).length > 0) out.error('answer_key', `${label}: õige vastus kordub.`, path);
      if (correct.some((id) => !ids.includes(id))) out.error('answer_key', `${label}: mõni õige vastus ei ole valikute hulgas.`, path);
      if (ids.length > 0 && new Set(correct).size >= ids.length) out.error('answer_key', `${label}: kõik valikud ei tohi olla õiged.`, path);
      break;
    }
    case 'matching': {
      const prompts = validateItems(answer.prompts, out, `${path}.prompts`, label, 'paari vasakut poolt', 2);
      const choices = validateItems(answer.choices, out, `${path}.choices`, label, 'paari paremat poolt', 2);
      for (const id of prompts.filter((id) => choices.includes(id))) out.error('answer_duplicate_id', `${label}: tunnus ${q(id)} on mõlemal poolel.`, path);
      if (choices.length < prompts.length) out.error('answer_too_few', `${label}: paremal peab olema vähemalt sama palju valikuid kui vasakul.`, path);
      const pairs = answer.correctPairs && typeof answer.correctPairs === 'object' ? answer.correctPairs : {};
      for (const prompt of prompts) if (!(prompt in pairs)) out.error('answer_key', `${label}: vasaku poole ${q(prompt)} paariline puudub.`, path);
      for (const [prompt, choice] of Object.entries(pairs)) {
        if (!prompts.includes(prompt)) out.error('answer_key', `${label}: võtmes on tundmatu vasak pool ${q(prompt)}.`, path);
        if (!choices.includes(choice)) out.error('answer_key', `${label}: võtmes on tundmatu parem pool ${q(choice)}.`, path);
      }
      if (duplicates(Object.values(pairs)).length > 0) out.error('answer_key', `${label}: sama parema poole valikut kasutatakse võtmes mitu korda.`, path);
      break;
    }
    case 'grouping': {
      const groups = validateItems(answer.groups, out, `${path}.groups`, label, 'rühma', 2);
      const items = validateItems(answer.items, out, `${path}.items`, label, 'rühmitatavat asja', 2);
      for (const id of groups.filter((id) => items.includes(id))) out.error('answer_duplicate_id', `${label}: tunnus ${q(id)} on nii rühm kui ka asi.`, path);
      const map = answer.correctGroupByItem && typeof answer.correctGroupByItem === 'object' ? answer.correctGroupByItem : {};
      for (const item of items) if (!(item in map)) out.error('answer_key', `${label}: asjale ${q(item)} pole rühma määratud.`, path);
      for (const [item, group] of Object.entries(map)) {
        if (!items.includes(item)) out.error('answer_key', `${label}: võtmes on tundmatu asi ${q(item)}.`, path);
        if (!groups.includes(group)) out.error('answer_key', `${label}: võtmes on tundmatu rühm ${q(group)}.`, path);
      }
      const usedGroups = new Set(Object.values(map));
      if (groups.some((group) => !usedGroups.has(group))) out.warn('answer_empty_group', `${label}: mõnda rühma ei kuulu ühtegi asja.`, path);
      break;
    }
    case 'ordering': {
      const items = validateItems(answer.items, out, `${path}.items`, label, 'järjestatavat asja', 3);
      const order = Array.isArray(answer.correctOrder) ? answer.correctOrder : [];
      if (order.length !== items.length || duplicates(order).length > 0 || order.some((id) => !items.includes(id))) {
        out.error('answer_key', `${label}: õige järjestus peab sisaldama iga asja täpselt üks kord.`, path);
      }
      break;
    }
    case 'diagram_hotspot': {
      const diagram = diagrams(answer.diagramId);
      if (!diagram) {
        out.error('diagram_unknown', `${label}: joonist ${q(answer.diagramId)} ei ole joonisteregistris.`, path);
        break;
      }
      const known = diagram.regions.map((region) => region.id);
      const regions = answer.regionIds && answer.regionIds.length > 0 ? answer.regionIds : known;
      if (answer.regionIds && answer.regionIds.some((id) => !known.includes(id))) out.error('answer_region_unknown', `${label}: joonisel ${q(diagram.id)} pole mõnda valitud piirkonda.`, path);
      if (duplicates(regions).length > 0) out.error('answer_duplicate_id', `${label}: piirkond kordub.`, path);
      if (regions.length < 2) out.error('answer_too_few', `${label}: joonisel peab olema vähemalt kaks valitavat piirkonda.`, path);
      if (!regions.includes(answer.correctRegionId)) out.error('answer_key', `${label}: õige piirkond ${q(String(answer.correctRegionId))} ei ole valitavate piirkondade hulgas.`, path);
      break;
    }
  }
  return out.errors.length === before;
}

function validateQuestion(question: Question, unit: Unit, objectiveIds: Set<string>, out: Collector, path: string, diagrams: DiagramLookup) {
  const label = `Küsimus ${q(question.id ?? '?')}`;
  if (blank(question.id) || !ID_PATTERN.test(question.id)) out.error('question_id_invalid', `${label}: tunnus peab koosnema väikestest ladina tähtedest, numbritest ja sidekriipsudest.`, path);
  if (question.unitId !== unit.id) out.error('question_unit', `${label}: küsimus kuulub teise õppetükki (${q(String(question.unitId))}).`, path);
  if (blank(question.stem)) out.error('question_stem', `${label}: küsimuse tekst puudub.`, path);
  if (!objectiveIds.has(question.primaryObjectiveId)) out.error('question_objective', `${label}: põhiline õpieesmärk ${q(String(question.primaryObjectiveId))} puudub selle õppetüki eesmärkide seast.`, path);
  for (const related of question.relatedObjectiveIds ?? []) {
    if (!objectiveIds.has(related)) out.error('question_related_objective', `${label}: seotud õpieesmärk ${q(related)} puudub.`, path);
    if (related === question.primaryObjectiveId) out.warn('question_related_is_primary', `${label}: seotud eesmärk kordab põhieesmärki.`, path);
  }
  if (blank(question.variantGroupId) || !ID_PATTERN.test(question.variantGroupId)) out.error('question_variant_group', `${label}: variandirühm puudub või selle tunnus on vigane.`, path);
  if (!COGNITIVE_LEVELS.includes(question.cognitiveLevel)) out.error('question_level', `${label}: tundmatu raskustase (faktiteadmine, mõistmine või rakendamine).`, path);
  if (![1, 2, 3].includes(question.difficulty)) out.error('question_difficulty', `${label}: raskus peab olema 1, 2 või 3.`, path);
  if (!question.eligibility || (!question.eligibility.practice && !question.eligibility.test)) out.error('question_eligibility', `${label}: küsimus peab sobima harjutusse, testi või mõlemasse.`, path);
  if (blank(question.explanation)) out.error('question_explanation', `${label}: selgitus puudub.`, path);
  validateSources(question.sources, out, `${path}.sources`, label, true);
  if (question.context) validateContext(question.context, out, `${path}.context`, label, diagrams);
  const answerValid = validateAnswer(question.answer, out, `${path}.answer`, label, diagrams);
  // Self-check: the key, as a response, must grade correct.
  if (answerValid && !gradeAnswer(question, correctResponseFor(question.answer)).correct) {
    out.error('answer_key_selfcheck', `${label}: vastusevõti ei hinda iseennast õigeks.`, path);
  }
}

/* ------------------------------------------------------------------ units */

function emptyStats(): UnitStats {
  return {
    lessons: 0,
    requiredLessons: 0,
    sections: 0,
    blocks: 0,
    objectives: 0,
    requiredObjectives: 0,
    questions: 0,
    practiceQuestions: 0,
    testQuestions: 0,
    testVariantGroups: 0,
    answerTypes: { single_choice: 0, multiple_selection: 0, matching: 0, grouping: 0, ordering: 0, diagram_hotspot: 0 },
    testLevels: { factual: 0, understanding: 0, application: 0 }
  };
}

function buildabilityMessage(result: Exclude<TestBuildability, { ok: true }>, settings: CourseSettings, unit: Unit): string {
  const n = settings.testLength;
  switch (result.reason) {
    case 'too_few_questions':
      return `Testi ei saa koostada: testi sobivaid küsimusi on ${result.testEligibleQuestions}, vaja on vähemalt ${n}.`;
    case 'too_few_groups':
      return `Testi ei saa koostada: testi sobivaid küsimusi on vaid ${result.distinctGroups} erinevas variandirühmas, vaja on vähemalt ${n}.`;
    case 'bad_distribution':
      return 'Testi ei saa koostada: küsimuste jaotus tasemete kaupa ei vasta testi pikkusele.';
    case 'too_many_objectives':
      return `Testi ei saa koostada: kohustuslikke õpieesmärke on rohkem kui testis küsimusi (${n}).`;
    case 'objective_coverage': {
      const names = result.uncoveredObjectiveIds.map((id) => unit.objectives.find((objective) => objective.id === id)?.description ?? id);
      return `Testi ei saa koostada nii, et iga kohustuslik õpieesmärk oleks kaetud. Katmata: ${names.map(q).join(', ')}.`;
    }
    case 'level_quota': {
      const quota = settings.levelDistribution;
      const short = COGNITIVE_LEVELS.filter((level) => (result.levelCounts?.[level] ?? 0) < quota[level])
        .map((level) => `${LEVEL_LABELS[level]} küsimusi on ${result.levelCounts?.[level] ?? 0}, vaja ${quota[level]}`);
      return `Testi ei saa koostada nõutud tasemejaotusega (${quota.factual}/${quota.understanding}/${quota.application}) erinevatest variandirühmadest${short.length ? `: ${short.join('; ')}` : ''}.`;
    }
    case 'search_limit':
      return 'Testi koostamist ei õnnestunud kontrollida (küsimuste kogu on liiga keeruline). Lisa erinevaid variandirühmi.';
  }
}

// Validate one unit. `course` supplies the settings and the other units (for
// course-wide question ID uniqueness).
export function validateUnit(unit: Unit, course: Pick<Course, 'id' | 'settings' | 'units'>, options: ValidatorOptions = {}): UnitValidation {
  const diagrams = options.diagrams ?? defaultDiagramLookup;
  const imageExists = options.imageExists;
  const out = new Collector();
  const settings = course.settings;
  const stats = emptyStats();
  const label = `Õppetükk ${unit.number}`;
  const result = (buildability: TestBuildability | null, diversity: RetakeDiversity | null): UnitValidation => ({
    unitId: unit.id,
    unitNumber: unit.number,
    title: unit.title,
    publishable: out.errors.length === 0 && unit.status === 'ready',
    errors: out.errors,
    warnings: out.warnings,
    stats,
    buildability,
    diversity
  });

  if (blank(unit.id) || !ID_PATTERN.test(unit.id)) out.error('unit_id_invalid', `${label}: tunnus peab koosnema väikestest ladina tähtedest, numbritest ja sidekriipsudest.`, 'id');
  if (unit.courseId !== course.id) out.error('unit_course', `${label}: kursuse tunnus ei klapi (${q(String(unit.courseId))}).`, 'courseId');
  if (!Number.isInteger(unit.number) || unit.number < 1) out.error('unit_number', `${label}: number peab olema positiivne täisarv.`, 'number');
  if (blank(unit.title)) out.error('unit_title', `${label}: pealkiri puudub.`, 'title');
  if (blank(unit.contentVersion)) out.error('unit_content_version', `${label}: sisu versioon puudub.`, 'contentVersion');
  if (unit.pages && (!Number.isInteger(unit.pages.from) || !Number.isInteger(unit.pages.to) || unit.pages.from > unit.pages.to)) out.error('unit_pages', `${label}: leheküljed on vigased.`, 'pages');

  const lessons = Array.isArray(unit.lessons) ? unit.lessons : [];
  const objectives = Array.isArray(unit.objectives) ? unit.objectives : [];
  const questions = Array.isArray(unit.questions) ? unit.questions : [];

  if (unit.status === 'draft') out.error('unit_draft', `${label} on alles mustand: sisu ei ole valmis ja seda ei saa avaldada.`, 'status');
  else if (unit.status !== 'ready') out.error('unit_status', `${label}: tundmatu sisu olek.`, 'status');
  if (lessons.length === 0 && objectives.length === 0 && questions.length === 0) {
    out.error('unit_no_content', `${label}: õppetükil pole veel tekste, õpieesmärke ega küsimusi.`);
    return result(null, null);
  }

  /* objectives */
  stats.objectives = objectives.length;
  stats.requiredObjectives = objectives.filter((objective) => objective.required).length;
  if (objectives.length === 0) out.error('unit_no_objectives', `${label}: õpieesmärgid puuduvad.`, 'objectives');
  else if (stats.requiredObjectives === 0) out.error('unit_no_required_objective', `${label}: ükski õpieesmärk ei ole kohustuslik.`, 'objectives');
  for (const id of duplicates(objectives.map((objective) => objective.id))) out.error('objective_duplicate', `${label}: õpieesmärgi tunnus ${q(id)} kordub.`, 'objectives');
  objectives.forEach((objective, index) => {
    const path = `objectives[${index}]`;
    const objectiveLabel = `Õpieesmärk ${q(objective.id ?? '?')}`;
    if (blank(objective.id) || !ID_PATTERN.test(objective.id)) out.error('objective_id_invalid', `${objectiveLabel}: tunnus on vigane.`, path);
    if (blank(objective.description)) out.error('objective_description', `${objectiveLabel}: kirjeldus puudub.`, path);
    validateSources(objective.sources, out, `${path}.sources`, objectiveLabel, false);
  });
  const objectiveIds = new Set(objectives.map((objective) => objective.id));

  /* lessons */
  stats.lessons = lessons.length;
  stats.requiredLessons = lessons.filter((lesson) => lesson.required).length;
  if (lessons.length === 0) out.error('unit_no_lessons', `${label}: lugemistekstid puuduvad.`, 'lessons');
  else if (stats.requiredLessons === 0) out.error('unit_no_required_lesson', `${label}: ükski lugemistekst ei ole kohustuslik.`, 'lessons');
  for (const id of duplicates(lessons.map((lesson) => lesson.id))) out.error('lesson_duplicate', `${label}: lugemisteksti tunnus ${q(id)} kordub.`, 'lessons');
  for (const order of duplicates(lessons.map((lesson) => String(lesson.order)))) out.error('lesson_order_duplicate', `${label}: kahel lugemistekstil on sama järjekorranumber (${order}).`, 'lessons');
  const blockIds: string[] = [];
  const sectionIds: string[] = [];
  const taught = new Set<string>();
  lessons.forEach((lesson, lessonIndex) => {
    const path = `lessons[${lessonIndex}]`;
    const lessonLabel = `Lugemistekst ${q(lesson.id ?? '?')}`;
    if (blank(lesson.id) || !ID_PATTERN.test(lesson.id)) out.error('lesson_id_invalid', `${lessonLabel}: tunnus on vigane.`, path);
    if (blank(lesson.title)) out.error('lesson_title', `${lessonLabel}: pealkiri puudub.`, path);
    if (!Number.isInteger(lesson.order) || lesson.order < 1) out.error('lesson_order', `${lessonLabel}: järjekorranumber peab olema positiivne täisarv.`, path);
    for (const id of lesson.objectiveIds ?? []) {
      if (!objectiveIds.has(id)) out.error('lesson_objective', `${lessonLabel}: õpieesmärki ${q(id)} ei ole.`, path);
      if (lesson.required) taught.add(id);
    }
    if (!Array.isArray(lesson.sections) || lesson.sections.length === 0) {
      out.error('lesson_no_sections', `${lessonLabel}: tekstis pole ühtegi osa.`, path);
      return;
    }
    lesson.sections.forEach((section, sectionIndex) => {
      const sectionPath = `${path}.sections[${sectionIndex}]`;
      sectionIds.push(section.id);
      stats.sections += 1;
      if (blank(section.id) || !ID_PATTERN.test(section.id)) out.error('section_id_invalid', `${lessonLabel}: osa tunnus on vigane.`, sectionPath);
      if (!Array.isArray(section.blocks) || section.blocks.length === 0) {
        out.error('section_empty', `${lessonLabel}: osa ${q(section.id ?? '?')} on tühi.`, sectionPath);
        return;
      }
      section.blocks.forEach((block, blockIndex) => {
        blockIds.push(block.id);
        stats.blocks += 1;
        const blockPath = `${sectionPath}.blocks[${blockIndex}]`;
        if (blank(block.id) || !ID_PATTERN.test(block.id)) out.error('block_id_invalid', `${lessonLabel}: sisuploki tunnus on vigane.`, blockPath);
        validateBlock(block, out, blockPath, diagrams, imageExists);
      });
    });
  });
  for (const id of duplicates(sectionIds)) out.error('section_duplicate', `${label}: teksti osa tunnus ${q(id)} kordub.`, 'lessons');
  for (const id of duplicates(blockIds)) out.error('block_duplicate', `${label}: sisuploki tunnus ${q(id)} kordub.`, 'lessons');
  for (const objective of objectives) {
    if (objective.required && !taught.has(objective.id)) out.warn('objective_not_taught', `Õpieesmärk ${q(objective.description || objective.id)} ei ole seotud ühegi kohustusliku lugemistekstiga.`, 'objectives');
  }

  /* questions */
  stats.questions = questions.length;
  if (questions.length === 0) out.error('unit_no_questions', `${label}: küsimused puuduvad.`, 'questions');
  for (const id of duplicates(questions.map((question) => question.id))) out.error('question_duplicate', `${label}: küsimuse tunnus ${q(id)} kordub.`, 'questions');
  const otherIds = new Set(course.units.filter((other) => other.id !== unit.id).flatMap((other) => (other.questions ?? []).map((question) => question.id)));
  for (const question of questions) if (otherIds.has(question.id)) out.error('question_duplicate_course', `Küsimuse tunnus ${q(question.id)} on kasutusel ka teises õppetükis.`, 'questions');
  questions.forEach((question, index) => validateQuestion(question, unit, objectiveIds, out, `questions[${index}]`, diagrams));
  for (const stem of duplicates(questions.map((question) => (question.stem ?? '').trim().toLocaleLowerCase('et')).filter(Boolean))) {
    out.warn('question_duplicate_stem', `Mitmel küsimusel on sama tekst: ${q(stem)}. Kontrolli, et need poleks lihtsalt ümbersõnastused.`, 'questions');
  }

  for (const question of questions) {
    if (ANSWER_TYPES.includes(question.answer?.type)) stats.answerTypes[question.answer.type] += 1;
    if (question.eligibility?.practice) stats.practiceQuestions += 1;
  }
  const testPool = testEligiblePool(questions);
  stats.testQuestions = testPool.length;
  stats.testVariantGroups = new Set(testPool.map((question) => question.variantGroupId)).size;
  for (const question of testPool) if (COGNITIVE_LEVELS.includes(question.cognitiveLevel)) stats.testLevels[question.cognitiveLevel] += 1;

  /* practice coverage (A3) */
  for (const objective of objectives.filter((item) => item.required)) {
    const count = questions.filter((question) => question.eligibility?.practice && question.primaryObjectiveId === objective.id).length;
    if (count < 2) out.error('practice_objective_coverage', `Õpieesmärgil ${q(objective.description || objective.id)} on ${count} harjutusküsimust, vaja on vähemalt 2 (et vale vastuse järel saaks küsida teise küsimuse).`, 'questions');
  }
  if (stats.practiceQuestions < settings.practiceTarget) out.warn('practice_small', `Harjutusküsimusi on ${stats.practiceQuestions}, soovitatav on vähemalt ${settings.practiceTarget}.`, 'questions');

  const usedTypes = ANSWER_TYPES.filter((type) => stats.answerTypes[type] > 0);
  if (questions.length > 0 && usedTypes.length < 3) out.warn('answer_type_variety', `Küsimustes on kasutusel ainult ${usedTypes.map((type) => TYPE_LABELS[type]).join(', ')}. Mitmekesisuse jaoks kasuta vähemalt kolme vastuse liiki.`, 'questions');

  /* settings (course-level errors are reported by validateCourse) */
  const settingsCheck = validateSettings(settings);
  if (settingsCheck.errors.length > 0) {
    out.error('settings_invalid', 'Kursuse seaded on vigased, testi ei saa koostada.', 'settings');
    return result(null, null);
  }

  /* test buildability (A2) */
  const buildability = canBuildTest({ ...unit, objectives, questions }, settings);
  if (!buildability.ok) out.error(`test_${buildability.reason}`, buildabilityMessage(buildability, settings, unit), 'questions');
  let diversity: RetakeDiversity | null = null;
  if (buildability.ok) {
    diversity = retakeDiversity({ ...unit, objectives, questions }, settings);
    if (!diversity.sufficient) {
      const thin = Object.entries(diversity.groupsPerObjective).filter(([, count]) => count < 2)
        .map(([id]) => objectives.find((objective) => objective.id === id)?.description ?? id);
      const parts = [`Kordustestid tulevad sarnased: testi sobivaid variandirühmi on ${diversity.distinctGroups}, soovitatav on vähemalt ${diversity.recommendedGroups}.`];
      if (thin.length > 0) parts.push(`Ainult ühe variandirühmaga õpieesmärgid: ${thin.map(q).join(', ')}.`);
      parts.push(`Teises testis korduks ${diversity.secondAttemptOverlap} rühma esimesest.`);
      out.warn('retake_diversity', parts.join(' '), 'questions');
    }
  }
  return result(buildability, diversity);
}

// The parent UI's question: may this unit be published, and if not, why.
export const publishable = validateUnit;

// Validate a whole course: settings, unit order and numbering, then each unit.
export function validateCourse(course: Course, options: ValidatorOptions = {}): CourseValidation {
  const out = new Collector();
  const label = `Kursus ${q(course.id ?? '?')}`;
  if (blank(course.id) || !ID_PATTERN.test(course.id)) out.error('course_id_invalid', `${label}: tunnus on vigane.`, 'id');
  if (blank(course.title)) out.error('course_title', `${label}: pealkiri puudub.`, 'title');
  if (!course.previewOnly && (!Array.isArray(course.learners) || course.learners.length === 0)) out.error('course_learners', `${label}: õppija puudub.`, 'learners');
  if (course.previewOnly && course.learners.length > 0) out.error('course_preview_learners', `${label}: ainult eelvaate kursust ei tohi näidata ühelegi lapsele.`, 'learners');
  validateSettings(course.settings, out);
  const units = Array.isArray(course.units) ? course.units : [];
  for (const id of duplicates(units.map((unit) => unit.id))) out.error('unit_duplicate', `${label}: õppetüki tunnus ${q(id)} kordub.`, 'units');
  for (const number of duplicates(units.map((unit) => String(unit.number)))) out.error('unit_number_duplicate', `${label}: õppetüki number ${number} kordub.`, 'units');
  for (let index = 1; index < units.length; index++) {
    if (units[index].number <= units[index - 1].number) {
      out.error('unit_order', `${label}: õppetükid peavad olema numbrite järjekorras (${units[index - 1].number} → ${units[index].number}).`, `units[${index}]`);
    }
  }
  const unitResults = units.map((unit) => validateUnit(unit, course, options));
  return {
    courseId: course.id,
    errors: out.errors,
    warnings: out.warnings,
    units: unitResults,
    valid: out.errors.length === 0 && unitResults.every((unit) => unit.publishable || units.find((item) => item.id === unit.unitId)?.status === 'draft')
  };
}

// One line per problem, for the CLI and the parent UI.
export function formatIssues(issues: readonly ValidationIssue[]): string[] {
  return issues.map((issue) => `${issue.severity === 'error' ? 'VIGA' : 'HOIATUS'} [${issue.code}] ${issue.message}${issue.path ? ` (${issue.path})` : ''}`);
}
