/* eslint-disable no-useless-escape */
const contentWarningRegex =
  /^([\[\(]?(?:cw|tw|cn)(?:\W+)?\s([^\n|\]|\)|…]+)[\]\)…]?)(?:\n+)?((?:.+)?\n?)+$/i;

const spoilerRegex =
  /^(?:[\/\/]+\s|[\[\(]|)([\w]+\sspoiler(?:s)?)(?:[\]\)…]|)(?:[\n.]+|)([\w\W]+)$/i;

interface ContentWarningResult {
  block: string;
  subject: string;
  text: string;
  isSpoiler?: boolean;
}

export function extractContentWarnings(input: string): ContentWarningResult | undefined {
  const contentWarningMatch = input.match(contentWarningRegex);
  if (!contentWarningMatch) {
    const spoilerMatch = input.match(spoilerRegex);

    if (spoilerMatch) {
      return {
        block: spoilerMatch[1].trim(),
        subject: spoilerMatch[1].trim(),
        text: spoilerMatch[2].trim(),
        isSpoiler: true,
      };
    }

    return undefined;
  }

  return {
    block: contentWarningMatch[1].trim(),
    subject: contentWarningMatch[2].trim(),
    text: contentWarningMatch[3].trim(),
  };
}
