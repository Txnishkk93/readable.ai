import { useState, useCallback, useRef } from 'react';
import { createStreamingState, processStreamChunk } from '@/lib/core';
import type { ParsedResponse, ParserConfig, StreamingState } from '@/lib/core';

export function useStreamingReadable(config?: ParserConfig) {
  const [parsed, setParsed] = useState<ParsedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stateRef = useRef<StreamingState | null>(null);

  const reset = useCallback(() => {
    stateRef.current = createStreamingState();
    setParsed(null);
    setError(null);
  }, []);

  const addChunk = useCallback(
    (chunk: string) => {
      try {
        if (!stateRef.current) {
          stateRef.current = createStreamingState();
        }

        const result = processStreamChunk(chunk, stateRef.current, config);
        setParsed(result);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error processing chunk';
        setError(message);
      }
    },
    [config]
  );

  const finalize = useCallback(() => {
    // Mark streaming as complete
    if (stateRef.current && parsed) {
      setParsed({
        ...parsed,
        metadata: {
          ...parsed.metadata,
          parseMode: 'complete',
        },
      });
    }
  }, [parsed]);

  return { parsed, error, addChunk, reset, finalize };
}
