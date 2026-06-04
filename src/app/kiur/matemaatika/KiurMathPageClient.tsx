'use client';

import { useMemo, useState } from 'react';
import PracticeSetupPage from '@/app/components/PracticeSetupPage';
import { KIUR_LENGTH_TOPIC_ID, KIUR_MATH_TOPICS, KiurMathTopicId } from '@/lib/kiurMathTopics';
import { Category } from '@/lib/types';

export default function KiurMathPageClient({ activeTopicIds }: { activeTopicIds: string[] }) {
  const activeTopics = useMemo(() => KIUR_MATH_TOPICS.filter((topic) => activeTopicIds.includes(topic.id)), [activeTopicIds]);
  const [topicId, setTopicId] = useState<KiurMathTopicId>((activeTopics[0]?.id ?? KIUR_LENGTH_TOPIC_ID) as KiurMathTopicId);
  const [category, setCategory] = useState<Category>('Segaharjutus');

  const selectedTopic = activeTopics.find((t) => t.id === topicId) ?? activeTopics[0] ?? KIUR_MATH_TOPICS[0];
  const hasActiveTopics = activeTopics.length > 0;
  const resolvedCategory = selectedTopic.hideExerciseTypeSelector ? selectedTopic.defaultCategory : category;

  const startUrl = useMemo(() => (
    `/test?learner=kiur&subject=matemaatika&topic=${selectedTopic.id}&category=${encodeURIComponent(resolvedCategory)}&count=15`
  ), [selectedTopic.id, resolvedCategory]);

  return (
    <PracticeSetupPage
      backHref='/kiur'
      subjectName='Matemaatika'
      subjectEmoji='🧮'
      topics={activeTopics.map((topic) => ({ id: topic.id, name: topic.name, emoji: topic.emoji }))}
      selectedTopicId={selectedTopic.id}
      onSelectTopic={(t) => setTopicId(t as KiurMathTopicId)}
      setupTitle={hasActiveTopics && selectedTopic.implemented ? 'Harjutuse seadistus' : 'Matemaatika'}
      optionGroups={hasActiveTopics && selectedTopic.implemented ? [
        ...(!selectedTopic.hideExerciseTypeSelector ? [{ id: 'category', title: 'Harjutuse tüüp', options: selectedTopic.exerciseTypes, value: category, onChange: (v: string) => setCategory(v as Category) }] : [])
      ] : []}
      startUrl={startUrl}
      disabledStart={!hasActiveTopics || !selectedTopic.implemented}
      placeholderMessage={hasActiveTopics && selectedTopic.implemented ? '' : 'Harjutusi ei ole praegu aktiivne.'}
    />
  );
}
