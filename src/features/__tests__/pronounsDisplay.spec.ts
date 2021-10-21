import {flatten, flattenDeep} from 'lodash';
import {table} from 'pronouns';

import {extractPronouns} from '../pronounsDisplay';

const separatorsBase = ['/', '|', '//', '||'];
const wrappersBase = [
  ['(', ')'],
  ['((', '))'],
  ['[', ']'],
  ['[[', ']]'],
  ['{', '}'],
  ['{{', '}}'],
];

const separators = flattenDeep([
  separatorsBase,
  Array.from({length: 2}).map((_, index) => {
    return separatorsBase.map((s) => {
      const firstPass = s.padStart(s.length + index + 1, ' ');
      return firstPass.padEnd(firstPass.length + index + 1, ' ');
    });
  }),
]);

const wrappers = flatten([
  wrappersBase,
  ...Array.from({length: 2}).map((_, index) => {
    return wrappersBase.map((w) => {
      return w.map((s) => {
        const firstPass = s.padStart(s.length + index + 1, ' ');
        return firstPass.padEnd(firstPass.length + index + 1, ' ');
      });
    });
  }),
]);

describe('pronouns', () => {
  describe('pairs alone', () => {
    test.each(
      separators.flatMap((sep) => {
        return table
          .map((line) => [line[0], line[1]])
          .map(([subject, object]) => {
            return [`${subject}${sep}${object}`, [subject, object]];
          });
      })
    )('%s', (name, expected) => {
      // @ts-expect-error
      const [, subject, object] = extractPronouns(name);

      expect(subject).toEqual(expected[0]);
      expect(object).toEqual(expected[1]);
    });
  });

  describe('surrounded', () => {
    test.each(
      wrappers.flatMap((wrapper) => {
        return separators.flatMap((sep) => {
          return table
            .map((line) => [line[0], line[1]])
            .map(([subject, object]) => {
              return [`${wrapper[0]}${subject}${sep}${object}${wrapper[1]}`, [subject, object]];
            });
        });
      })
    )('%s', (name, expected) => {
      // @ts-expect-error
      const [, subject, object] = extractPronouns(name);

      expect(subject).toEqual(expected[0]);
      expect(object).toEqual(expected[1]);
    });
  });
});
