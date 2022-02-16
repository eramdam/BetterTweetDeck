import {ContentWarningResult} from './contentWarningsHelpers';

export function matchAgainstSpoilerKeywords(
  input: string,
  allowedKeywords: string
): ContentWarningResult | undefined {
  const keywords = allowedKeywords.split(',').map((w) => w.trim().toLowerCase());

  const matchedKeyword = keywords.find((keyword) => {
    return input.toLowerCase().includes(keyword);
  });

  if (!matchedKeyword) {
    return undefined;
  }

  return {
    block: matchedKeyword,
    subject: matchedKeyword,
    text: input,
    shouldRemoveSubject: false,
  };
}
