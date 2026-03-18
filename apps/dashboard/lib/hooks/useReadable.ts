import { useState, useEffect } from 'react';
import { parseAIResponse } from '../core/parser';
import type { ParsedResponse, ParserConfig } from '../core/types';

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

    // Already a ParsedResponse — use directly (e.g. from useAIVisualize)
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
      // Use your existing core parser
      const parsed = parseAIResponse(response, config);
      setResult(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parse failed');
      setResult(null);
    }
  }, [response, config]);

  return { result, error };
}