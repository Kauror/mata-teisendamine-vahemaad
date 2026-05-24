'use client';

import { useMemo, useState } from 'react';
import PracticeSetupPage from '@/app/components/PracticeSetupPage';
import { Category, Difficulty } from '@/lib/types';
import { KIUR_LENGTH_TOPIC_ID, KIUR_MATH_TOPICS, KiurMathTopicId } from '@/lib/kiurMathTopics';

export default function MatemaatikaPage() {
  const [topicId, setTopicId] = useState<KiurMathTopicId>(KIUR_LENGTH_TOPIC_ID);
  const [category, setCategory] = useState<Category>('Segaharjutus');
  const [difficulty] = useState<Difficulty>('Lihtne');
  const [count, setCount] = useState<number>(10);

  const selectedTopic = KIUR_MATH_TOPICS.find((t) => t.id === topicId) ?? KIUR_MATH_TOPICS[0];

  const resolvedCategory = selectedTopic.hideExerciseTypeSelector ? selectedTopic.defaultCategory : category;

  const resolvedDifficulty = selectedTopic.hideDifficultySelector ? selectedTopic.defaultDifficulty : difficulty;

  const startUrl = useMemo(() => (
    `/test?learner=kiur&subject=matemaatika&topic=${selectedTopic.id}&category=${encodeURIComponent(resolvedCategory)}&difficulty=${resolvedDifficulty}&count=${count}`
  ), [selectedTopic.id, resolvedCategory, resolvedDifficulty, count]);

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
        ...(!selectedTopic.hideExerciseTypeSelector ? [{ id: 'category', title: 'Harjutuse tüüp', options: selectedTopic.exerciseTypes, value: category, onChange: (v: string) => setCategory(v as Category) }] : []),
        { id: 'count', title: 'Küsimuste arv', options: ['10', '25'], value: String(count), onChange: (v: string) => setCount(Number(v)), compact: true }
      ] : []}
      startUrl={startUrl}
      disabledStart={!selectedTopic.implemented}
      placeholderMessage={selectedTopic.implemented ? '' : 'Harjutused tulevad peagi.'}
    />
  );
}
