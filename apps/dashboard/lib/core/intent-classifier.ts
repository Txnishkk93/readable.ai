/**
 * Classify the intent of a sentence
 */
export interface IntentMatch {
  type: 'action' | 'insight' | 'unknown';
  category?: 'factual' | 'question' | 'observation';
  priority?: 'high' | 'medium' | 'low';
  confidence: number;
}

const ACTION_KEYWORDS = [
  'should',
  'must',
  'need',
  'needs',
  'required',
  'require',
  'recommend',
  'suggestion',
  'suggest',
  'fix',
  'improve',
  'address',
  'resolve',
  'consider',
  'implement',
  'add',
  'remove',
  'update',
  'change',
  'investigate',
  'monitor',
];

const HIGH_PRIORITY_KEYWORDS = [
  'critical',
  'urgent',
  'immediately',
  'asap',
  'high priority',
  'must',
  'essential',
  'blocking',
];

const QUESTION_MARKERS = ['?', 'what', 'when', 'where', 'why', 'how', 'which', 'who', 'is', 'are'];

export function classifyIntent(sentence: string): IntentMatch {
  const lower = sentence.toLowerCase();

  // Check for questions
  if (sentence.includes('?') || QUESTION_MARKERS.some((marker) => lower.startsWith(marker))) {
    return {
      type: 'insight',
      category: 'question',
      confidence: 0.85,
    };
  }

  // Check for action keywords
  const actionMatch = ACTION_KEYWORDS.find((kw) => lower.includes(kw));
  if (actionMatch) {
    // Determine priority
    let priority: 'high' | 'medium' | 'low' = 'medium';
    if (HIGH_PRIORITY_KEYWORDS.some((kw) => lower.includes(kw))) {
      priority = 'high';
    } else if (
      ['consider', 'might', 'could', 'optional'].some((kw) => lower.includes(kw))
    ) {
      priority = 'low';
    }

    return {
      type: 'action',
      priority,
      confidence: 0.75,
    };
  }

  // Default: treat as factual insight
  return {
    type: 'insight',
    category: 'factual',
    confidence: 0.6,
  };
}
