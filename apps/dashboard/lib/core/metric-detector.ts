import type { Metric } from './types';

export type Hint = 'analytics' | 'customer_feedback' | 'research' | 'monitoring' | 'general';

/**
 * Detect metrics (numbers with units) in a sentence
 */
export function detectMetrics(sentence: string, hint: Hint = 'general'): Metric | null {
  const patterns: Array<{
    regex: RegExp;
    unit?: string;
    priority: number;
  }> = [
    // Percentage patterns (highest priority)
    { regex: /(\d+(?:\.\d+)?)\s*%(?:\s+(?:increase|decrease|growth|change))?/i, unit: '%', priority: 100 },
    { regex: /(?:increase|decrease|growth|change|up|down)\s+(\d+(?:\.\d+)?)\s*%/i, unit: '%', priority: 100 },
    { regex: /from\s+(\d+(?:\.\d+)?)\s*%\s+to\s+(\d+(?:\.\d+)?)\s*%/i, unit: '%', priority: 90 },

    // Time-based metrics
    { regex: /(\d+(?:\.\d+)?)\s*(?:ms|milliseconds?)/i, unit: 'ms', priority: 95 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:sec|seconds?|s)(?!\w)/i, unit: 's', priority: 95 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:min|minutes?)/i, unit: 'min', priority: 90 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:hour|hours?|hrs?)/i, unit: 'h', priority: 90 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:days?|d)(?!\w)/i, unit: 'd', priority: 85 },

    // Currency patterns
    { regex: /\$(\d+(?:,\d{3})*(?:\.\d+)?)/i, unit: '$', priority: 95 },
    { regex: /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:dollars?|USD)/i, unit: '$', priority: 90 },

    // Count metrics (users, requests, items)
    { regex: /(\d+(?:,\d{3})*)\s+(?:users?|requests?|items?|events?|sessions?)/i, priority: 85 },
    { regex: /(\d+(?:,\d{3})*)\s+(?:visitors?|customers?|people)/i, priority: 85 },

    // Size metrics
    { regex: /(\d+(?:\.\d+)?)\s*(?:GB|MB|KB|B)(?!\w)/i, priority: 85 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:gigabytes?|megabytes?|kilobytes?)/i, priority: 80 },

    // General number patterns (lowest priority)
    { regex: /(?:is|are|was|were|has|have|equals?|=)\s+(\d+(?:,\d{3})*(?:\.\d+)?)/i, priority: 50 },
    { regex: /(\d+(?:,\d{3})*(?:\.\d+)?)\s+(?:of|out of)/i, priority: 45 },
  ];

  // Try hint-specific patterns first
  if (hint === 'analytics') {
    patterns.unshift(
      { regex: /(\d+(?:\.\d+)?)\s*(?:conversions?|clicks?)/i, priority: 100 },
      { regex: /CTR:?\s+(\d+(?:\.\d+)?)\s*%/i, unit: '%', priority: 100 },
      { regex: /bounce\s+rate:?\s+(\d+(?:\.\d+)?)\s*%/i, unit: '%', priority: 100 }
    );
  }

  for (const pattern of patterns) {
    const match = sentence.match(pattern.regex);
    if (match) {
      const value = match[1] ? match[1].replace(/,/g, '') : match[0];
      const confidence = 0.3 + (pattern.priority / 100) * 0.7; // Confidence based on priority

      return {
        label: extractLabel(sentence, match[0]),
        value: parseFloat(value) || value,
        unit: pattern.unit,
        context: sentence,
        confidence: Math.min(1, confidence),
        raw: match[0],
      };
    }
  }

  return null;
}

/**
 * Extract a meaningful label for a metric from the sentence
 */
function extractLabel(sentence: string, metricMatch: string): string {
  const beforeMetric = sentence.substring(0, sentence.indexOf(metricMatch)).trim();
  const afterMetric = sentence.substring(sentence.indexOf(metricMatch) + metricMatch.length).trim();

  // Try to find a label before the metric
  const beforeWords = beforeMetric.split(/\s+/).slice(-3).join(' ');
  if (beforeWords && beforeWords.length > 0) {
    return beforeWords;
  }

  // Try to find a label after the metric
  const afterWords = afterMetric.split(/\s+/).slice(0, 3).join(' ');
  if (afterWords && afterWords.length > 0) {
    return afterWords;
  }

  // Default: return the metric itself
  return metricMatch;
}
