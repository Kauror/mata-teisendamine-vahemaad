'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useRef, useState, type ComponentType } from 'react';
import StudyEntryScreen, { type StudyTheme } from '@/app/components/study/StudyEntryScreen';
import { exerciseStartRoute, studyBackRoute, type StudyKey } from '@/lib/studyPages';

const RingStudyMaterial = dynamic(() => import('@/app/components/study/RingStudyMaterial'));
const ClockStudyMaterial = dynamic(() => import('@/app/components/study/ClockStudyMaterial'));
const LengthsStudyMaterial = dynamic(() => import('@/app/components/study/LengthsStudyMaterial'));
const ScienceStudyMaterial = dynamic(() => import('@/app/components/study/ScienceStudyMaterial'));

type StudyMeta = {
  icon: string;
  title: string;
  intro: string;
  subIntro?: string;
  readyText: string;
  Material: ComponentType;
  themes?: { icon: string; label: string; anchor: string }[];
};

const SCIENCE_THEMES = [
  { icon: '🌌', label: 'Maailmaruum', anchor: 'teema-maailmaruum' },
  { icon: '🌍', label: 'Maa ja kaart', anchor: 'teema-maa-ja-kaart' },
  { icon: '💧', label: 'Vesi ja ilm', anchor: 'teema-vesi-ja-ilm' },
  { icon: '🌱', label: 'Elusloodus', anchor: 'teema-elusloodus' },
  { icon: '🫀', label: 'Inimene ja tervis', anchor: 'teema-inimene-ja-tervis' },
  { icon: '🔎', label: 'Uurimine ja andmed', anchor: 'teema-uurimine-ja-andmed' }
];

const STUDY_META: Record<StudyKey, StudyMeta> = {
  'ring-ja-ringjoon': {
    icon: '⭕', title: 'Ring ja ringjoon',
    intro: 'Vaata teema enne harjutamist üle või alusta kohe.',
    readyText: 'Kas oled valmis harjutama?', Material: RingStudyMaterial
  },
  kellaaeg: {
    icon: '🕒', title: 'Kellaaeg',
    intro: 'Vaata teema enne harjutamist üle või alusta kohe.',
    readyText: 'Kas oled valmis kella lugema?', Material: ClockStudyMaterial
  },
  'mootuhikud-pikkused': {
    icon: '📏', title: 'Mõõtühikud',
    intro: 'Kordame üle pikkusühikud, teisendamise ja pikkustega arvutamise.',
    readyText: 'Kas oled valmis harjutama?', Material: LengthsStudyMaterial
  },
  loodusopetus: {
    icon: '🔬', title: 'Loodusõpetus',
    intro: 'Kordame enne harjutamist üle kõige tähtsamad teadmised.',
    subIntro: 'Vali teema, mida soovid vaadata, või liigu järjest läbi kõikide teemade.',
    readyText: 'Kas oled valmis oma teadmisi proovima?', Material: ScienceStudyMaterial,
    themes: SCIENCE_THEMES
  }
};

function StudyRunnerContent({ studyKey }: { studyKey: StudyKey }) {
  const router = useRouter();
  const materialRef = useRef<HTMLDivElement>(null);
  const [showMaterial, setShowMaterial] = useState(false);

  const meta = STUDY_META[studyKey];

  const startExercise = () => router.push(exerciseStartRoute(studyKey));
  const revealMaterial = (anchor?: string) => {
    setShowMaterial(true);
    requestAnimationFrame(() => {
      const target = anchor ? document.getElementById(anchor) : materialRef.current;
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };
  const themes: StudyTheme[] | undefined = meta.themes?.map((theme) => ({
    icon: theme.icon,
    label: theme.label,
    onSelect: () => revealMaterial(theme.anchor)
  }));

  const Material = meta.Material;

  return (
    <main className='study-page'>
      <div className='study-shell'>
        <StudyEntryScreen
          icon={meta.icon}
          title={meta.title}
          intro={meta.intro}
          subIntro={meta.subIntro}
          themes={themes}
          backHref={studyBackRoute(studyKey)}
          onStart={startExercise}
          onLearn={() => revealMaterial()}
        />

        {showMaterial && (
          <div ref={materialRef}>
            <Material />
            <section className='study-final-actions'>
              <p className='study-ready-text'>{meta.readyText}</p>
              <button type='button' className='study-primary-button' onClick={startExercise}>Alusta harjutust</button>
              <Link className='study-back-link' href={studyBackRoute(studyKey)}>← Tagasi harjutuste juurde</Link>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default function StudyRunner({ studyKey }: { studyKey: StudyKey }) {
  return <StudyRunnerContent studyKey={studyKey} />;
}
