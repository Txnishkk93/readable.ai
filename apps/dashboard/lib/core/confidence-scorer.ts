/**
 * Score confidence in extracted elements
 * Higher confidence = more likely to be correct
 */

export function scoreConfidence(
  contextLength: number,
  matchQuality: 'exact' | 'fuzzy' | 'pattern'
): number {
  let score = 0;

  // Base score from match quality
  if (matchQuality === 'exact') {
    score = 0.9;
  } else if (matchQuality === 'fuzzy') {
    score = 0.6;
  } else {
    score = 0.4;
  }

  // Context bonus: more context = higher confidence
  if (contextLength > 50) {
    score += 0.15;
  } else if (contextLength > 20) {
    score += 0.1;
  } else if (contextLength < 5) {
    score -= 0.2;
  }

  return Math.min(1, Math.max(0, score));
}

/**
 * Check if an element has sufficient context
 */
export function hasSufficientContext(sentence: string, minWords: number = 3): boolean {
  const words = sentence.split(/\s+/).filter((w) => w.length > 0);
  return words.length >= minWords;
}
