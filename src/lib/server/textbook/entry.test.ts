import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { childTextbookHref } from '@/lib/server/textbook/entry';

describe('the textbook link on the child page', () => {
  beforeEach(() => { db.exec('DELETE FROM textbook_unit_publication'); });

  const publish = (unitId: string, published: number) => db.prepare(
    `INSERT INTO textbook_unit_publication (courseId, unitId, published, publishedAt, publishedContentVersion, updatedAt)
     VALUES ('loodusopetus-opik', ?, ?, '2026-10-17T07:00:00Z', 'v', '2026-10-17T07:00:00Z')
     ON CONFLICT(courseId, unitId) DO UPDATE SET published = excluded.published`
  ).run(unitId, published);

  it('is absent until a unit is published, then points to the course', () => {
    expect(childTextbookHref('kiur')).toBeNull();
    publish('lo-opik-u10', 1);
    expect(childTextbookHref('kiur')).toBe('/kiur/loodusopetus/opik');
    publish('lo-opik-u10', 0);
    expect(childTextbookHref('kiur')).toBeNull();
  });

  it('never appears for Kirsi, whose courses do not include the textbook', () => {
    publish('lo-opik-u10', 1);
    expect(childTextbookHref('kirsi')).toBeNull();
  });

  it('ignores a publication row for a unit that is still a draft', () => {
    publish('lo-opik-u22', 1);
    expect(childTextbookHref('kiur')).toBeNull();
  });
});
