import Link from 'next/link';
import { preload } from 'react-dom';
import DailyTasksPanel from '@/app/components/DailyTasksPanel';
import NoticeBoard from '@/app/components/NoticeBoard';
import YesterdayPointsPopup from '@/app/components/YesterdayPointsPopup';
import ChildAvatarEasterEgg from '@/app/components/ChildAvatarEasterEgg';
import ChildExerciseGrid from '@/app/components/ChildExerciseGrid';
import ChildTimetableSection from '@/app/components/ChildTimetableSection';
import { ChildExerciseCard } from '@/lib/childExerciseCards';
import { CHILD_PAGE_DATA_PRELOAD, childPageDataPreloads } from '@/lib/childPageData';
import { getYesterdayPointsSummary } from '@/lib/dailyPointsSummary';
import { Learner } from '@/lib/tasks';

type ChildProfile = {
  learner: Learner;
  name: string;
  avatar: string;
};

export default function ChildHomeDashboard({
  child,
  exercises,
  remediationHref,
  remediationCount,
  loodusopetusHref,
  completedExerciseCounts
}: {
  child: ChildProfile;
  exercises: ChildExerciseCard[];
  remediationHref?: string;
  remediationCount?: number;
  loodusopetusHref?: string;
  completedExerciseCounts?: Record<string, number>;
}) {
  const yesterdayPoints = getYesterdayPointsSummary(child.learner);
  // Start the panel's and the notice board's reads while the JavaScript is
  // still loading; they pick the responses up after hydration. No data goes
  // into the (offline-cached) HTML — see childPageData.ts.
  for (const href of childPageDataPreloads(child.learner)) preload(href, CHILD_PAGE_DATA_PRELOAD);

  return (
    <main className='container child-home-page'>
      <YesterdayPointsPopup learner={child.learner} childName={child.name} summary={yesterdayPoints} />
      <section className='child-home-shell' data-accent={child.learner === 'kiur' ? 'blue' : 'pink'}>
        <Link className='child-home-back' href='/'>← Tagasi</Link>

        {/* Identity, points, shop/history and achievements are one card now, and
            the panel owns three of the four — so the header goes in as a slot
            rather than sitting above as its own block. */}
        <DailyTasksPanel
          learner={child.learner}
          identity={<ChildAvatarEasterEgg learner={child.learner} name={child.name} avatar={child.avatar} />}
          afterIdentity={<ChildTimetableSection learner={child.learner} />}
        />

        <ChildExerciseGrid
          learner={child.learner}
          initialExercises={exercises}
          remediationHref={remediationHref}
          remediationCount={remediationCount}
          loodusopetusHref={loodusopetusHref}
          completedExerciseCounts={completedExerciseCounts ?? {}}
        />

        <NoticeBoard />
      </section>
    </main>
  );
}
