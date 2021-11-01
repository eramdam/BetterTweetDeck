/* eslint-disable no-useless-escape */
const contentWarningRegex =
  /^([\[\(]?(?:cw|tw|cn)(?:\W+)?\s([^\n|\]|\)|…]+)[\]\)…]?)(?:\n+)?((?:.+)?\n?)+$/i;

interface ContentWarningResult {
  block: string;
  subject: string;
  text: string;
}

export function extractContentWarnings(input: string): ContentWarningResult | undefined {
  const contentWarningMatch = input.match(contentWarningRegex);
  if (!contentWarningMatch) {
    return undefined;
  }

  return {
    block: contentWarningMatch[1].trim(),
    subject: contentWarningMatch[2].trim(),
    text: contentWarningMatch[3].trim(),
  };
}
