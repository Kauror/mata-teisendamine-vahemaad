'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useOffline } from '@/app/components/offline/OfflineProvider';
import { ParentNoticePanel, ParentPasswordPanel } from '@/app/components/ParentAccountPanels';
import { ApprovalsPanel } from '@/app/components/parent/ApprovalsPanel';
import { HistoryAdminPanel } from '@/app/components/parent/HistoryAdminPanel';
import { LearningSettingsPanel } from '@/app/components/parent/LearningSettingsPanel';
import { LibraryPanel } from '@/app/components/parent/LibraryPanel';
import { ParentAccordionSection } from '@/app/components/parent/ParentAccordionSection';
import { RewardsPanel } from '@/app/components/parent/RewardsPanel';
import { StarsPanel } from '@/app/components/parent/StarsPanel';
import { StorePanel } from '@/app/components/parent/StorePanel';
import { TasksPanel } from '@/app/components/parent/TasksPanel';
import { ParentApiProvider, ParentToasts, useParentApi } from '@/app/components/parent/useParentApi';
import { WeeklyDigestPanel } from '@/app/components/parent/WeeklyDigestPanel';

// Both are large and only needed once their section is opened.
const loadingPanel = () => <p>Laadin...</p>;
const ParentEnglishVocabulary = dynamic(() => import('@/app/components/ParentEnglishVocabulary'), { loading: loadingPanel });
const OfflineReadiness = dynamic(() => import('@/app/components/offline/OfflineReadiness').then((module) => module.OfflineReadiness), { loading: loadingPanel });

type ParentSectionId = 'stars' | 'weekly' | 'offline' | 'notice' | 'tasks' | 'store' | 'learning' | 'library' | 'vocabulary' | 'password' | 'rewards' | 'history';
type CountedSection = 'library' | 'tasks' | 'store' | 'rewards' | 'history';

// What a section header says before its panel has loaded its own data; the
// panel replaces it with a count once it has one.
const DEFAULT_SUMMARIES: Record<CountedSection, string> = {
  library: 'Harjutuste nähtavus lastele',
  tasks: 'Laste igapäevased tegevused',
  store: 'Poe esemed ja ostud',
  rewards: 'Kuu võistlus ja seeria auhinnad',
  history: 'Tulemuste peitmine'
};

// The parent area is a thin shell: each panel loads its own data when its
// section is first opened, and refreshes only what its mutations change.
export default function ParentHub() {
  return (
    <ParentApiProvider>
      <ParentHubSections />
    </ParentApiProvider>
  );
}

function ParentHubSections() {
  const api = useParentApi();
  const { online } = useOffline();
  const [openSections, setOpenSections] = useState<Set<ParentSectionId>>(() => new Set(['stars']));
  const [summaries, setSummaries] = useState<Record<CountedSection, string>>(DEFAULT_SUMMARIES);
  const reportSummary = useMemo(() => {
    const report = (section: CountedSection) => (summary: string) => setSummaries((current) => (current[section] === summary ? current : { ...current, [section]: summary }));
    return { library: report('library'), tasks: report('tasks'), store: report('store'), rewards: report('rewards'), history: report('history') };
  }, []);

  const toggleSection = (section: ParentSectionId) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };
  const section = (id: ParentSectionId) => ({ open: openSections.has(id), onToggle: () => toggleSection(id) });

  const logout = async () => {
    await api.request('/api/parent/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <section className='parent-hub'>
      <header className='parent-header'>
        <div>
          <h1>Lapsevanema ala</h1>
          <p>Tegevused, pood ja tähed</p>
        </div>
        <button type='button' className='filter-chip' disabled={!online} onClick={logout}>Välju</button>
      </header>

      <ParentToasts />

      {!online && <p className='offline-warning' role='alert'>Lapsevanema muudatused vajavad internetiühendust. Sellel lehel ei salvestata võrguühenduseta tehtud muudatusi.</p>}

      <fieldset className='parent-hub-fieldset' disabled={!online} aria-disabled={!online}>
        <ApprovalsPanel />

        <ParentAccordionSection title='Tähed ja karikad' summary='Saldod, punktide ja karikate muutmine' {...section('stars')}>
          <StarsPanel />
        </ParentAccordionSection>

        <ParentAccordionSection title='Nädala kokkuvõte' summary='Viimased 7 päeva' {...section('weekly')}>
          <WeeklyDigestPanel />
        </ParentAccordionSection>

        <ParentAccordionSection title='Võrguühenduseta kasutus' summary='Ettevalmistus ja sünkroonimine' {...section('offline')}>
          <OfflineReadiness />
        </ParentAccordionSection>

        <ParentAccordionSection title='Harjutuste kogu' summary={summaries.library} {...section('library')} keepMounted>
          <LibraryPanel onSummary={reportSummary.library} />
        </ParentAccordionSection>

        <ParentAccordionSection title='Inglise keele sõnavara' summary='Õppetükid, import ja edenemine' {...section('vocabulary')} keepMounted>
          <ParentEnglishVocabulary setNotice={api.setNotice} setError={api.setError} />
        </ParentAccordionSection>

        <ParentAccordionSection title='Tegevused' summary={summaries.tasks} {...section('tasks')} keepMounted>
          <TasksPanel onSummary={reportSummary.tasks} />
        </ParentAccordionSection>

        <ParentAccordionSection title='Pood' summary={summaries.store} {...section('store')} keepMounted>
          <StorePanel onSummary={reportSummary.store} />
        </ParentAccordionSection>

        <ParentAccordionSection title='Õppimise punktid' summary='Harjutuste tähtede reeglid' {...section('learning')} keepMounted>
          <LearningSettingsPanel />
        </ParentAccordionSection>

        <ParentAccordionSection title='Parool' summary='Lapsevanema ala ligipääs' {...section('password')}>
          <ParentPasswordPanel request={api.request} onError={api.setError} onNotice={api.setNotice} />
        </ParentAccordionSection>

        <ParentAccordionSection title='Teated ja reeglid' summary='Tekst laste avalehel' {...section('notice')}>
          <ParentNoticePanel request={api.request} onError={api.setError} onNotice={api.setNotice} />
        </ParentAccordionSection>

        <ParentAccordionSection title='Auhinnad' summary={summaries.rewards} {...section('rewards')} keepMounted>
          <RewardsPanel onSummary={reportSummary.rewards} />
        </ParentAccordionSection>

        <ParentAccordionSection title='Ajaloo haldamine' summary={summaries.history} {...section('history')} keepMounted>
          <HistoryAdminPanel onSummary={reportSummary.history} />
        </ParentAccordionSection>
      </fieldset>
    </section>
  );
}
