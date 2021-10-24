import {extractPronouns} from '../pronounsDisplay';

describe('Pronouns extraction', () => {
  test.each([
    ['Subject/Possessive', 'it/its', [['it', 'its']]],

    ['Subject/Object', '((xey//xyr))', [['xey', 'xyr']]],

    [
      'Multiple groups (limited to 3)',
      `(she/her) [it/its] ((they//them)) {{ae/aer}}`,
      [
        ['she', 'her'],
        ['it', 'its'],
        ['they', 'them'],
      ],
    ],

    ['With separator-like before', 'france | they / them', [['they', 'them']]],

    ['Triplet', 'she/they/fae', [['she', 'they', 'fae']]],

    ['Quadruplet', 'she/they/fae/it', [['she', 'they', 'fae', 'it']]],

    ['Solo + matching object', `Opinions/thoughts mine | she`, [['she', 'her']]],

    [
      'No matches',
      `Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio corrupti odio atque ut mollitia exercitationem ullam doloremque, eius ab nihil voluptate, dolore, amet veritatis officia! Odit veniam natus cupiditate at!`,
      undefined,
    ],

    ['Surrounded and separators', `//they | them//`, [['they', 'them']]],
  ])('%s', (_name, input, expected) => {
    const result = extractPronouns(input);

    expect(result).toStrictEqual(expected);
  });
});
