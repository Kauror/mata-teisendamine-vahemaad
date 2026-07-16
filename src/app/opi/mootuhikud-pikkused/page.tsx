import StudyRunner from '@/app/components/study/StudyRunner';

// Static route so the offline shell can precache it (the SW matches exact paths).
export default function LengthsStudyPage() {
  return <StudyRunner studyKey='mootuhikud-pikkused' />;
}
