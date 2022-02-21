import {matchAgainstSpoilerKeywords} from '../spoilerHelpers';

describe('Spoiler collapsing', () => {
  it('should work', () => {
    expect(
      matchAgainstSpoilerKeywords('big spoiler for the big movie', 'spoiler,movie')
    ).toStrictEqual({
      block: 'spoiler',
      shouldRemoveSubject: false,
      subject: 'spoiler',
      text: 'big spoiler for the big movie',
    });
  });
});
