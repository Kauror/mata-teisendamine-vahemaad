'use client';

import { useMemo, useState } from 'react';
import PracticeSetupPage from '@/app/components/PracticeSetupPage';

const MODES = [
  { id: 'arvutamine-10', name: 'Arvutamine 10 piires', category: 'Arvutamine 10 piires', emoji: '+' },
  { id: 'arvutamine-20', name: 'Arvutamine 20 piires', category: 'Arvutamine 20 piires', emoji: '20' },
  { id: 'suurem-vaiksem-100', name: 'Suurem või väiksem kui 100', category: 'Suurem või väiksem kuni 100', emoji: '< >' },
  { id: 'segaulesanded', name: 'Segaülesanded', category: 'Segaülesanded', emoji: '123' }
] as const;

export default function KirsiMathPageClient({ activeModes }: { activeModes: string[] }) {
  const visibleModes = useMemo(() => MODES.filter((mode) => activeModes.includes(mode.category)), [activeModes]);
  const [modeId, setModeId] = useState((visibleModes[0]?.id ?? MODES[0].id) as (typeof MODES)[number]['id']);
  const hasActiveModes = visibleModes.length > 0;
  const selectedMode = visibleModes.find((mode) => mode.id === modeId) ?? visibleModes[0] ?? MODES[0];

  const startUrl = useMemo(() => (
    `/test?learner=kirsi&subject=matemaatika&topic=arvutamine&category=${encodeURIComponent(selectedMode.category)}&count=15`
  ), [selectedMode.category]);

  return (
    <PracticeSetupPage
      backHref='/kirsi'
      subjectName='Matemaatika'
      subjectEmoji='🧮'
      topics={visibleModes.map((mode) => ({ id: mode.id, name: mode.name, emoji: mode.emoji }))}
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
