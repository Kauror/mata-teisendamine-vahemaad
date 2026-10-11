import { randomUUID } from 'node:crypto';
import db from '@/lib/db';
import { ensureCurrentRewardPolicy } from '@/lib/server/rewards/policy';
import { applyRewardProjectionV2 } from '@/lib/server/rewards/projection';
import { recordDailyLeaderboard } from '@/lib/leaderboard';
import { isoToAppDate } from '@/lib/appDate';
import { advanceVocabularyState, makeVocabularyState, type VocabularyMode, type VocabularyAction, type VocabularyState, type VocabularyWord } from '@/lib/englishUnits';

type UnitRow = { id: string; unitNumber: number; title: string; published: number; manuallyUnlocked: number };
type ProgressRow = { studyCompletedAt: string | null; testPassedAt: string | null; studyFirstKnown: number | null; firstTestScore: number | null; firstTestTotal: number | null; lastTestScore: number | null; lastTestTotal: number | null; testRuns: number };
type WordRow = { id: string; estonian: string; english: string; pronunciation: string; acceptedJson: string };
type SessionRow = { id: string; unitId: string; mode: VocabularyMode; stateJson: string; revision: number; completedAt: string | null };
export class VocabularyError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
function unitRow(id: string): UnitRow {
  const row = db.prepare('SELECT * FROM english_units WHERE id = ?').get(id) as UnitRow | undefined;
  if (!row) throw new VocabularyError('Õppetükki ei leitud.', 404);
  return row;
}
function unitWords(id: string): VocabularyWord[] {
  const rows = db.prepare('SELECT * FROM english_unit_words WHERE unitId = ? ORDER BY position').all(id) as WordRow[];
  return rows.map((word) => ({ id: word.id, estonian: word.estonian, english: word.english, pronunciation: word.pronunciation, acceptedAnswers: JSON.parse(word.acceptedJson) as string[] }));
}
function progress(id: string): ProgressRow | undefined {
  return db.prepare("SELECT * FROM english_unit_progress WHERE learner = 'kiur' AND unitId = ?").get(id) as ProgressRow | undefined;
}
function accessible(row: UnitRow): boolean {
  if (!row.published) return false;
  if (row.manuallyUnlocked || row.unitNumber === 1) return true;
  const previous = db.prepare('SELECT id FROM english_units WHERE published = 1 AND unitNumber < ? ORDER BY unitNumber DESC LIMIT 1').get(row.unitNumber) as {id:string} | undefined;
  return Boolean(previous && progress(previous.id)?.testPassedAt);
}
export function listEnglishUnits(parent = false) {
  const rows = db.prepare('SELECT * FROM english_units ORDER BY unitNumber').all() as UnitRow[];
  return rows.filter((row) => parent || row.published).map((row) => {
    const words = db.prepare('SELECT COUNT(*) AS count FROM english_unit_words WHERE unitId = ?').get(row.id) as {count:number};
    const state = progress(row.id);
    const weak = db.prepare("SELECT COUNT(*) AS count FROM english_word_stats s JOIN english_unit_words w ON w.id=s.wordId WHERE s.learner='kiur' AND w.unitId=? AND s.needsPractice=1").get(row.id) as {count:number};
    return { ...row, available: accessible(row), wordCount: words.count, weakCount: weak.count,
      studyCompletedAt: state?.studyCompletedAt ?? null, testPassedAt: state?.testPassedAt ?? null,
      studyFirstKnown: state?.studyFirstKnown ?? null, firstTestScore: state?.firstTestScore ?? null, firstTestTotal: state?.firstTestTotal ?? null,
      lastTestScore: state?.lastTestScore ?? null, lastTestTotal: state?.lastTestTotal ?? null, testRuns: state?.testRuns ?? 0 };
  });
}
export function updateEnglishUnit(input: {unitNumber: number; title: string; published: boolean; manuallyUnlocked: boolean}) {
  if (!Number.isInteger(input.unitNumber) || input.unitNumber < 1 || input.unitNumber > 999 || typeof input.title !== 'string' || input.title.trim().length < 1 || input.title.length > 100) throw new VocabularyError('Õppetüki number või pealkiri on vigane.');
  if (typeof input.published !== 'boolean' || typeof input.manuallyUnlocked !== 'boolean') throw new VocabularyError('Seaded on vigased.');
  const id = 'unit-' + input.unitNumber;
  const now = new Date().toISOString();
  db.prepare(`INSERT INTO english_units(id,unitNumber,title,published,manuallyUnlocked,createdAt,updatedAt) VALUES(?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET title=excluded.title,published=excluded.published,manuallyUnlocked=excluded.manuallyUnlocked,updatedAt=excluded.updatedAt`)
    .run(id,input.unitNumber,input.title.trim(),input.published?1:0,input.manuallyUnlocked?1:0,now,now);
  return id;
}
// The import API accepts parsed Excel rows; no textbook data is invented here.
// Updating a unit with attempts is deliberately rejected to preserve score history.
export function replaceEnglishWords(unitId:string, words: Array<{estonian:string;english:string;pronunciation?:string;acceptedAnswers?:string[]}>) {
  unitRow(unitId);
  if (!Array.isArray(words) || words.length < 1 || words.length > 500) throw new VocabularyError('Lisa 1–500 sõna.');
  const sessions = db.prepare('SELECT COUNT(*) AS count FROM english_unit_sessions WHERE unitId=?').get(unitId) as {count:number};
  if (sessions.count) throw new VocabularyError('Õppetükki on juba harjutatud. Sõnade muutmiseks on vaja eraldi versioonihaldust.');
  const normalized = words.map((word, i) => {
    if (!word || typeof word.estonian !== 'string' || typeof word.english !== 'string' || word.estonian.trim().length < 1 || word.english.trim().length < 1 ||
        word.estonian.length > 150 || word.english.length > 150 || (word.pronunciation != null && (typeof word.pronunciation !== 'string' || word.pronunciation.length > 160)) ||
        !Array.isArray(word.acceptedAnswers ?? []) || (word.acceptedAnswers ?? []).some((item) => typeof item !== 'string' || item.length > 150)) {
      throw new VocabularyError('Vigane sõna real ' + (i + 1));
    }
    return { id: unitId + '-word-' + (i + 1), et:word.estonian.trim(), en:word.english.trim(), ipa:word.pronunciation?.trim() ?? '', accepted:JSON.stringify(word.acceptedAnswers ?? []) };
  });
  db.transaction(() => {
    db.prepare('DELETE FROM english_unit_words WHERE unitId=?').run(unitId);
    const insert = db.prepare('INSERT INTO english_unit_words(id,unitId,position,estonian,english,pronunciation,acceptedJson) VALUES(?,?,?,?,?,?,?)');
    normalized.forEach((word,i)=>insert.run(word.id,unitId,i+1,word.et,word.en,word.ipa,word.accepted));
  })();
  return normalized.length;
}
function modeAllowed(unitId:string, mode:VocabularyMode) {
  const row=unitRow(unitId);
  if (!accessible(row)) throw new VocabularyError('Õppetükk on lukus.',403);
  const p=progress(unitId);
  if (mode==='test' && !p?.studyCompletedAt) throw new VocabularyError('Kõigepealt tuleb kõik sõnad õppida.',403);
  if (mode==='weak') {
    const count=db.prepare("SELECT COUNT(*) AS count FROM english_word_stats s JOIN english_unit_words w ON w.id=s.wordId WHERE s.learner='kiur' AND w.unitId=? AND s.needsPractice=1").get(unitId) as {count:number};
    if (!count.count) throw new VocabularyError('Kordamist vajavaid sõnu ei ole.',400);
  }
}
export function getEnglishSession(id:string) {
  const row=db.prepare("SELECT * FROM english_unit_sessions WHERE id=? AND learner='kiur'").get(id) as SessionRow|undefined;
  if (!row) throw new VocabularyError('Harjutuskorda ei leitud.',404);
  return { id:row.id, unitId:row.unitId, mode:row.mode, revision:row.revision, state:JSON.parse(row.stateJson) as VocabularyState };
}
export function startEnglishSession(unitId:string,mode:VocabularyMode) {
  if (!['study','test','weak'].includes(mode)) throw new VocabularyError('Tundmatu harjutus.');
  modeAllowed(unitId,mode);
  const existing=db.prepare("SELECT id FROM english_unit_sessions WHERE learner='kiur' AND unitId=? AND mode=? AND completedAt IS NULL ORDER BY startedAt DESC LIMIT 1").get(unitId,mode) as {id:string}|undefined;
  if (existing) return getEnglishSession(existing.id);
  let words=unitWords(unitId);
  if(mode==='weak') {
    const ids=db.prepare("SELECT s.wordId FROM english_word_stats s JOIN english_unit_words w ON w.id=s.wordId WHERE s.learner='kiur' AND w.unitId=? AND s.needsPractice=1").all(unitId) as {wordId:string}[];
    const set=new Set(ids.map(row=>row.wordId));words=words.filter(word=>set.has(word.id));
  }
  const state=makeVocabularyState(words,mode);
  const id=randomUUID(), now=new Date().toISOString();
  db.prepare('INSERT INTO english_unit_sessions(id,learner,unitId,mode,stateJson,revision,startedAt,updatedAt) VALUES(?,?,?,?,?,0,?,?)').run(id,'kiur',unitId,mode,JSON.stringify(state),now,now);
  return getEnglishSession(id);
}
export function actEnglishSession(id:string,revision:number,action:VocabularyAction) {
  if (!Number.isInteger(revision) || revision < 0 || revision > 100000) throw new VocabularyError('Seansi versioon on vigane.');
  const result=db.transaction(()=>{
    const current=getEnglishSession(id);
    if (current.revision!==revision) throw new VocabularyError('Harjutus on teises aknas muutunud. Laadi uus olek.',409);
    if (current.state.completed) throw new VocabularyError('Harjutus on lõpetatud.',409);
    const before=current.state;
    const {state,event}=advanceVocabularyState(before,action);
    const now=new Date().toISOString();
    if (event) {
      db.prepare('INSERT INTO english_word_events(sessionId,wordId,kind,roundNo,correct,answer,createdAt) VALUES(?,?,?,?,?,?,?)')
        .run(id,event.wordId,event.kind,before.round,event.correct?1:0,event.answer,now);
      const study=event.kind==='study'||event.kind==='weak';
      db.prepare(`INSERT INTO english_word_stats(learner,wordId,studyCorrect,studyWrong,testCorrect,testWrong,needsPractice,updatedAt)
        VALUES('kiur',?,?,?,?,?,?,?)
        ON CONFLICT(learner,wordId) DO UPDATE SET
          studyCorrect=studyCorrect+excluded.studyCorrect,studyWrong=studyWrong+excluded.studyWrong,
          testCorrect=testCorrect+excluded.testCorrect,testWrong=testWrong+excluded.testWrong,
          needsPractice=excluded.needsPractice,updatedAt=excluded.updatedAt`)
        .run(event.wordId,study&&event.correct?1:0,study&&!event.correct?1:0,!study&&event.correct?1:0,!study&&!event.correct?1:0,event.correct?0:1,now);
    }
    if(state.completed){
      db.prepare(`INSERT INTO english_unit_progress(learner,unitId,studyCompletedAt,testPassedAt,studyFirstKnown,firstTestScore,firstTestTotal,lastTestScore,lastTestTotal,testRuns,updatedAt)
        VALUES('kiur',?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT(learner,unitId) DO UPDATE SET
          studyCompletedAt=COALESCE(english_unit_progress.studyCompletedAt,excluded.studyCompletedAt),
          testPassedAt=COALESCE(english_unit_progress.testPassedAt,excluded.testPassedAt),
          studyFirstKnown=COALESCE(english_unit_progress.studyFirstKnown,excluded.studyFirstKnown),
          firstTestScore=COALESCE(english_unit_progress.firstTestScore,excluded.firstTestScore),
          firstTestTotal=COALESCE(english_unit_progress.firstTestTotal,excluded.firstTestTotal),
          lastTestScore=COALESCE(excluded.lastTestScore,english_unit_progress.lastTestScore),
          lastTestTotal=COALESCE(excluded.lastTestTotal,english_unit_progress.lastTestTotal),
          testRuns=english_unit_progress.testRuns+excluded.testRuns,updatedAt=excluded.updatedAt`)
        .run(current.unitId,
          state.mode==='study'?now:null,state.mode==='test'?now:null,
          state.mode==='study'?state.firstKnown:null,
          state.mode==='test'?state.firstTestScore:null,state.mode==='test'?state.words.length:null,
          state.mode==='test'?state.lastTestScore:null,state.mode==='test'?state.words.length:null,
          state.mode==='test'?1:0,now);
      if(state.mode==='test') awardVocabularyTest(current.unitId,id,state,now);
    }
    const updated=db.prepare('UPDATE english_unit_sessions SET stateJson=?,revision=revision+1,updatedAt=?,completedAt=? WHERE id=? AND revision=? AND completedAt IS NULL')
      .run(JSON.stringify(state),now,state.completed?now:null,id,revision);
    if(updated.changes!==1) throw new VocabularyError('Seanssi uuendamine ebaõnnestus.',409);
    return getEnglishSession(id);
  });
  return result();
}
function awardVocabularyTest(unitId:string,sessionId:string,state:VocabularyState,now:string) {
  // A completed test is credited ONCE with the last full-round score.
  // Use the canonical v2 ledger / daily limits / streak projection, never mint
  // stars by updating balances in a separate engine.
  const policy=ensureCurrentRewardPolicy();
  const questions=state.words.map(word=>({
    id:word.id,question:word.estonian,userAnswer:'',correctAnswer:0,correctAnswerText:word.english,
    isCorrect:true,kind:'text',vocabularyId:word.id
  }));
  const inserted=db.prepare(`INSERT INTO attempts(
    createdAt,category,difficulty,questionCount,score,elapsedSeconds,questions,
    learner,subject,topic,exerciseId,clientAttemptId,completedAt,
    completionDate,effectiveCompletedAt,rewardPolicyVersion,rewardEngineVersion,
    runnerId,runnerVersion,protocolVersion,rewardSettlementStatus
  ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    now,'Inglise keel - sõnavara','õppetükk',state.words.length,state.lastTestScore ?? 0,0,JSON.stringify(questions),
    'kiur','inglise-keel','sonavara',`kiur.english.unit.${unitId}`,sessionId,now,
    isoToAppDate(now),now,policy.version,2,'kiur-english-units','english-units-v1',2,'eligible'
  );
  applyRewardProjectionV2('kiur',Number(inserted.lastInsertRowid));
  recordDailyLeaderboard(isoToAppDate(now) ?? undefined);
}
export function englishWordProgress(unitId:string) {
  unitRow(unitId);
  return db.prepare(`SELECT w.estonian,w.english,s.studyWrong,s.testWrong,s.needsPractice
    FROM english_unit_words w LEFT JOIN english_word_stats s ON s.wordId=w.id AND s.learner='kiur'
    WHERE w.unitId=? ORDER BY COALESCE(s.studyWrong,0)+COALESCE(s.testWrong,0) DESC,w.position ASC`).all(unitId);
}
