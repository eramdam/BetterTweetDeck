import {extractPronouns} from '../pronounsDisplay';

describe('pronouns', () => {
  test.each([
    // Subject/Possessive
    ['it/its', 'it/its'],
    // Subject/Object
    ['((xey//xyr))', 'xey/xyr'],
    // Multiple pairs (limited to 3)
    [`(she/her) [it/its] ((they//them)) {{ae/aer}}`, 'she/her it/its they/them'],
  ])('%s', (input, expected) => {
    const result = extractPronouns(input) || [];

    expect(result).toStrictEqual(expected);
  });
});
