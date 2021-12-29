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

export function extractContentWarnings(input: string): ContentWarningResult | undefined {
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
    // If the subject isn't lowercase, it might not be useful
    if (subject[0].toLowerCase() !== subject[0]) {
      return undefined;
    }

    // If the subject has spaces, it might not be useful
    if (subject.split(/\s/).length > 1) {
      return undefined;
    }
  }

  // We want to reject in the case we matched `[xxx]` where `xxx` is some non-latin characters.
  if (subject.match(/[^\p{scx=Common}\p{scx=Latin}]/iu)) {
    return undefined;
  }

  // If there's no word, we can ignore
  if (!subject.match(/[\p{L}\p{M}]/giu)) {
    return undefined;
  }

  return {
    block,
    subject,
    text,
  };
}
