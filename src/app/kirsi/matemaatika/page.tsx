'use client';

import { useMemo, useState } from 'react';
import PracticeSetupPage from '@/app/components/PracticeSetupPage';

const MODES = ['Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100', 'Segaülesanded'] as const;
const COUNTS = ['10', '25'] as const;
const TOPICS = [{
  id: 'arvutamine',
  name: 'Arvutamine ja võrdlemine',
  emoji: '➕',
  description: 'Liitmine, lahutamine ja suurem-väiksem võrdlus'
}] as const;

export default function KirsiMathPage() {
  const [topicId, setTopicId] = useState<(typeof TOPICS)[number]['id']>('arvutamine');
  const [mode, setMode] = useState<(typeof MODES)[number]>('Arvutamine 10 piires');
  const [count, setCount] = useState<'10' | '25'>('10');

  const startUrl = useMemo(() => (
    `/test?learner=kirsi&subject=matemaatika&topic=arvutamine&category=${encodeURIComponent(mode)}&count=${count}`
  ), [mode, count]);

  return (
    <PracticeSetupPage
      backHref='/kirsi'
      subjectName='Matemaatika'
      subjectEmoji='🧮'
      topics={TOPICS}
      selectedTopicId={topicId}
      onSelectTopic={(t) => setTopicId(t as (typeof TOPICS)[number]['id'])}
      setupTitle='Harjutuse seadistus'
      optionGroups={[
        { id: 'mode', title: 'Harjutuse tüüp', options: MODES, value: mode, onChange: (v) => setMode(v as (typeof MODES)[number]) },
        { id: 'count', title: 'Küsimuste arv', options: COUNTS, value: count, onChange: (v) => setCount(v as '10' | '25'), compact: true }
      ]}
      startUrl={startUrl}
    />
  );
}
