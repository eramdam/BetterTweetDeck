const keywords = ['cw', 'tw', 'cn', 'content warning', 'trigger warning', 'content note'].join('|');
const contentWarningRegex = new RegExp(
  `^([\\[\\(]?(?:${keywords}|)(?:\\W+)?\\s([^\\n|\\]|\\)|…]+)[\\]\\)…]?)(?:\\n+)?((?:.+)?\\n?)+$`,
  'i'
);
const withoutKeywordRegex = new RegExp(
  `^([\\[]([^\\n|\\[\\]|…]+)[\\]\\)…])(?:\\n+)?((?:.+)?\\n?)+$`,
  'i'
);

interface ContentWarningResult {
  block: string;
  subject: string;
  text: string;
}

export function extractContentWarnings(input: string): ContentWarningResult | undefined {
  const contentWarningMatch = input.match(contentWarningRegex) || input.match(withoutKeywordRegex);
  if (!contentWarningMatch) {
    return undefined;
  }

  return {
    block: contentWarningMatch[1].trim(),
    subject: contentWarningMatch[2].trim(),
    text: contentWarningMatch[3].trim(),
  };
}
