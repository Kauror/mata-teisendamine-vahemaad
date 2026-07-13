import Link from 'next/link';
import DailyTasksPanel from '@/app/components/DailyTasksPanel';
import NoticeBoard from '@/app/components/NoticeBoard';
import YesterdayPointsPopup from '@/app/components/YesterdayPointsPopup';
import ChildExerciseGrid from '@/app/components/ChildExerciseGrid';
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
  completedExerciseIds
}: {
  child: ChildProfile;
  exercises: ChildExerciseCard[];
  remediationHref?: string;
  completedExerciseIds?: Set<string>;
}) {
  const yesterdayPoints = getYesterdayPointsSummary(child.learner);

  return (
    <main className='container child-home-page'>
      <YesterdayPointsPopup learner={child.learner} childName={child.name} summary={yesterdayPoints} />
      <section className='child-home-shell'>
        <Link className='child-home-back' href='/'>← Rollivalik</Link>

        <header className='child-home-header'>
          <span className='child-home-avatar' aria-hidden>{child.avatar}</span>
          <div>
            <h1>{child.name}</h1>
          </div>
        </header>

        <DailyTasksPanel learner={child.learner} />

        <ChildExerciseGrid
          learner={child.learner}
          initialExercises={exercises}
          remediationHref={remediationHref}
          completedExerciseIds={completedExerciseIds ? [...completedExerciseIds] : []}
        />

        <NoticeBoard />
      </section>
    </main>
  );
}
