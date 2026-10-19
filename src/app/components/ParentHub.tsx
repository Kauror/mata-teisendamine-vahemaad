'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
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
import { MonthlyRace, TodayChildren } from '@/app/components/parent/TodayPanel';
import { ParentApiProvider, ParentToasts, useParentApi } from '@/app/components/parent/useParentApi';
import { WeeklyDigestPanel } from '@/app/components/parent/WeeklyDigestPanel';
import { PARENT_HALDA_TABS, type ParentHaldaTab, type ParentView } from '@/app/components/parent/views';

// These are large and only needed once their section is opened.
const loadingPanel = () => <p>Laadin...</p>;
const ParentEnglishVocabulary = dynamic(() => import('@/app/components/ParentEnglishVocabulary'), { loading: loadingPanel });
const TextbookPanel = dynamic(() => import('@/app/components/parent/TextbookPanel').then((module) => module.TextbookPanel), { loading: loadingPanel });
const KaardimangPanel = dynamic(() => import('@/app/components/kaardimang/KaardimangParentPanel'), { loading: loadingPanel });
const OfflineReadiness = dynamic(() => import('@/app/components/offline/OfflineReadiness').then((module) => module.OfflineReadiness), { loading: loadingPanel });

type ParentSectionId = 'stars' | 'weekly' | 'offline' | 'notice' | 'learning' | 'vocabulary' | 'textbook' | 'kaardimang' | 'password' | 'rewards' | 'history';
type CountedSection = 'library' | 'textbook' | 'tasks' | 'store' | 'rewards' | 'history';

// What a section header says before its panel has loaded its own data; the
// panel replaces it with a count once it has one.
const DEFAULT_SUMMARIES: Record<CountedSection, string> = {
  library: 'Harjutuste nähtavus lastele',
  textbook: 'Avaldamine, edenemine ja eelvaade',
  tasks: 'Laste igapäevased tegevused',
  store: 'Poe esemed ja ostud',
  rewards: 'Kuu võistlus ja seeria auhinnad',
  history: 'Tulemuste peitmine'
};

const TAB_LINKS: Array<{ view: ParentView; href: string; label: string }> = [
  { view: 'tana', href: '/vanem', label: 'Täna' },
  { view: 'halda', href: '/vanem/halda', label: 'Halda' },
  { view: 'seaded', href: '/vanem/seaded', label: 'Seaded' }
];

// The parent area in three views (Harjutaja UI 18.10): Täna answers "does
// anything need me, did each child do today's work"; Halda holds the lists
// (tasks, shop, learning content, exercises); Seaded the rules and access.
// Each panel loads its own data when it is first shown, and refreshes only
// what its mutations change.
export default function ParentHub({ view, tab }: { view: ParentView; tab?: ParentHaldaTab }) {
  return (
    <ParentApiProvider>
      <ParentHubView view={view} tab={tab} />
    </ParentApiProvider>
  );
}

function todayHeading() {
  const text = new Intl.DateTimeFormat('et-EE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Tallinn' }).format(new Date());
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function ParentHubView({ view, tab }: { view: ParentView; tab?: ParentHaldaTab }) {
  const api = useParentApi();
  const { online } = useOffline();
  const [openSections, setOpenSections] = useState<Set<ParentSectionId>>(() => new Set());
  const [summaries, setSummaries] = useState<Record<CountedSection, string>>(DEFAULT_SUMMARIES);
  const reportSummary = useMemo(() => {
    const report = (section: CountedSection) => (summary: string) => setSummaries((current) => (current[section] === summary ? current : { ...current, [section]: summary }));
    return { library: report('library'), textbook: report('textbook'), tasks: report('tasks'), store: report('store'), rewards: report('rewards'), history: report('history') };
  }, []);
  const [haldaTab, setHaldaTab] = useState<ParentHaldaTab>(tab ?? 'tegevused');
  // A tab, once shown, stays mounted so a half-filled form survives a switch.
  const [seenTabs, setSeenTabs] = useState<Set<ParentHaldaTab>>(() => new Set([tab ?? 'tegevused']));
  const [adding, setAdding] = useState(false);

  const toggleSection = (section: ParentSectionId) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };
  const section = (id: ParentSectionId) => ({ open: openSections.has(id), onToggle: () => toggleSection(id) });
  const pickTab = (next: ParentHaldaTab) => {
    setHaldaTab(next);
    setAdding(false);
    setSeenTabs((current) => (current.has(next) ? current : new Set(current).add(next)));
  };

  const logout = async () => {
    await api.request('/api/parent/logout', { method: 'POST' });
    window.location.reload();
  };
  const exit = <button type='button' className='pv-exit' disabled={!online} onClick={logout}>Välju</button>;
  const canAdd = haldaTab === 'tegevused' || haldaTab === 'pood';

  const header = view === 'tana'
    ? <ParentTop title='Täna' note={todayHeading()} action={exit} />
    : view === 'halda'
      ? <ParentTop title='Halda' note='Tegevused, pood ja õppesisu' action={canAdd ? <button type='button' className='pv-top-act' aria-expanded={adding} onClick={() => setAdding((current) => !current)}>{adding ? 'Sulge' : '+ Lisa'}</button> : null} />
      : <ParentTop title='Seaded' note='Muudatused kehtivad kohe mõlemale lapsele' action={exit} />;

  return (
    <section className='parent-hub pv-page' data-view={view}>
      {/* Back to the children's home page; the parent session stays, so the
          child pages open in review mode. */}
      <Link className='pv-home' href='/'>← Avaleht</Link>
      {header}

      <ParentToasts />

      {!online && <p className='offline-warning' role='alert'>Lapsevanema muudatused vajavad internetiühendust. Sellel lehel ei salvestata võrguühenduseta tehtud muudatusi.</p>}

      <fieldset className='parent-hub-fieldset' disabled={!online} aria-disabled={!online}>
        {view === 'tana' && (
          <>
            <ApprovalsPanel />
            <TodayChildren />
            <MonthlyRace />
            <div className='pv-card pv-list-card'>
              <ParentAccordionSection title='Tähed ja karikad' summary='Saldod, punktide ja karikate muutmine' {...section('stars')}>
                <StarsPanel />
              </ParentAccordionSection>
              <ParentAccordionSection title='Nädala kokkuvõte' summary='Viimased 7 päeva' {...section('weekly')}>
                <WeeklyDigestPanel />
              </ParentAccordionSection>
            </div>
          </>
        )}

        {view === 'halda' && (
          <>
            <div className='pv-chips' role='group' aria-label='Mida hallata'>
              {PARENT_HALDA_TABS.map((item) => (
                <button key={item.id} type='button' className='pv-chip' aria-pressed={haldaTab === item.id} onClick={() => pickTab(item.id)}>{item.label}</button>
              ))}
            </div>
            <HaldaTab id='tegevused' current={haldaTab} seen={seenTabs}>
              <TasksPanel onSummary={reportSummary.tasks} adding={adding && haldaTab === 'tegevused'} onAddDone={() => setAdding(false)} />
            </HaldaTab>
            <HaldaTab id='pood' current={haldaTab} seen={seenTabs}>
              <StorePanel onSummary={reportSummary.store} adding={adding && haldaTab === 'pood'} onAddDone={() => setAdding(false)} />
            </HaldaTab>
            <HaldaTab id='sisu' current={haldaTab} seen={seenTabs}>
              <div className='pv-card pv-list-card'>
                <ParentAccordionSection title='Loodusõpetuse õppetükid' summary={summaries.textbook} {...section('textbook')} keepMounted>
                  <TextbookPanel onSummary={reportSummary.textbook} />
                </ParentAccordionSection>
                <ParentAccordionSection title='Inglise keele sõnavara' summary='Õppetükid, import ja edenemine' {...section('vocabulary')} keepMounted>
                  <ParentEnglishVocabulary setNotice={api.setNotice} setError={api.setError} />
                </ParentAccordionSection>
                <ParentAccordionSection title='Kaardimäng' summary='Maailma riigid ja pealinnad, eelvaade' {...section('kaardimang')}>
                  <KaardimangPanel />
                </ParentAccordionSection>
              </div>
            </HaldaTab>
            <HaldaTab id='harjutused' current={haldaTab} seen={seenTabs}>
              <LibraryPanel onSummary={reportSummary.library} />
            </HaldaTab>
          </>
        )}

        {view === 'seaded' && (
          <>
            <div className='pv-card pv-list-card'>
              <ParentAccordionSection title='Tähed harjutuste eest' summary='Harjutuste tähtede reeglid' {...section('learning')} keepMounted>
                <LearningSettingsPanel />
              </ParentAccordionSection>
              <ParentAccordionSection title='Auhinnad' summary={summaries.rewards} {...section('rewards')} keepMounted>
                <RewardsPanel onSummary={reportSummary.rewards} />
              </ParentAccordionSection>
              <ParentAccordionSection title='Teade laste avalehel' summary='Tekst laste avalehel' {...section('notice')}>
                <ParentNoticePanel request={api.request} onError={api.setError} onNotice={api.setNotice} />
              </ParentAccordionSection>
              <ParentAccordionSection title='Võrguühenduseta kasutus' summary='Ettevalmistus ja sünkroonimine' {...section('offline')}>
                <OfflineReadiness />
              </ParentAccordionSection>
              <ParentAccordionSection title='Ajaloo haldamine' summary={summaries.history} {...section('history')} keepMounted>
                <HistoryAdminPanel onSummary={reportSummary.history} />
              </ParentAccordionSection>
              <ParentAccordionSection title='Minu parool' summary='Lapsevanema ala ligipääs' {...section('password')}>
                <ParentPasswordPanel request={api.request} onError={api.setError} onNotice={api.setNotice} />
              </ParentAccordionSection>
            </div>
          </>
        )}
      </fieldset>

      <nav className='pv-tabs' aria-label='Lapsevanema ala'>
        {TAB_LINKS.map((link) => (
          <Link key={link.view} className='pv-tab' href={link.href} aria-current={view === link.view ? 'page' : undefined}>{link.label}</Link>
        ))}
      </nav>
    </section>
  );
}

function ParentTop({ title, note, action }: { title: string; note: string; action: ReactNode }) {
  return (
    <header className='pv-top'>
      <div><h1>{title}</h1><p>{note}</p></div>
      {action}
    </header>
  );
}

function HaldaTab({ id, current, seen, children }: { id: ParentHaldaTab; current: ParentHaldaTab; seen: Set<ParentHaldaTab>; children: ReactNode }) {
  if (!seen.has(id)) return null;
  return <div className='pv-tab-panel' hidden={id !== current}>{children}</div>;
}
