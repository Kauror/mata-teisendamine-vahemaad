'use client';

import { useMemo, useState } from 'react';
import PracticeSetupPage from '@/app/components/PracticeSetupPage';
import { Category, DIFFICULTIES, Difficulty } from '@/lib/types';
import { KIUR_LENGTH_TOPIC_ID, KIUR_MATH_TOPICS, KiurMathTopicId } from '@/lib/kiurMathTopics';

export default function MatemaatikaPage() {
  const [topicId, setTopicId] = useState<KiurMathTopicId>(KIUR_LENGTH_TOPIC_ID);
  const [category, setCategory] = useState<Category>('Segaharjutus');
  const [difficulty, setDifficulty] = useState<Difficulty>('Lihtne');
  const [count, setCount] = useState<number>(10);

  const selectedTopic = KIUR_MATH_TOPICS.find((t) => t.id === topicId) ?? KIUR_MATH_TOPICS[0];

  const startUrl = useMemo(() => (
    `/test?learner=kiur&subject=matemaatika&topic=${selectedTopic.id}&category=${encodeURIComponent(category)}&difficulty=${difficulty}&count=${count}`
  ), [selectedTopic.id, category, difficulty, count]);

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
        { id: 'category', title: 'Harjutuse tüüp', options: selectedTopic.exerciseTypes, value: category, onChange: (v) => setCategory(v as Category) },
        { id: 'difficulty', title: 'Raskus', options: DIFFICULTIES, value: difficulty, onChange: (v) => setDifficulty(v as Difficulty), compact: true },
        { id: 'count', title: 'Küsimuste arv', options: ['10', '25'], value: String(count), onChange: (v) => setCount(Number(v)), compact: true }
      ] : []}
      startUrl={startUrl}
      disabledStart={!selectedTopic.implemented}
      placeholderMessage={selectedTopic.implemented ? '' : 'Harjutused tulevad peagi.'}
    />
  );
}
