import { useState, useMemo } from 'react';
import { parseAIResponse } from '@/lib/core';
import type { ParsedResponse, ParserConfig } from '@/lib/core';

export function useReadable(input: string | ParsedResponse, config?: ParserConfig) {
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    try {
      if (typeof input === 'string') {
        return parseAIResponse(input, config);
      }
      return input;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error parsing response';
      setError(message);
      return null;
    }
  }, [input, config]);

  return { result, error };
}
