/**
 * Core types for the readable.ai parser engine
 */

export interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  context?: string;
  confidence: number;
  raw: string;
}

export interface Insight {
  text: string;
  category: 'factual' | 'question' | 'observation';
  confidence: number;
}

export interface Action {
  text: string;
  priority?: 'high' | 'medium' | 'low';
  confidence: number;
}

export interface ParsedResponse {
  /** Raw input text */
  raw: string;
  /** Extracted metrics */
  metrics: Metric[];
  /** Extracted insights */
  insights: Insight[];
  /** Extracted actions */
  actions: Action[];
  /** Overall confidence in parse accuracy (0-1) */
  confidence: number;
  /** Fallback text for unparseable content */
  unparsed: string[];
  /** Processing metadata */
  metadata: {
    processedAt: string;
    tokenCount: number;
    parseMode: 'streaming' | 'complete';
  };
}

export interface ParserConfig {
  /** Confidence threshold (0-1). Elements below this become plain text. Default: 0.3 */
  confidenceThreshold?: number;
  /** Hint to improve accuracy: 'analytics', 'customer_feedback', 'research', 'monitoring' */
  hint?: 'analytics' | 'customer_feedback' | 'research' | 'monitoring' | 'general';
  /** Enable strict mode: fail on ambiguous content instead of falling back */
  strict?: boolean;
}

export interface StreamingState {
  buffer: string;
  lastParsedIndex: number;
  pendingSentence: string;
  parsedSoFar: Partial<ParsedResponse>;
}
