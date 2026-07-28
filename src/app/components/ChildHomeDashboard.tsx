import Link from 'next/link';
import DailyTasksPanel from '@/app/components/DailyTasksPanel';
import NoticeBoard from '@/app/components/NoticeBoard';
import YesterdayPointsPopup from '@/app/components/YesterdayPointsPopup';
import ChildAvatarEasterEgg from '@/app/components/ChildAvatarEasterEgg';
import ChildExerciseGrid from '@/app/components/ChildExerciseGrid';
import PeekModeBanner from '@/app/components/PeekModeBanner';
import { ChildExerciseCard } from '@/lib/childExerciseCards';
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
  completedExerciseCounts
}: {
  child: ChildProfile;
  exercises: ChildExerciseCard[];
  remediationHref?: string;
  remediationCount?: number;
  completedExerciseCounts?: Record<string, number>;
}) {
  const yesterdayPoints = getYesterdayPointsSummary(child.learner);

  return (
    <main className='container child-home-page'>
      <YesterdayPointsPopup learner={child.learner} childName={child.name} summary={yesterdayPoints} />
      <section className='child-home-shell' data-accent={child.learner === 'kiur' ? 'blue' : 'pink'}>
        <PeekModeBanner />
        <Link className='child-home-back' href='/'>← Tagasi</Link>

        {/* Identity, points, shop/history and achievements are one card now, and
            the panel owns three of the four — so the header goes in as a slot
            rather than sitting above as its own block. */}
        <DailyTasksPanel
          learner={child.learner}
          identity={<ChildAvatarEasterEgg learner={child.learner} name={child.name} avatar={child.avatar} />}
        />

        <ChildExerciseGrid
          learner={child.learner}
          initialExercises={exercises}
          remediationHref={remediationHref}
          remediationCount={remediationCount}
          completedExerciseCounts={completedExerciseCounts ?? {}}
        />

        <NoticeBoard />
      </section>
    </main>
  );
}
