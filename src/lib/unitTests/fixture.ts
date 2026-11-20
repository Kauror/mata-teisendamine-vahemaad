import { UNIT_TEST_FORMAT } from './types';

// A small unit test with every exercise type, for the tests. Invented text:
// the real workbook content is never in the repository.
export function sampleUnitTest(unit = 3, variant: 'A' | 'B' = 'A') {
  return {
    format: UNIT_TEST_FORMAT,
    unit,
    variant,
    title: 'Sample',
    exercises: [
      {
        id: '1',
        type: 'choice',
        instruction: 'Vali õige vastus.',
        scene: 'Pildil on kaks tüdrukut toas.',
        wordBank: ['Yes, they are.', 'No, they aren\'t.'],
        items: [
          { id: '0', prompt: 'Are they girls?', answer: 'Yes, they are.', example: true },
          { id: '1', prompt: 'Are they outside?', answer: 'No, they aren\'t.' },
          { id: '2', prompt: 'Are they inside?', answer: 'Yes, they are.' }
        ]
      },
      {
        id: '2',
        type: 'text',
        instruction: 'Kirjuta sõnad inglise ja eesti keeles.',
        items: [
          { id: '1', prompt: '[spɒt]', fields: ['inglise keeles', 'eesti keeles'], answers: [['spot'], ['täpp', 'laik']], check: 'auto' },
          { id: '2', prompt: 'Write about your day.', answers: [['I get up at seven.']], check: 'parent' }
        ]
      },
      {
        id: '3',
        type: 'order',
        instruction: 'Kirjuta küsimused.',
        items: [{ id: '1', tokens: ['Estonian', 'are', 'you'], answers: ['Are you Estonian?'] }]
      },
      {
        id: '4',
        type: 'crossword',
        instruction: 'Lahenda ristsõna.',
        entries: [
          { number: 1, clue: 'kass', answer: 'CAT', row: 0, col: 0, dir: 'across' },
          { number: 1, clue: 'auto', answer: 'CAR', row: 0, col: 0, dir: 'down' }
        ]
      }
    ]
  };
}
