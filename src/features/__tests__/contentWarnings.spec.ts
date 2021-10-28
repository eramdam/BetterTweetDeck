import {extractContentWarnings} from '../contentWarningsHelpers';

describe('Content warnings detection', () => {
  describe('Basic', () => {
    test.each([
      ['[cw: foo]\nbla', ['[cw: foo]', 'foo']],
      ['[cn foo]\nbla', ['[cn foo]', 'foo']],
      ['tw: foo\nbla', ['tw: foo', 'foo']],
      ['tw / foo\nbla', ['tw / foo', 'foo']],
      ['cn/// foo\nbla', ['cn/// foo', 'foo']],
      ['cw foo\nbla', ['cw foo', 'foo']],
      ['cw foo \n.\n.\n.\n.\n. bla', ['cw foo', 'foo']],
      ['cw foo \n-\n-\n-\n-\n- bla', ['cw foo', 'foo']],
      ['cw: foo, bar, etc… bla', ['cw: foo, bar, etc…', 'foo, bar, etc']],
    ])('%s', (input, expected) => {
      const result = extractContentWarnings(input) as NonNullable<
        ReturnType<typeof extractContentWarnings>
      >;
      expect(result).toBeTruthy();
      const {block, subject, text, isSpoiler} = result;

      expect(block).toEqual(expected[0]);
      expect(subject).toEqual(expected[1]);
      expect(text).toBeTruthy();
      expect(isSpoiler).toBeFalsy();
    });
  });

  describe('Spoilers', () => {
    test.each([
      ['// foobar spoilers bla', ['foobar spoilers', 'bla']],
      ['foobar spoilers\nbla', ['foobar spoilers', 'bla']],
      ['[foobar spoilers]\nbla', ['foobar spoilers', 'bla']],
      ['foobar spoilers \n.\n.\n.\n.\n. bla', ['foobar spoilers', 'bla']],
    ])('%s', (input, expected) => {
      const result = extractContentWarnings(input) as NonNullable<
        ReturnType<typeof extractContentWarnings>
      >;
      expect(result).toBeTruthy();
      const {block, subject, text, isSpoiler} = result;

      expect(block).toEqual(expected[0]);
      expect(subject).toEqual(expected[0]);
      expect(text).toBeTruthy();
      expect(isSpoiler).toBeTruthy();
    });
  });

  describe('No match', () => {
    test.each([
      'lorem ipsum cw foobar',
      'Lorem ipsum dolor sit, amet consectetur',
      'urgh i hate spoilers what the hell',
      'please cw your spoilers!!!',
      'foobar spoiler baz bar',
    ])('%s', (input) => {
      expect(extractContentWarnings(input)).toBeUndefined();
    });
  });
});
