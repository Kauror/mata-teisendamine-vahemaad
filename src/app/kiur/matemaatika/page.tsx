'use client';

import { useMemo, useState } from 'react';
import PracticeSetupPage from '@/app/components/PracticeSetupPage';
import { Category } from '@/lib/types';
import { KIUR_LENGTH_TOPIC_ID, KIUR_MATH_TOPICS, KiurMathTopicId } from '@/lib/kiurMathTopics';

export default function MatemaatikaPage() {
  const [topicId, setTopicId] = useState<KiurMathTopicId>(KIUR_LENGTH_TOPIC_ID);
  const [category, setCategory] = useState<Category>('Segaharjutus');

  const selectedTopic = KIUR_MATH_TOPICS.find((t) => t.id === topicId) ?? KIUR_MATH_TOPICS[0];
  const resolvedCategory = selectedTopic.hideExerciseTypeSelector ? selectedTopic.defaultCategory : category;

  const startUrl = useMemo(() => (
    `/test?learner=kiur&subject=matemaatika&topic=${selectedTopic.id}&category=${encodeURIComponent(resolvedCategory)}&count=15`
  ), [selectedTopic.id, resolvedCategory]);

  return (
    <PracticeSetupPage
      backHref='/kiur'
      subjectName='Matemaatika'
      subjectEmoji='🧮'
      topics={KIUR_MATH_TOPICS.map((topic) => ({ id: topic.id, name: topic.name, emoji: topic.emoji }))}
      selectedTopicId={topicId}
      onSelectTopic={(t) => setTopicId(t as KiurMathTopicId)}
      setupTitle={selectedTopic.implemented ? 'Harjutuse seadistus' : selectedTopic.name}
      optionGroups={selectedTopic.implemented ? [
        ...(!selectedTopic.hideExerciseTypeSelector ? [{ id: 'category', title: 'Harjutuse tüüp', options: selectedTopic.exerciseTypes, value: category, onChange: (v: string) => setCategory(v as Category) }] : [])
      ] : []}
      startUrl={startUrl}
      disabledStart={!selectedTopic.implemented}
      placeholderMessage={selectedTopic.implemented ? '' : 'Harjutused tulevad peagi.'}
    />
  );
}
