'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LessonContentResponse, ReadingCompleteResponse, TextbookScope } from '@/lib/textbook/api';
import { ContentBlocks } from '@/app/components/textbook/ContentBlocks';
import { textbookPaths } from '@/app/components/textbook/pages';
import { clampSection, finishState, pagerView, sectionParam } from '@/app/components/textbook/pager';
import { newActionId, type TextbookClientError } from '@/app/components/textbook/textbookClient';
import { TextbookLoading, TextbookProblem, TextbookShell } from '@/app/components/textbook/TextbookShell';
import { PEEK_ERROR, useLearnerClient, useTextbookLoad, writesBlocked } from '@/app/components/textbook/useTextbook';

function readSectionFromUrl(count: number) {
  try {
    return clampSection(new URL(window.location.href).searchParams.get('osa'), count);
  } catch {
    return 0;
  }
}

function writeSectionToUrl(index: number) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('osa', sectionParam(index));
    window.history.replaceState(window.history.state, '', url.toString());
  } catch {
    // Not fatal: the section just will not survive a reload.
  }
}

// True once the element has been on screen. Without IntersectionObserver
// (very old browsers) the end counts as seen, so nobody is ever stuck.
function useSeen(active: boolean) {
  const [seen, setSeen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const ref = useCallback((node: HTMLElement | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!node || !active) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setSeen(true);
        observer.current?.disconnect();
      }
    }, { threshold: 0.5 });
    observer.current.observe(node);
  }, [active]);
  useEffect(() => () => observer.current?.disconnect(), []);
  return { seen, ref };
}

export default function TextbookLesson({ scope, courseId, unitId, lessonId }: { scope: TextbookScope; courseId: string; unitId: string; lessonId: string }) {
  const client = useLearnerClient(scope);
  const paths = textbookPaths(scope, courseId);
  const { data, setData, error, loading, reload } = useTextbookLoad<LessonContentResponse>(() => client.lesson(courseId, unitId, lessonId), [client, courseId, unitId, lessonId]);
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<TextbookClientError | null>(null);
  const [result, setResult] = useState<ReadingCompleteResponse | null>(null);
  const actionId = useRef<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const sections = data?.lesson.sections ?? [];
  const pager = pagerView(index, sections.length);
  const end = useSeen(Boolean(data) && pager.isLast);

  // The section survives a reload (?osa=2).
  useEffect(() => {
    if (data) setIndex(readSectionFromUrl(data.lesson.sections.length));
  }, [data]);

  const go = (next: number) => {
    const target = pagerView(next, sections.length).index;
    setIndex(target);
    writeSectionToUrl(target);
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  };

  const complete = async () => {
    if (!data || saving) return;
    if (writesBlocked(scope)) {
      setSaveError(PEEK_ERROR);
      return;
    }
    setSaving(true);
    setSaveError(null);
    // One id per lesson completion: a retry after a network failure is a
    // repeat, not a second completion.
    actionId.current = actionId.current ?? newActionId();
    const response = await client.completeLesson(courseId, unitId, lessonId, actionId.current);
    setSaving(false);
    if (!response.ok) {
      setSaveError(response.error);
      return;
    }
    setResult(response.data);
    setData({ ...data, completed: true });
  };

  if (error || !data) {
    return (
      <TextbookShell scope={scope} backHref={paths.unit(unitId)} backLabel='← Õppetükk' title='Lugemine'>
        {error ? <TextbookProblem error={error} onRetry={() => void reload()} backHref={paths.unit(unitId)} backLabel='Tagasi õppetüki juurde' /> : loading ? <TextbookLoading text='Laadin õppetükki…' /> : null}
      </TextbookShell>
    );
  }

  const section = sections[pager.index];
  const state = finishState({ isLast: pager.isLast, endSeen: end.seen, completed: data.completed });

  return (
    <TextbookShell scope={scope} eyebrow={`Õpi · ${pager.label}`} title={data.lesson.title} backHref={paths.unit(unitId)} backLabel='← Õppetükk'>
      {data.completed && !result ? <p className='tb-done-note' role='status'>✓ Loetud. Võid siin rahulikult üle lugeda.</p> : null}

      <article className='tb-reader' aria-labelledby='tb-section-title' data-section-index={pager.index}>
        {section ? (
          <>
            <h2 id='tb-section-title' className='tb-section-title' tabIndex={-1} ref={headingRef}>{section.title ?? data.lesson.title}</h2>
            <ContentBlocks blocks={section.blocks} />
          </>
        ) : (
          <p className='tb-empty'>Selles õppetükis ei ole veel teksti.</p>
        )}
        {pager.isLast ? (
          <div className='tb-end-sentinel' ref={end.ref} data-seen={end.seen ? 'true' : 'false'}>
            <span aria-hidden>🏁</span> Õppetüki lõpp
          </div>
        ) : null}
      </article>

      <nav className='tb-pager' aria-label='Õppetüki osad'>
        <button type='button' className='tb-button' disabled={pager.isFirst} onClick={() => go(pager.index - 1)}>← Tagasi</button>
        <span className='tb-pager-label'>{pager.label}</span>
        {!pager.isLast ? <button type='button' className='tb-button tb-button-primary' onClick={() => go(pager.index + 1)}>Edasi →</button> : <span className='tb-pager-spacer' aria-hidden />}
      </nav>

      {state === 'waiting' || state === 'ready' ? (
        <div className='tb-finish'>
          <button type='button' className='tb-button tb-button-primary tb-button-wide' disabled={state !== 'ready' || saving} onClick={() => void complete()}>
            {saving ? 'Salvestan…' : 'Lugesin läbi'}
          </button>
          {state === 'waiting' ? <p className='tb-hint'>Loe lõpuni – nupp hakkab tööle, kui jõuad õppetüki lõppu.</p> : null}
        </div>
      ) : null}

      {saveError ? <TextbookProblem error={saveError} onRetry={() => void complete()} retrying={saving} backHref={paths.unit(unitId)} backLabel='Tagasi õppetüki juurde' /> : null}

      {result || (data.completed && pager.isLast) ? (
        <section className='tb-next-card' aria-label='Mis edasi'>
          {result ? <h2>✓ Õppetükk on loetud</h2> : null}
          {result?.practiceUnlocked && !data.nextLessonId ? <p>Kõik kohustuslikud õppetükid on loetud. Nüüd saad harjutada!</p> : null}
          <div className='tb-actions'>
            {data.nextLessonId ? <Link className='tb-button tb-button-primary' href={paths.lesson(unitId, data.nextLessonId)}>Järgmine õppetükk →</Link> : null}
            {!data.nextLessonId && (result?.practiceUnlocked ?? false) ? <Link className='tb-button tb-button-primary' href={paths.practice(unitId)}>Harjuta</Link> : null}
            <Link className='tb-button' href={paths.unit(unitId)}>Tagasi õppetüki juurde</Link>
          </div>
        </section>
      ) : null}
    </TextbookShell>
  );
}
