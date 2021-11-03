const keywords = ['cw', 'tw', 'cn', 'content warning', 'trigger warning', 'content note'].join('|');
const contentWarningRegex = new RegExp(
  `^([\\[\\(]?(?:${keywords})(?:\\W+)?\\s([^\\n|\\]|\\)|…]+)[\\]\\)…]?)(?:\\s\\n+)?((?:.+)?\\n?)+$`,
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

  let block = contentWarningMatch[1].trim();
  let subject = contentWarningMatch[2].trim();
  let text = contentWarningMatch[3].trim();

  if (block.includes(subject) && !text) {
    const [newSubject, ...newText] = subject.split('. ');
    block = block.replace(newText.join('. '), '').trim();
    subject = (newSubject + '.').trim();
    text = newText.join('. ').trim();
  }

  if (subject.toLowerCase() === 'redacted') {
    return undefined;
  }

  // We want to reject in the case we matched `[xxx]` where `xxx` is some non-latin characters.
  if (subject.match(/[^\p{scx=Common}\p{scx=Latin}]/iu)) {
    return undefined;
  }

  return {
    block,
    subject,
    text,
  };
}
