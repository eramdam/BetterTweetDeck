import {extractPronouns, stringifyPronounResults} from '../pronounsDisplay';

describe('Pronouns', () => {
  describe('Extraction', () => {
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

      ['Solo + matching object', `lorem ipsum | she`, [['she', 'her']]],

      ['Solo + matching object', `lorem ipsume | he |`, [['he', 'him']]],

      ['More than 4 pronouns', 'she/they/fae/he/him/them/her', [['she', 'they', 'fae', 'he']]],

      [
        'No matches',
        `Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio corrupti odio atque ut mollitia exercitationem ullam doloremque, eius ab nihil voluptate, dolore, amet veritatis officia! Odit veniam natus cupiditate it`,
        undefined,
      ],

      ['No matches for mixed separators', `she/her | video`, undefined],

      ['Surrounded and separators', `//they | them//`, [['they', 'them']]],

      ['pronoun.is', 'pronoun.is/he/him', [['he', 'him']]],
      ['pronoun.is', 'pronoun.is/they/them', [['they', 'them']]],
    ])('%s', (_name, input, expected) => {
      const result = extractPronouns(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('Stringify', () => {
    test.each([
      ['Simple pair', '(she/her) [it/its]', 'she/her it/its'],
      ['More than 2 pairs', '(she/her) [it/its] ((they//them)) {{ae/aer}}', 'she/her it/its'],
      ['4+2 pronouns', 'she/they/fae/it he/him', 'she/they/fae/it'],
      ['3+2 pronouns', 'she/they/fae he/him', 'she/they/fae'],
      ['N pronouns', 'she/they/fae/he/him/them/her', 'she/they/fae/he'],
    ])('%s', (_name, input, expected) => {
      const extracted = extractPronouns(input);
      const stringify = stringifyPronounResults(extracted!);

      expect(stringify).toEqual(expected);
    });
  });
});
