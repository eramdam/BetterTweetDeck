import {extractPronouns, stringifyPronounResults} from '../pronounsDisplay';

describe('Pronouns', () => {
  describe('Extraction', () => {
    test.each([
      ['Subject/Possessive', 'it/its', [['it', 'its']]],

      ['Subject/Object', '((xey//xyr))', [['xey', 'xyr']]],
      ['Subject/Object', '((xey//xyr))', [['xey', 'xyr']]],
      ['Subject/Object with close match', `she/her | VERY`, [['she', 'her']]],
      ['Object/Subject', `her/she`, [['she', 'her']]],
      ['Object/Subject', `🚂She/her🚂`, [['she', 'her']]],

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
      ['Triplet', 'she/her/hers', [['she', 'her']]],

      ['Quadruplet', 'she/they/fae/it', [['she', 'they', 'fae', 'it']]],

      ['Solo + matching object', `lorem ipsum | she`, [['she', 'her']]],

      ['Solo + matching object', `lorem ipsum | he |`, [['he', 'him']]],
      ['Solo + matching object', `lorem ipsum (they)`, [['they', 'them']]],
      ['Solo + matching object', `she, lorem ipsum`, [['she', 'her']]],
      ['Solo + matching object space + unicode', `✿ they ✿`, [['they', 'them']]],
      ['Solo + matching object emoji surrounded', `😀they😀`, [['they', 'them']]],

      ['More than 4 pronouns', 'she/they/fae/he/him/them/her', [['she', 'they', 'fae', 'he']]],

      [
        'No matches',
        `Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio corrupti odio atque ut mollitia exercitationem ullam doloremque, eius ab nihil voluptate, dolore, amet veritatis officia! Odit veniam natus cupiditate it`,
        undefined,
      ],

      ['No matches', `testing.co`, undefined],
      ['No matches', `they'll`, undefined],
      ['No matches', `he's here, here comes the boy`, undefined],
      ['No matches', `they will`, undefined],
      ['No matches', `Omaha, NE`, undefined],
      ['No matches', `ône`, undefined],
      ['No matches', `s/he`, undefined],
      ['No matches', `Ami, si tu tombes un ami sort de l’ombre à ta place`, undefined],
      ['No matches', `co-host`, undefined],
      ['No matches', 'this should not match any/thing', undefined],
      ['No matches', 'this should not match any-thing', undefined],
      ['No matches', 'this should not match any thing', undefined],
      ['No matches', 'this should not match anything', undefined],
      ['No matches', 'he re he ro he re ho ma', undefined],
      ['No matches', 'However, she is still', undefined],

      ['No matches for mixed separators', `she/her | ver`, undefined],

      ['Surrounded and separators', `//they | them//`, [['they', 'them']]],
      ['Separators', String.raw`blablablabla | they\them |`, [['they', 'them']]],

      ['pronoun.is', 'pronoun.is/he/him', [['he', 'him']]],
      ['pronoun.is', 'pronoun.is/they/them', [['they', 'them']]],
      ['any/all', 'any/all', [['any', 'all']]],
      ['any', 'any pronouns', [['any pronouns']]],
      ['any', 'pronouns: any', [['any pronouns']]],
    ])('%s: %s', (_name, input, expected) => {
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
