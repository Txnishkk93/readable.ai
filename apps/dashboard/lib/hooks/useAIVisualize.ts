'use client';

import { useState, useCallback } from 'react';
import type { ParsedResponse, ParserConfig } from '../core/types';

export type InputType = 'csv' | 'json' | 'prose' | 'metrics' | 'actions' | 'mixed' | 'unknown';
export type SuggestedRenderer = 'cards' | 'stats' | 'timeline' | 'chat';

export interface AIVisualizeResult {
  parsed: ParsedResponse;
  inputType: InputType;
  suggestedRenderer: SuggestedRenderer;
  confidence: number;
}

export interface UseAIVisualizeReturn {
  result: AIVisualizeResult | null;
  loading: boolean;
  error: string | null;
  analyze: (input: string, config?: ParserConfig) => Promise<void>;
  reset: () => void;
}

export function useAIVisualize(): UseAIVisualizeReturn {
  const [result, setResult] = useState<AIVisualizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (input: string, _config?: ParserConfig) => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          config: _config,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `Analysis failed (${res.status})`);
      }

      const data = await res.json();
      const parsed: ParsedResponse = data.parsed ?? data;

      setResult({
        parsed,
        inputType: (parsed as unknown as { inputType: InputType }).inputType ?? 'unknown',
        suggestedRenderer: (parsed as unknown as { suggestedRenderer: SuggestedRenderer }).suggestedRenderer ?? 'cards',
        confidence: parsed.confidence ?? 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze input');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { result, loading, error, analyze, reset };
}