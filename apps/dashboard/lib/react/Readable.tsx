'use client'
import React, { useEffect } from 'react';
import type { ReadableProps } from './types';
import { CardsRenderer } from './CardsRenderer';
import { StatsRenderer } from './StatsRenderer';
import { ChatRenderer } from './ChatRenderer';
import { TimelineRenderer } from './TimelineRenderer';
import { useReadable } from '../hooks/useReadable';
import { useAIVisualize } from '@/lib/hooks/useAIVisualize';

const RENDERERS = {
  cards: CardsRenderer,
  stats: StatsRenderer,
  chat: ChatRenderer,
  timeline: TimelineRenderer,
};

export const Readable: React.FC<ReadableProps> = ({
  response,
  renderer = 'cards',
  theme = 'dark',
  mode = 'fast',
  parserConfig,
  overrides,
  onParse,
}) => {
  const fastResult = useReadable(response, parserConfig);
  const smart = useAIVisualize();

  useEffect(() => {
    if (mode === 'smart' && typeof response === 'string') {
      smart.analyze(response, parserConfig);
      return;
    }

    smart.reset();
  }, [mode, response, parserConfig, smart]);

  useEffect(() => {
    const result = mode === 'smart' ? smart.result?.parsed : fastResult.result;
    if (result && onParse) {
      onParse(result);
    }
  }, [fastResult.result, mode, onParse, smart.result]);

  const result = mode === 'smart' ? smart.result?.parsed ?? fastResult.result : fastResult.result;
  const error = mode === 'smart' ? smart.error ?? fastResult.error : fastResult.error;

  if (error) {
    return (
      <div style={{ color: '#ef4444', padding: '1rem', fontFamily: 'monospace' }}>
        Error parsing response: {error}
      </div>
    );
  }

  if (!result || (mode === 'smart' && smart.loading)) {
    return <div>Loading...</div>;
  }

  const RendererComponent = RENDERERS[renderer] || RENDERERS.cards;

  return <RendererComponent response={result} theme={theme} overrides={overrides} />;
};

export default Readable;
