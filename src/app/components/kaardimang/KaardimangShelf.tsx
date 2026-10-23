import type { KaardimangAchievementView } from '@/lib/kaardimang/api';

// A player's Kaardimäng achievements (backlog KM-03). The full shelf on the
// game's home screen: earned ones first, then the closest to earning.
export default function KaardimangShelf({ achievements }: { achievements: KaardimangAchievementView[] }) {
  if (!achievements.length) return null;
  const sorted = [...achievements].sort((left, right) => Number(right.unlocked) - Number(left.unlocked) || right.current / right.target - left.current / left.target);
  const earned = achievements.filter((item) => item.unlocked).length;
  return (
    <details className='km-card km-shelf' open={earned > 0}>
      <summary>🏅 Saavutused <span className='tb-muted'>{earned} / {achievements.length}</span></summary>
      <ul className='km-shelf-list'>
        {sorted.map((item) => (
          <li key={item.id} className='km-shelf-item' data-unlocked={item.unlocked ? 'true' : 'false'} title={item.description}>
            <span className='km-shelf-emoji' aria-hidden>{item.emoji}</span>
            <span className='km-shelf-text'>
              <strong>{item.title}</strong>
              <small>{item.unlocked ? 'Tehtud!' : `${item.description} · ${item.current} / ${item.target}`}</small>
              {item.unlocked ? null : <i className='km-shelf-bar' aria-hidden><b style={{ width: `${Math.round((item.current / item.target) * 100)}%` }} /></i>}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
