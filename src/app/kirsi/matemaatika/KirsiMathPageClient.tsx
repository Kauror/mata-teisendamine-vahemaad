'use client';

import { useMemo, useState } from 'react';
import PracticeSetupPage from '@/app/components/PracticeSetupPage';

const MODES = [
  { id: 'loendamine', exerciseId: 'kirsi.math.counting-20', name: 'Loendamine', category: 'Loendamine', topic: 'loendamine', emoji: '🔢', accent: 'topic-emoji-counting' },
  { id: 'arvutamine-10', exerciseId: 'kirsi.math.arvutamine.1', name: 'Arvutamine 10 piires', category: 'Arvutamine 10 piires', topic: 'arvutamine', emoji: '🍎', accent: 'topic-emoji-addition' },
  { id: 'arvutamine-20', exerciseId: 'kirsi.math.arvutamine.2', name: 'Arvutamine 20 piires', category: 'Arvutamine 20 piires', topic: 'arvutamine', emoji: '🧩', accent: 'topic-emoji-twenty' },
  { id: 'suurem-vaiksem-100', exerciseId: 'kirsi.math.arvutamine.3', name: 'Suurem või väiksem kui 100', category: 'Suurem või väiksem kuni 100', topic: 'arvutamine', emoji: '⚖️', accent: 'topic-emoji-compare' },
  { id: 'segaulesanded', exerciseId: 'kirsi.math.arvutamine.4', name: 'Segaülesanded', category: 'Segaülesanded', topic: 'arvutamine', emoji: '🎲', accent: 'topic-emoji-mixed' }
] as const;

export default function KirsiMathPageClient({
  activeModes,
  completedExerciseIds = []
}: {
  activeModes: string[];
  completedExerciseIds?: string[];
}) {
  const visibleModes = useMemo(() => MODES.filter((mode) => activeModes.includes(mode.category)), [activeModes]);
  const completedSet = useMemo(() => new Set(completedExerciseIds), [completedExerciseIds]);
  const [modeId, setModeId] = useState((visibleModes[0]?.id ?? MODES[0].id) as (typeof MODES)[number]['id']);
  const hasActiveModes = visibleModes.length > 0;
  const selectedMode = visibleModes.find((mode) => mode.id === modeId) ?? visibleModes[0] ?? MODES[0];

  const startUrl = useMemo(() => (
    `/test?learner=kirsi&subject=matemaatika&topic=${selectedMode.topic}&category=${encodeURIComponent(selectedMode.category)}&count=15`
  ), [selectedMode.category, selectedMode.topic]);

  return (
    <PracticeSetupPage
      backHref='/kirsi'
      subjectName='Matemaatika'
      subjectEmoji='🧮'
      topics={visibleModes.map((mode) => ({
        id: mode.id,
        name: mode.name,
        emoji: mode.emoji,
        accent: mode.accent,
        completedToday: completedSet.has(mode.exerciseId)
      }))}
      selectedTopicId={selectedMode.id}
      onSelectTopic={(nextModeId) => setModeId(nextModeId as (typeof MODES)[number]['id'])}
      setupTitle='Harjutuse seadistus'
      optionGroups={[]}
      startUrl={startUrl}
      disabledStart={!hasActiveModes}
      placeholderMessage={hasActiveModes ? '' : 'Harjutusi ei ole praegu aktiivne.'}
    />
  );
}
