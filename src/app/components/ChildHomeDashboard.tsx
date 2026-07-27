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
  completedExerciseIds
}: {
  child: ChildProfile;
  exercises: ChildExerciseCard[];
  remediationHref?: string;
  remediationCount?: number;
  completedExerciseIds?: Set<string>;
}) {
  const yesterdayPoints = getYesterdayPointsSummary(child.learner);

  return (
    <main className='container child-home-page'>
      <YesterdayPointsPopup learner={child.learner} childName={child.name} summary={yesterdayPoints} />
      <section className='child-home-shell'>
        <PeekModeBanner />
        <Link className='child-home-back' href='/'>← Rollivalik</Link>

        <header className='child-home-header'>
          <ChildAvatarEasterEgg learner={child.learner} name={child.name} avatar={child.avatar} />
        </header>

        <DailyTasksPanel learner={child.learner} />

        <ChildExerciseGrid
          learner={child.learner}
          initialExercises={exercises}
          remediationHref={remediationHref}
          remediationCount={remediationCount}
          completedExerciseIds={completedExerciseIds ? [...completedExerciseIds] : []}
        />

        <NoticeBoard />
      </section>
    </main>
  );
}
