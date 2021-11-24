import {extractContentWarnings} from '../contentWarningsHelpers';

describe('Content warnings detection', () => {
  describe('Basic', () => {
    test.each([
      ['[food] \nbla', ['[food]', 'food']],
      ['[fôod] \nbla', ['[fôod]', 'fôod']],
      ['[cw: foo]\nbla', ['[cw: foo]', 'foo']],
      ['[cn foo]\nbla', ['[cn foo]', 'foo']],
      ['tw: foo\nbla', ['tw: foo', 'foo']],
      ['tw / foo\nbla', ['tw / foo', 'foo']],
      ['cn/// foo\nbla', ['cn/// foo', 'foo']],
      ['cw foo\nbla', ['cw foo', 'foo']],
      ['cw foo \n.\n.\n.\n.\n. bla', ['cw foo', 'foo']],
      ['cw foo \n-\n-\n-\n-\n- bla', ['cw foo', 'foo']],
      ['cw: foo, bar, etc… bla', ['cw: foo, bar, etc…', 'foo, bar, etc']],
      ['content warning: foo, bar, etc… bla', ['content warning: foo, bar, etc…', 'foo, bar, etc']],
      ['cw // foobar. blablabla blablablabla. aaa', ['cw // foobar.', 'foobar.']],
      [`tw/foobar\n bla`, ['tw/foobar', 'foobar']],
      [`content warning/foobar\n bla`, ['content warning/foobar', 'foobar']],
      [`trigger warning/foobar\n bla`, ['trigger warning/foobar', 'foobar']],
    ])('%s', (input, expected) => {
      const result = extractContentWarnings(input) as NonNullable<
        ReturnType<typeof extractContentWarnings>
      >;
      expect(result).toBeTruthy();
      const {block, subject, text} = result;

      expect(block).toEqual(expected[0]);
      expect(subject).toEqual(expected[1]);
      expect(text).toBeTruthy();
    });
  });

  describe('No match', () => {
    test.each([
      '[REDACTED]. blabla',
      '[Communiqué]. blabla',
      'This is something for [REDACTED]. foobar',
      'lorem ipsum cw foobar',
      'Lorem ipsum dolor sit, amet consectetur',
      'this is my [food]',
      '[[big shot]]',
      '[2021/11/14 02:51]',
      '[Lottie] foobar',
      'What you want is [[hyperlink blocked]]',
      '[新キャラ] foobar',
      `Tweet Deck added pronoun detection (based on what users put in their profile)`,
      `【新キャラ追加告知】
      明日11/03(水)に、`,
      `[baldur's gate 2 voice] you must bring me a hoagie from wawa before venturing forth`,
    ])('%s', (input) => {
      expect(extractContentWarnings(input)).toBeUndefined();
    });
  });
});
