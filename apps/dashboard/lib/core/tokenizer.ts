/**
 * Tokenize text into sentences, handling edge cases
 */
export function tokenizeText(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Split by sentence boundaries, preserving punctuation
  const sentences = text
    .split(/([.!?])\s+/)
    .reduce((acc: string[], part, index, arr) => {
      if (index % 2 === 0 && part.trim()) {
        // This is sentence content
        const nextPunct = arr[index + 1];
        if (nextPunct && ['.', '!', '?'].includes(nextPunct)) {
          acc.push((part + nextPunct).trim());
        } else {
          acc.push(part.trim());
        }
      }
      return acc;
    }, []);

  // Filter out empty sentences and code blocks
  return sentences
    .filter((s) => s.length > 0 && !isCodeBlock(s))
    .map((s) => s.trim());
}

/**
 * Check if a sentence is part of a code block
 */
function isCodeBlock(sentence: string): boolean {
  const codePatterns = [/```[\s\S]*?```/, /`[^`]+`/, /^\s*const\s+/, /^\s*function\s+/];
  return codePatterns.some((pattern) => pattern.test(sentence));
}

/**
 * Split text by lines (for list processing)
 */
export function tokenizeLines(text: string): string[] {
  return text.split('\n').filter((line) => line.trim().length > 0);
}

/**
 * Extract words from a sentence
 */
export function tokenizeWords(sentence: string): string[] {
  return sentence
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}
