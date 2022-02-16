const keywords = ['cw', 'tw', 'cn', 'content warning', 'trigger warning', 'content note'].join('|');
const contentWarningRegex = new RegExp(
  `^([\\[\\(]?\\b(?:${keywords})\\b(?:\\W+)?\\s?([^\\n|\\]|\\)|…]+)[\\]\\)…]?)(?:\\s\\n+)?((?:.+)?\\n?)+$`,
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

export function extractContentWarnings(
  input: string,
  /** Comma separated keywords */
  allowedKeywords: string
): ContentWarningResult | undefined {
  const keywords = allowedKeywords.split(',').map((w) => w.trim().toLowerCase());
  const contentWarningMatch = input.match(contentWarningRegex) || input.match(withoutKeywordRegex);
  const isWithoutKeyword = !input.match(contentWarningRegex) && input.match(withoutKeywordRegex);
  if (!contentWarningMatch) {
    return undefined;
  }

  let block = contentWarningMatch[1].trim();
  let subject = contentWarningMatch[2].trim();
  let text = contentWarningMatch[3].trim();

  if (block.includes(subject) && !text) {
    const [newSubject, ...newText] = subject.split('. ');
    block = block.replace(newText.join('. '), '').trim();
    subject = (newSubject + '.').trim();
    text = newText.join('. ').trim();
  }

  if (isWithoutKeyword) {
    const subjects = subject.split(',').map((w) => w.toLowerCase());
    // If the keyword(s) we detected are NOT in the list of allowed keywords then we don't match
    if (
      !keywords.some((allowedKeyword) => {
        return subjects.includes(allowedKeyword);
      })
    ) {
      return undefined;
    }
  }

  return {
    block,
    subject,
    text,
  };
}
