import { useState, useEffect } from 'react';
import type { ParsedResponse, ParserConfig } from '../core/types';

export interface ReadableResult {
    metrics: Array<{ label: string; value: string; unit?: string }>;
    insights: string[];
    actions: string[];
    confidence: number;
}

export interface UseReadableOptions {
    hint?: 'analytics' | 'conversational' | 'actionable';
}

export function useReadable(
  response: string | ParsedResponse,
  config?: ParserConfig
): { result: ParsedResponse | null; error: string | null } {
  const [result, setResult] = useState<ParsedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!response) {
      setResult(null);
      return;
    }

    // Already a ParsedResponse object, use directly
    if (typeof response !== 'string') {
      setResult(response);
      setError(null);
      return;
    }

    if (!response.trim()) {
      setResult(null);
      return;
    }

    try {
      const parsed: ParsedResponse = {
        raw: response,
        metrics: [],
        insights: [],
        actions: [],
        confidence: 0,
        unparsed: [],
        metadata: {
          processedAt: new Date().toISOString(),
          tokenCount: response.split(/\s+/).length,
          parseMode: 'complete',
        },
      };
      setResult(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parse failed');
      setResult(null);
    }
  }, [response, config]);

  return { result, error };
}