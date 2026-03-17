import type {
  ParsedResponse,
  Metric,
  Insight,
  Action,
  ParserConfig,
  StreamingState,
} from './types';
import { tokenizeText } from './tokenizer';
import { detectMetrics } from './metric-detector';
import { classifyIntent } from './intent-classifier';

const DEFAULT_CONFIG: ParserConfig = {
  confidenceThreshold: 0.3,
  hint: 'general',
  strict: false,
};

/**
 * Parse an LLM response into structured data
 */
export function parseAIResponse(text: string, config?: ParserConfig): ParsedResponse {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = new Date().toISOString();

  // Normalize input
  const normalized = normalizeText(text);
  const sentences = tokenizeText(normalized);

  const metrics: Metric[] = [];
  const insights: Insight[] = [];
  const actions: Action[] = [];
  const unparsed: string[] = [];

  // Process each sentence
  for (const sentence of sentences) {
    // Try to extract metrics
    const metricMatch = detectMetrics(sentence, mergedConfig.hint);
    if (metricMatch && metricMatch.confidence >= mergedConfig.confidenceThreshold!) {
      metrics.push(metricMatch);
      continue;
    }

    // Try to classify intent
    const intent = classifyIntent(sentence);
    if (intent.type === 'action' && intent.confidence >= mergedConfig.confidenceThreshold!) {
      actions.push({
        text: sentence,
        priority: intent.priority as 'high' | 'medium' | 'low',
        confidence: intent.confidence,
      });
    } else if (intent.type === 'insight') {
      insights.push({
        text: sentence,
        category: intent.category as 'factual' | 'question' | 'observation',
        confidence: intent.confidence,
      });
    } else {
      // Low confidence or unclassified
      unparsed.push(sentence);
    }
  }

  // Calculate overall confidence
  const allElements = [...metrics, ...insights, ...actions];
  const overallConfidence =
    allElements.length > 0
      ? allElements.reduce((sum, el) => sum + el.confidence, 0) / allElements.length
      : 0;

  return {
    raw: text,
    metrics,
    insights,
    actions,
    confidence: Math.min(1, Math.max(0, overallConfidence)),
    unparsed,
    metadata: {
      processedAt: startTime,
      tokenCount: sentences.length,
      parseMode: 'complete',
    },
  };
}

/**
 * Initialize streaming parser state
 */
export function createStreamingState(): StreamingState {
  return {
    buffer: '',
    lastParsedIndex: 0,
    pendingSentence: '',
    parsedSoFar: {
      metrics: [],
      insights: [],
      actions: [],
      unparsed: [],
      confidence: 0,
      metadata: {
        processedAt: new Date().toISOString(),
        tokenCount: 0,
        parseMode: 'streaming',
      },
    },
  };
}

/**
 * Process a chunk of streaming text and update the parsed result
 */
export function processStreamChunk(
  chunk: string,
  state: StreamingState,
  config?: ParserConfig
): ParsedResponse {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Append chunk to buffer
  state.buffer += chunk;

  // Find completed sentences (ending with . ! ? or newline)
  const sentenceRegex = /([^.!?\n]+[.!?\n])/g;
  let match;
  let lastIndex = 0;

  const completedSentences: string[] = [];

  while ((match = sentenceRegex.exec(state.buffer)) !== null) {
    completedSentences.push(match[1].trim());
    lastIndex = sentenceRegex.lastIndex;
  }

  // Extract pending text (incomplete sentence)
  state.pendingSentence = state.buffer.substring(lastIndex);

  // Process completed sentences
  for (const sentence of completedSentences) {
    const metricMatch = detectMetrics(sentence, mergedConfig.hint);
    if (metricMatch && metricMatch.confidence >= mergedConfig.confidenceThreshold!) {
      state.parsedSoFar.metrics!.push(metricMatch);
    } else {
      const intent = classifyIntent(sentence);
      if (intent.type === 'action' && intent.confidence >= mergedConfig.confidenceThreshold!) {
        state.parsedSoFar.actions!.push({
          text: sentence,
          priority: intent.priority as 'high' | 'medium' | 'low',
          confidence: intent.confidence,
        });
      } else if (intent.type === 'insight') {
        state.parsedSoFar.insights!.push({
          text: sentence,
          category: intent.category as 'factual' | 'question' | 'observation',
          confidence: intent.confidence,
        });
      } else {
        state.parsedSoFar.unparsed!.push(sentence);
      }
    }
  }

  // Update metadata
  state.parsedSoFar.metadata!.tokenCount = (state.parsedSoFar.metrics?.length || 0) +
    (state.parsedSoFar.insights?.length || 0) +
    (state.parsedSoFar.actions?.length || 0);

  const allElements = [
    ...(state.parsedSoFar.metrics || []),
    ...(state.parsedSoFar.insights || []),
    ...(state.parsedSoFar.actions || []),
  ];

  state.parsedSoFar.confidence = allElements.length > 0
    ? allElements.reduce((sum, el) => sum + el.confidence, 0) / allElements.length
    : 0;

  return state.parsedSoFar as ParsedResponse;
}

/**
 * Normalize text input (remove extra whitespace, etc)
 */
function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\n+/g, '\n')
    .trim();
}

export { StreamingState, ParserConfig };
