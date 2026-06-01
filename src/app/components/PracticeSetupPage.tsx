'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type Topic = { id: string; name: string; emoji: string };
type OptionGroup = {
  id: string;
  title: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  compact?: boolean;
};

export default function PracticeSetupPage({
  backHref,
  subjectName,
  subjectEmoji,
  topics,
  selectedTopicId,
  onSelectTopic,
  setupTitle,
  optionGroups,
  startUrl,
  disabledStart = false,
  placeholderMessage
}: {
  backHref: string;
  subjectName: string;
  subjectEmoji: string;
  topics: readonly Topic[];
  selectedTopicId: string;
  onSelectTopic: (t: string) => void;
  setupTitle: string;
  optionGroups: readonly OptionGroup[];
  startUrl: string;
  disabledStart?: boolean;
  placeholderMessage?: string;
}) {
  const router = useRouter();
  const [seed] = useState(() => Date.now());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const topicGridClass = useMemo(() => `topic-grid${topics.length === 1 ? ' one-item' : ''}`, [topics.length]);
  const hasSettings = Boolean(placeholderMessage) || optionGroups.length > 0;

  return (
    <main className='practice-page'>
      <section className='practice-shell'>
        <Link className='practice-back-button' href={backHref}>← Aine valik</Link>
        <header className='subject-header'>
          <div className='subject-emoji' aria-hidden>{subjectEmoji}</div>
          <h1>{subjectName}</h1>
        </header>
        <section className='topic-section' aria-label='Teemad'>
          <div className={topicGridClass}>
            {topics.map((topic) => (
              <button
                type='button'
                key={topic.id}
                className={topic.id === selectedTopicId ? 'topic-choice selected' : 'topic-choice'}
                onClick={() => {
                  onSelectTopic(topic.id);
                  setSettingsOpen(false);
                }}
                aria-pressed={topic.id === selectedTopicId}
              >
                <span className='topic-emoji' aria-hidden>{topic.emoji}</span>
                <span className='topic-name'>{topic.name}</span>
              </button>
            ))}
          </div>
        </section>
        <section className='setup-actions' aria-label='Harjutuse alustamine'>
          {!disabledStart && (
            <button
              type='button'
              className='start-button'
              onClick={() => router.push(`${startUrl}&seed=${seed}`)}
            >
              ▶ Alusta
            </button>
          )}
          <div className='secondary-actions'>
            {hasSettings && (
              <button
                type='button'
                className='settings-toggle'
                onClick={() => setSettingsOpen((open) => !open)}
                aria-expanded={settingsOpen}
                aria-controls='practice-settings'
              >
                ⚙️ Seaded
              </button>
            )}
            <Link className='setup-history-link' href='/history'>📄 Ajalugu</Link>
          </div>
        </section>
        {hasSettings && settingsOpen && (
          <section className='settings-panel' id='practice-settings'>
            <h2>{setupTitle}</h2>
            {placeholderMessage && <p>{placeholderMessage}</p>}
            {optionGroups.map((group) => (
              <div className='choice-group' key={group.id}>
                <h3 className='choice-title'>{group.title}</h3>
                <div className={group.compact ? 'choice-grid compact' : 'choice-grid'}>
                  {group.options.map((option) => (
                    <button
                      type='button'
                      key={option}
                      className={group.value === option ? 'choice-button selected' : 'choice-button'}
                      onClick={() => group.onChange(option)}
                      aria-pressed={group.value === option}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
