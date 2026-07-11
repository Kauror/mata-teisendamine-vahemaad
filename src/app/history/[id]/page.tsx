import Link from 'next/link';
import { formatDateTime, formatElapsed } from '@/lib/validation';
import { compactTopicLabel, isKirsiAttempt } from '@/lib/history';
import { KIUR_LENGTH_TOPIC_ID } from '@/lib/kiurMathTopics';
import { formatStars } from '@/lib/formatStars';
import { getStudyReward } from '@/lib/learningPoints';
import AnalogClockVisual from '@/app/components/AnalogClockVisual';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type OrderingCard = { id: string; label: string; valueMm: number };
type SavedQuestion = {
  id: string;
  question: string;
  userAnswer: string;
  expectedUnit?: string;
  correctAnswer: number;
  correctAnswers?: number[];
  isCorrect: boolean;
  kind?: 'numeric' | 'ordering' | 'choice';
  orderingCards?: OrderingCard[];
  orderingDirection?: 'asc' | 'desc';
  estonian?: string;
  explanation?: string;
  choiceOptions?: string[];
  image?: string;
  selectedWord?: string;
  correctWord?: string;
  text?: string;
  selectedAnswer?: string;
  correctAnswerText?: string;
  sourceAuthor?: string;
  sourceTitle?: string;
  sourceCollection?: string;
  evidenceText?: string;
  type?: string;
  emoji?: string;
  objectLabel?: string;
  count?: number;
  clockHour?: number;
  clockMinutes?: 0 | 15 | 30 | 45;
};

async function getDb() {
  return (await import('@/lib/db')).default;
}

type AttemptRow = {
  id: number;
  createdAt: string;
  category: string;
  difficulty: string;
  questionCount: number;
  score: number;
  elapsedSeconds: number | null;
  questions: string;
  learner?: string | null;
  subject?: string | null;
  topic?: string | null;
};

function safeParseQuestions(raw: string): SavedQuestion[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as SavedQuestion[] : [];
  } catch {
    return [];
  }
}

function safeParseMetadata(raw: string | null | undefined) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed as { resolvedCount?: number } : {};
  } catch {
    return {};
  }
}

function CountingHistoryGrid({ question }: { question: SavedQuestion }) {
  if (question.type !== 'counting' || !question.emoji || !question.count) return null;
  return (
    <div className='counting-object-grid' aria-label={`${question.count} ${question.objectLabel ?? 'asja'}`}>
      {Array.from({ length: question.count }, (_, index) => <span key={index}>{question.emoji}</span>)}
    </div>
  );
}

function ClockHistoryVisual({ question }: { question: SavedQuestion }) {
  if (question.clockHour == null || question.clockMinutes == null) return null;
  return (
    <div className='clock-question-visual'>
      <AnalogClockVisual hour={question.clockHour} minutes={question.clockMinutes} />
    </div>
  );
}

export default async function HistoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const row = db.prepare('SELECT * FROM attempts WHERE id = ?').get(id) as AttemptRow | undefined;

  if (!row) {
    return <main className='container'><div className='card'><p>Testi ei leitud.</p><Link href='/'>Tagasi</Link></div></main>;
  }

  const questions = safeParseQuestions(row.questions);
  const reward = getStudyReward(row.id);
  const remediationSession = db.prepare('SELECT metadataJson FROM remediation_sessions WHERE historyAttemptId = ?').get(row.id) as { metadataJson?: string | null } | undefined;
  const remediationMetadata = safeParseMetadata(remediationSession?.metadataJson);

  const isKirsi = isKirsiAttempt(row.category, row.learner);
  const isRemediation = row.subject === 'kordamine' || row.topic === 'kordamine' || row.category === 'Kordamine';

  const isOldRingPattern = (row.topic === 'ring-ja-ringjoon' || !row.topic) && row.category === 'Mustrid';
  const retryTopic = isOldRingPattern ? 'mustrid' : (row.topic || (isKirsi ? 'arvutamine' : KIUR_LENGTH_TOPIC_ID));
  const retryCategory = (retryTopic === 'ring-ja-ringjoon' || retryTopic === 'mustrid') ? 'Segaharjutus' : row.category;

  const isEnglish = row.subject === 'inglise-keel';
  const isScience = row.subject === 'loodusopetus';
  const isKirsiReading = row.learner === 'kirsi' && row.subject === 'lugemine';
  const isKiurReading = row.learner === 'kiur' && row.subject === 'lugemine';
  const isReading = row.subject === 'lugemine';
  const attemptLabel = isScience ? 'Loodusõpetus' : (compactTopicLabel(row.topic, row.category) || row.category);

  const retryParams = new URLSearchParams({
    learner: row.learner || (isKirsi ? 'kirsi' : 'kiur'),
    subject: row.subject || 'matemaatika',
    topic: retryTopic,
    category: retryCategory,
    count: '15',
    seed: String(Date.now())
  });

  const retryHref = isRemediation
    ? (row.learner === 'kirsi' ? '/kirsi' : '/kiur')
    : isEnglish
    ? '/kiur/inglise-keel/sprint'
    : isScience
    ? '/kiur/loodusopetus'
    : isKiurReading
      ? '/kiur/lugemine'
    : isKirsiReading && row.topic === 'esimene-haalik'
      ? '/kirsi/lugemine/esimene-haalik'
    : isKirsiReading
      ? '/kirsi/lugemine/pilt-ja-sona'
    : `/test?${retryParams.toString()}`;

  return (
    <main className='result-page'>
      <section className='result-shell'>
        <section className='result-summary-card'>
          <h1>Tulemus</h1>
          <p className='result-score'>{row.score} / {row.questionCount} õige</p>
          <div className='result-meta-grid'>
            <span>Teema: {attemptLabel}</span>
            <span>Aeg: {typeof row.elapsedSeconds === 'number' && Number.isFinite(row.elapsedSeconds) ? formatElapsed(row.elapsedSeconds) : 'aeg puudub'}</span>
            <span>{formatDateTime(row.createdAt)}</span>
          </div>
          {reward && (
            <div className='result-meta-grid'>
              <span>Teenitud: +{formatStars(reward.awardedAmount)} ⭐</span>
              <span>Tähed kokku: {formatStars(reward.balanceAfter)} ⭐</span>
              <span>Õpiseeria: {reward.streakLength} päeva</span>
              {isRemediation && typeof remediationMetadata.resolvedCount === 'number' && <span>Parandatud: {remediationMetadata.resolvedCount}</span>}
              {reward.streakBonusAwarded && <span>Seeriaboonus: +{formatStars(reward.streakBonusAmount)} ⭐</span>}
              {reward.streakRewards.map((streakReward) => <span key={streakReward.ruleId}>Auhind ({streakReward.thresholdDays} päeva): +{formatStars(streakReward.amount)} ⭐</span>)}
              {reward.capReached && reward.awardedAmount === 0 && <span>Tänane õppimise punktipiir on täis.</span>}
            </div>
          )}
        </section>

        <section className='result-list'>
        {questions.map((q, i) => {
          const order = (q.orderingCards ?? [])
            .slice()
            .sort((a, b) => (q.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm))
            .map((c) => c.label)
            .join(' → ');
          const correctChoiceAnswer = isReading && q.correctAnswerText
            ? q.correctAnswerText
            : q.correctAnswerText
            ? q.correctAnswerText
            : isKirsiReading
            ? (q.correctWord ?? '—')
            : q.kind === 'choice' && q.choiceOptions?.length
            ? (q.correctAnswers?.length ? q.correctAnswers.map((answerIndex) => q.choiceOptions?.[answerIndex]).filter(Boolean).join(' / ') : (q.choiceOptions[q.correctAnswer] ?? '—'))
            : q.kind === 'choice' && !isEnglish
              ? (q.correctAnswer === -1 ? '<' : q.correctAnswer === 0 ? '=' : '>')
              : (isEnglish ? 'Sõnapaar sobib' : String(q.correctAnswer ?? '—'));

          const isReadingPair = isKirsiReading && (q.image || q.question.includes('—'));
          const isEnglishPair = isEnglish && (q.estonian || q.question.includes('—'));
          return (
            <article key={q.id || `q-${i}`} className={q.isCorrect ? 'result-review-card correct' : 'result-review-card wrong'}>
              <p className='result-question'>{i + 1}. {isEnglishPair || isReadingPair ? q.question.replace('—', '↔') : q.question}</p>
              <CountingHistoryGrid question={q} />
              <ClockHistoryVisual question={q} />
              {q.kind === 'ordering'
                ? <div className='answer-review-grid'><p className='answer-line'><span>Sinu järjestus:</span> <strong>{q.userAnswer || '—'}</strong></p><p className='answer-line'><span>Õige järjestus:</span> <strong>{order || '—'}</strong></p></div>
                : <div className='answer-review-grid'><p className='answer-line'><span>Sinu vastus:</span> <strong>{q.userAnswer || '—'}{(q.kind === 'choice' || isKirsi || isEnglish) ? '' : ` ${q.expectedUnit || ''}`}</strong></p><p className='answer-line'><span>Õige vastus:</span> <strong>{correctChoiceAnswer}{(q.kind === 'choice' || isKirsi || isEnglish) ? '' : ` ${q.expectedUnit || ''}`}</strong></p></div>}
              <p className={q.isCorrect ? 'result-status correct' : 'result-status wrong'}>{q.isCorrect ? 'Õige' : 'Vale vastus'}</p>
              {(isReading || isRemediation) && q.text && (
                <div className='reading-history-detail'>
                  <p>{q.text}</p>
                  {(q.sourceAuthor || q.sourceTitle || q.sourceCollection) && <span>Allikas: {[q.sourceAuthor, q.sourceTitle ? `"${q.sourceTitle}"` : '', q.sourceCollection].filter(Boolean).join(', ')}</span>}
                  {!q.isCorrect && q.evidenceText ? <p><strong>Tekstis oli kirjas:</strong> {q.evidenceText}</p> : null}
                </div>
              )}
              {q.explanation && <p className='answer-line'><span>Selgitus:</span> <strong>{q.explanation}</strong></p>}
            </article>
          );
        })}
      </section>

      <div className='result-actions'>
        <Link className='btn' href={retryHref}>{isRemediation ? 'Tagasi' : `Tee ${attemptLabel.toLowerCase()} uuesti`}</Link>
        <Link className='btn chip active' href={row.learner === 'kirsi' || isKirsi ? '/kirsi' : '/kiur'}>Vali uus harjutus</Link>
      </div>
      <Link className='practice-back-button result-history-back-link' href='/history'>Ajalugu</Link>
      </section>
    </main>
  );
}
