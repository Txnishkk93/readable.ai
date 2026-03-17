/**
 * Core types for the readable.ai parser engine
 */
interface Metric {
    label: string;
    value: string | number;
    unit?: string;
    context?: string;
    confidence: number;
    raw: string;
}
interface Insight {
    text: string;
    category: 'factual' | 'question' | 'observation';
    confidence: number;
}
interface Action {
    text: string;
    priority?: 'high' | 'medium' | 'low';
    confidence: number;
}
interface ParsedResponse {
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
interface ParserConfig {
    /** Confidence threshold (0-1). Elements below this become plain text. Default: 0.3 */
    confidenceThreshold?: number;
    /** Hint to improve accuracy: 'analytics', 'customer_feedback', 'research', 'monitoring' */
    hint?: 'analytics' | 'customer_feedback' | 'research' | 'monitoring' | 'general';
    /** Enable strict mode: fail on ambiguous content instead of falling back */
    strict?: boolean;
}
interface StreamingState {
    buffer: string;
    lastParsedIndex: number;
    pendingSentence: string;
    parsedSoFar: Partial<ParsedResponse>;
}

/**
 * Parse an LLM response into structured data
 */
declare function parseAIResponse(text: string, config?: ParserConfig): ParsedResponse;
/**
 * Initialize streaming parser state
 */
declare function createStreamingState(): StreamingState;
/**
 * Process a chunk of streaming text and update the parsed result
 */
declare function processStreamChunk(chunk: string, state: StreamingState, config?: ParserConfig): ParsedResponse;

/**
 * Tokenize text into sentences, handling edge cases
 */
declare function tokenizeText(text: string): string[];
/**
 * Split text by lines (for list processing)
 */
declare function tokenizeLines(text: string): string[];
/**
 * Extract words from a sentence
 */
declare function tokenizeWords(sentence: string): string[];

type Hint = 'analytics' | 'customer_feedback' | 'research' | 'monitoring' | 'general';
/**
 * Detect metrics (numbers with units) in a sentence
 */
declare function detectMetrics(sentence: string, hint?: Hint): Metric | null;

/**
 * Classify the intent of a sentence
 */
interface IntentMatch {
    type: 'action' | 'insight' | 'unknown';
    category?: 'factual' | 'question' | 'observation';
    priority?: 'high' | 'medium' | 'low';
    confidence: number;
}
declare function classifyIntent(sentence: string): IntentMatch;

/**
 * Score confidence in extracted elements
 * Higher confidence = more likely to be correct
 */
declare function scoreConfidence(contextLength: number, matchQuality: 'exact' | 'fuzzy' | 'pattern'): number;
/**
 * Check if an element has sufficient context
 */
declare function hasSufficientContext(sentence: string, minWords?: number): boolean;

export { type Action, type Insight, type Metric, type ParsedResponse, type ParserConfig, type StreamingState, classifyIntent, createStreamingState, detectMetrics, hasSufficientContext, parseAIResponse, processStreamChunk, scoreConfidence, tokenizeLines, tokenizeText, tokenizeWords };
