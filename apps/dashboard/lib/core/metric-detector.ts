import type { Metric } from './types';

export type Hint = 'analytics' | 'customer_feedback' | 'research' | 'monitoring' | 'general';

const patterns: Array<{
  regex: RegExp;
  unit?: string;
  priority: number;
}> = [
  { regex: /(?:increase|decrease|growth|change|up|down|rose|fell|climbed|dropped|improved|jumped|increased|reduced|declined)\s+(\d+(?:\.\d+)?)\s*%/i, unit: '%', priority: 100 },
  { regex: /(\d+(?:\.\d+)?)\s*%(?:\s+(?:increase|decrease|growth|change|up|down))?/i, unit: '%', priority: 100 },
  { regex: /from\s+(\d+(?:\.\d+)?)\s*%\s+to\s+(\d+(?:\.\d+)?)\s*%/i, unit: '%', priority: 95 },
  { regex: /\$(\d+(?:,\d{3})*(?:\.\d+)?(?:[kmb])?)/i, unit: '$', priority: 95 },
  { regex: /(\d+(?:,\d{3})*(?:\.\d+)?(?:[kmb]))\b\s*(?:dollars?|USD)?/i, unit: '$', priority: 90 },
  { regex: /(\d+(?:\.\d+)?)\s*(?:ms|milliseconds?)(?![a-z])/i, unit: 'ms', priority: 95 },
  { regex: /(\d+(?:\.\d+)?)\s*(?:sec|seconds?|s)(?!\w)/i, unit: 's', priority: 95 },
  { regex: /(\d+(?:\.\d+)?)\s*(?:min|minutes?)/i, unit: 'min', priority: 90 },
  { regex: /(\d+(?:\.\d+)?)\s*(?:hour|hours?|hrs?)/i, unit: 'h', priority: 90 },
  { regex: /(\d+(?:\.\d+)?)\s*(?:days?|d)(?!\w)/i, unit: 'd', priority: 85 },
  { regex: /(\d+(?:,\d{3})*)\s+(?:users?|requests?|items?|events?|sessions?|tickets?|comments?|customers?|people|leads?|orders?|visitors?|blockers?|jobs?|responses?)/i, priority: 85 },
  { regex: /(\d+(?:,\d{3})*)\s+(?:visitors?|customers?|people|tickets?|comments?|orders?|responses?|leads?|issues?)/i, priority: 85 },
  { regex: /(\d+(?:\.\d+)?)\s*(?:GB|MB|KB|B)(?!\w)/i, priority: 80 },
  { regex: /(\d+(?:\.\d+)?)\s*(?:gigabytes?|megabytes?|kilobytes?)/i, priority: 80 },
  { regex: /(?:is|are|was|were|has|have|equals?|=)\s+(\d+(?:,\d{3})*(?:\.\d+)?)/i, priority: 60 },
  { regex: /(\d+(?:,\d{3})*(?:\.\d+)?)\s+(?:of|out of)/i, priority: 45 },
];

/**
 * Detect metrics (numbers with units) in a sentence.
 * This returns the first strong metric match, while `extractMetrics` handles the
 * multi-metric prose cases that are common in real LLM output.
 */
export function detectMetrics(sentence: string, hint: Hint = 'general'): Metric | null {
  const metrics = extractMetrics(sentence, hint);
  return metrics[0] ?? null;
}

export function extractMetrics(sentence: string, hint: Hint = 'general'): Metric[] {
  const rangeMetric = extractRangeMetric(sentence);
  if (rangeMetric) {
    return [rangeMetric];
  }

  const workingSentence = sentence.replace(/from\s+.*?\s+to\s+.*?(?=\s|$)/gi, ' ');

  const allPatterns = hint === 'analytics'
    ? [
        { regex: /(\d+(?:\.\d+)?)\s*(?:conversions?|clicks?)/i, priority: 100 },
        { regex: /CTR:?\s+(\d+(?:\.\d+)?)\s*%/i, unit: '%', priority: 100 },
        { regex: /bounce\s+rate:?\s+(\d+(?:\.\d+)?)\s*%/i, unit: '%', priority: 100 },
        ...patterns,
      ]
    : patterns;

  const found: Metric[] = [];
  const seen = new Set<string>();

  for (const pattern of allPatterns) {
    const regex = new RegExp(pattern.regex.source, 'gi');
    let match;

    while ((match = regex.exec(workingSentence)) !== null) {
      const raw = match[0].trim();
      const valueSource = match[1] ?? raw;
      const normalizedValue = String(valueSource).replace(/[$,]/g, '').replace(/[kmb]$/i, '');
      const parsedValue = Number(normalizedValue);

      const metric: Metric = {
        label: extractLabel(workingSentence, raw),
        value: Number.isFinite(parsedValue) ? parsedValue : raw,
        unit: pattern.unit ?? inferUnit(raw),
        context: sentence,
        confidence: Math.min(1, 0.3 + (pattern.priority / 100) * 0.7),
        raw,
      };

      const dedupeKey = `${metric.raw.toLowerCase()}:${String(metric.value)}:${metric.unit ?? ''}`;
      if (!seen.has(dedupeKey)) {
        found.push(metric);
        seen.add(dedupeKey);
      }
    }
  }

  const deduped: Metric[] = [];
  for (const metric of found.sort((a, b) => sentence.indexOf(a.raw) - sentence.indexOf(b.raw))) {
    const duplicateIndex = deduped.findIndex((existing) => {
      const sameValue = String(existing.value).replace(/\s+/g, '') === String(metric.value).replace(/\s+/g, '');
      const sameUnit = (existing.unit ?? '').toLowerCase() === (metric.unit ?? '').toLowerCase();
      const overlap = existing.raw.toLowerCase().includes(metric.raw.toLowerCase()) || metric.raw.toLowerCase().includes(existing.raw.toLowerCase());
      return sameValue && sameUnit && overlap;
    });

    if (duplicateIndex >= 0) {
      const existing = deduped[duplicateIndex];
      if (metric.raw.length > existing.raw.length || (metric.raw.length === existing.raw.length && metric.confidence > existing.confidence)) {
        deduped[duplicateIndex] = metric;
      }
      continue;
    }

    deduped.push(metric);
  }

  return deduped;
}

function extractRangeMetric(sentence: string): Metric | null {
  const rangePattern = /from\s+(\d+(?:[.,]\d+)?)\s*([a-z%$]+)?\s+to\s+(\d+(?:[.,]\d+)?)\s*([a-z%$]+)?/i;
  const match = sentence.match(rangePattern);

  if (!match) return null;

  const finalValue = Number(String(match[3]).replace(/,/g, ''));
  const finalUnit = (match[4] || inferUnit(`${match[3]}${match[4] ?? ''}`) || inferUnit(match[0])) ?? undefined;

  if (!Number.isFinite(finalValue)) return null;

  return {
    label: extractLabel(sentence, match[0]),
    value: finalValue,
    unit: finalUnit,
    context: sentence,
    confidence: 0.9,
    raw: `${match[3]}${match[4] ? match[4] : ''}`.trim(),
  };
}

function inferUnit(raw: string): string | undefined {
  if (/%/.test(raw)) return '%';
  if (/ms/i.test(raw)) return 'ms';
  if (/sec|second/i.test(raw)) return 's';
  if (/min|minute/i.test(raw)) return 'min';
  if (/hour|hrs?/i.test(raw)) return 'h';
  if (/day/i.test(raw)) return 'd';
  if (/\$/.test(raw)) return '$';
  if (/user|visitor|customer|response|ticket|comment|lead|issue|order|job|request|event|session|visit|blocker|escalation|story/i.test(raw)) return 'count';
  return undefined;
}

function extractLabel(sentence: string, metricMatch: string): string {
  const index = sentence.indexOf(metricMatch);
  if (index === -1) return metricMatch;

  const beforeMetric = sentence.substring(0, index).trim();
  const afterMetric = sentence.substring(index + metricMatch.length).trim();

  const beforeWords = beforeMetric.split(/\s+/).filter(Boolean).slice(-4).join(' ').replace(/[.,;:!?]+$/g, '');
  const afterWords = afterMetric.split(/\s+/).filter(Boolean).slice(0, 4).join(' ').replace(/^[.,;:!?]+/g, '');

  const preferred = beforeWords || afterWords || metricMatch;
  return preferred
    .replace(/^(?:is|are|was|were|has|have|in|from|to|at|on|by|with|for|of|and|the|a|an)\b/i, '')
    .replace(/[.,;:!?]+$/g, '')
    .trim() || metricMatch;
}
