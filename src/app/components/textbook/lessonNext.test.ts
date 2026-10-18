import { describe, expect, it } from 'vitest';
import { lessonNextCard } from '@/app/components/textbook/pager';

describe('what follows a lesson', () => {
  it('offers practice when this completion finished the reading, even if a lesson follows in order', () => {
    // Lessons 1, 3 and 4 were read first; finishing lesson 2 opens practice.
    expect(lessonNextCard({ practiceUnlocked: true, completed: true, isLast: true, nextLessonId: 'l3' })).toEqual({ show: true, practice: true, nextLesson: 'secondary' });
    // The last required lesson followed by an optional one.
    expect(lessonNextCard({ practiceUnlocked: true, completed: true, isLast: true, nextLessonId: 'l5-extra' }).practice).toBe(true);
  });

  it('points to the next lesson while reading is still open', () => {
    expect(lessonNextCard({ practiceUnlocked: false, completed: true, isLast: true, nextLessonId: 'l2' })).toEqual({ show: true, practice: false, nextLesson: 'primary' });
    expect(lessonNextCard({ practiceUnlocked: true, completed: true, isLast: true, nextLessonId: null })).toEqual({ show: true, practice: true, nextLesson: null });
  });

  it('shows nothing before the end of an unread lesson, and a plain next link when revisiting a read one', () => {
    expect(lessonNextCard({ practiceUnlocked: null, completed: false, isLast: true, nextLessonId: 'l2' }).show).toBe(false);
    expect(lessonNextCard({ practiceUnlocked: null, completed: true, isLast: false, nextLessonId: 'l2' }).show).toBe(false);
    expect(lessonNextCard({ practiceUnlocked: null, completed: true, isLast: true, nextLessonId: 'l2' })).toEqual({ show: true, practice: false, nextLesson: 'primary' });
  });
});
