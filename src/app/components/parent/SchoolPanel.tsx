'use client';

import { todayDateString } from '@/lib/appDate';
import { taskHeadline, type SchoolTaskLine } from '@/lib/schoolText';
import { learnerLabel } from './format';
import { LEARNERS } from './types';
import { useParentResource } from './useParentApi';

type News = { child: 'kiur' | 'kirsi' | null; date: string; kind: 'grade' | 'absence' | 'note' | 'message'; subject: string; value: string; text: string };
type Overview =
  | { connected: false }
  | {
      connected: true;
      receivedAt: string;
      children: Record<'kiur' | 'kirsi', SchoolTaskLine[]>;
      recent: News[];
      events: Array<{ date: string; time: string; title: string }>;
    };

const KIND_LABEL: Record<News['kind'], string> = { grade: 'Hinne', absence: 'Puudumine', note: 'Märkus', message: 'Kiri' };

function shortDate(date: string) {
  const [, m, d] = date.split('-');
  return `${Number(d)}.${Number(m)}`;
}

function newsLine(item: News) {
  const who = item.child ? `${learnerLabel(item.child)} · ` : '';
  const value = item.value ? ` ${item.value}` : '';
  return `${shortDate(item.date)} ${who}${KIND_LABEL[item.kind]}: ${item.subject}${value}`;
}

// School news from Minu: what each child sees ("Koolis tulemas"), plus the
// grades, notes, teachers' mail and school events only the parent sees.
export function SchoolPanel() {
  const { data } = useParentResource<Overview>('school');
  if (!data) return <section className='parent-card'><p>Laadin...</p></section>;
  if (!data.connected) {
    return <section className='parent-card'><p>Minu pole veel kooliinfot saatnud. See tuleb eKooli kirjadest automaatselt.</p></section>;
  }
  const today = todayDateString();
  const received = new Date(data.receivedAt).toLocaleString('et-EE', { timeZone: 'Europe/Tallinn', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
  return (
    <section className='parent-card'>
      <p className='parent-school-meta'>Minu saatis viimati {received}</p>
      {LEARNERS.map((child) => (
        <div key={child} className='parent-school-group'>
          <h3>{learnerLabel(child)} näeb</h3>
          {data.children[child].length === 0 ? <p className='parent-school-meta'>Tulemas pole midagi.</p> : (
            <ul>
              {data.children[child].map((task, index) => (
                <li key={`${task.date}-${index}`}>{task.kind === 'test' ? '📝 ' : '📚 '}<strong>{taskHeadline(task, today)}</strong>{task.text ? ` ${task.text}` : ''}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {data.events.length > 0 && (
        <div className='parent-school-group'>
          <h3>Kooli sündmused</h3>
          <ul>{data.events.map((e, i) => <li key={`${e.date}-${i}`}>{shortDate(e.date)}{e.time ? ` ${e.time}` : ''} {e.title}</li>)}</ul>
        </div>
      )}
      <div className='parent-school-group'>
        <h3>Viimased kaks nädalat</h3>
        {data.recent.length === 0 ? <p className='parent-school-meta'>Uusi teateid pole.</p> : (
          <ul className='parent-school-news'>
            {data.recent.map((item, i) => (
              <li key={`${item.date}-${i}`}>
                {item.text ? <details><summary>{newsLine(item)}</summary><p>{item.text}</p></details> : newsLine(item)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
