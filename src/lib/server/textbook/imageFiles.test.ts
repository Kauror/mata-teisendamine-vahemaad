import { describe, expect, it } from 'vitest';
import { loodusopetusOpikCourse } from '@/content/textbook/loodusopetus-opik';
import capabilities from '@/lib/offline/capabilities.json';
import { textbookImageExists } from '@/lib/server/textbook/imageFiles';
import type { ImageBlock } from '@/lib/textbook/types';

const imageBlocks = loodusopetusOpikCourse.units
  .flatMap((unit) => unit.lessons)
  .flatMap((lesson) => lesson.sections)
  .flatMap((section) => section.blocks)
  .filter((block): block is ImageBlock => block.type === 'image');

describe('textbook image files', () => {
  it('every image block of the shipped course has its file in public/', () => {
    expect(imageBlocks.map((block) => block.src)).toEqual(['/textbook-images/nasa-apollo17-blue-marble.webp']);
    for (const block of imageBlocks) expect(textbookImageExists(block.src), block.src).toBe(true);
  });

  it('looks only inside public/textbook-images', () => {
    expect(textbookImageExists('/textbook-images/does-not-exist.webp')).toBe(false);
    expect(textbookImageExists('/web-app-manifest-192x192.png')).toBe(false);
    expect(textbookImageExists('/textbook-images/../web-app-manifest-192x192.png')).toBe(false);
  });

  it('keeps textbook photos online-only: the offline precache never lists them', () => {
    expect(capabilities.publicAssets.some((asset: string) => asset.startsWith('/textbook-images/'))).toBe(false);
  });
});
