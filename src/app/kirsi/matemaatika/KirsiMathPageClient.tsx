'use client';

import { useMemo, useState } from 'react';
import PracticeSetupPage from '@/app/components/PracticeSetupPage';

const MODES = ['Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100', 'Segaülesanded'] as const;
const TOPICS = [{
  id: 'arvutamine',
  name: 'Arvutamine ja võrdlemine',
  emoji: '➕',
  description: 'Liitmine, lahutamine ja suurem-väiksem võrdlus'
}] as const;

export default function KirsiMathPageClient({ activeModes }: { activeModes: string[] }) {
  const visibleModes = useMemo(() => MODES.filter((mode) => activeModes.includes(mode)), [activeModes]);
  const [topicId, setTopicId] = useState<(typeof TOPICS)[number]['id']>('arvutamine');
  const [mode, setMode] = useState<(typeof MODES)[number]>((visibleModes[0] ?? MODES[0]) as (typeof MODES)[number]);
  const hasActiveModes = visibleModes.length > 0;

  const startUrl = useMemo(() => (
    `/test?learner=kirsi&subject=matemaatika&topic=arvutamine&category=${encodeURIComponent(mode)}&count=15`
  ), [mode]);

  return (
    <PracticeSetupPage
      backHref='/kirsi'
      subjectName='Matemaatika'
      subjectEmoji='🧮'
      topics={hasActiveModes ? TOPICS : []}
      selectedTopicId={topicId}
      onSelectTopic={(t) => setTopicId(t as (typeof TOPICS)[number]['id'])}
      setupTitle='Harjutuse seadistus'
      optionGroups={hasActiveModes ? [
        { id: 'mode', title: 'Harjutuse tüüp', options: visibleModes, value: mode, onChange: (v) => setMode(v as (typeof MODES)[number]) }
      ] : []}
      startUrl={startUrl}
      disabledStart={!hasActiveModes}
      placeholderMessage={hasActiveModes ? '' : 'Harjutusi ei ole praegu aktiivne.'}
    />
  );
}
