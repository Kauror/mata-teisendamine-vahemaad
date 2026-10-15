import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { preload } from 'react-dom';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CHILD_PAGE_DATA_PRELOAD, childDashboardUrl, childPageDataPreloads, NOTICE_URL } from '@/lib/childPageData';

function renderPreloads(learner: 'kiur' | 'kirsi') {
  function Probe() {
    for (const href of childPageDataPreloads(learner)) preload(href, CHILD_PAGE_DATA_PRELOAD);
    return createElement('main', null, 'x');
  }
  return renderToString(createElement(Probe));
}

describe('child page data preloads (WEB-07)', () => {
  it('preloads exactly the URLs the panel and the notice board fetch', () => {
    expect(childPageDataPreloads('kiur')).toEqual(['/api/child-dashboard?learner=kiur', '/api/notice']);
    expect(childPageDataPreloads('kirsi')).toEqual([childDashboardUrl('kirsi'), NOTICE_URL]);
  });

  it('renders a CORS-mode fetch preload so a plain same-origin fetch() reuses it', () => {
    const html = renderPreloads('kiur');
    // crossorigin="" is what makes the preload's mode match fetch()'s default
    // (cors, same-origin credentials); without it the browser fetches twice.
    expect(html).toContain('<link rel="preload" href="/api/child-dashboard?learner=kiur" as="fetch" crossorigin=""/>');
    expect(html).toContain('<link rel="preload" href="/api/notice" as="fetch" crossorigin=""/>');
  });

  it('puts no child data into the document — the markup depends on the route learner only', () => {
    // The offline shell replays this HTML, and a peeking parent must get the
    // same document as the child: two renders are byte-identical.
    expect(renderPreloads('kirsi')).toBe(renderPreloads('kirsi'));
    expect(renderPreloads('kirsi')).not.toContain('kiur');
  });

  it('the fetching components build their URLs from the same helpers', () => {
    const read = (file: string) => readFileSync(path.join(__dirname, '..', 'app', 'components', file), 'utf8');
    expect(read('DailyTasksPanel.tsx')).toContain('fetch(childDashboardUrl(learner))');
    expect(read('NoticeBoard.tsx')).toContain('fetch(NOTICE_URL)');
    expect(read('ChildHomeDashboard.tsx')).toContain('preload(href, CHILD_PAGE_DATA_PRELOAD)');
  });
});
