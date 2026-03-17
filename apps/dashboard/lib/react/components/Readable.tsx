'use client'
import React from 'react';
import type { ReadableProps } from './types';
import { CardsRenderer } from './CardsRenderer';
import { StatsRenderer } from './StatsRenderer';
import { ChatRenderer } from './ChatRenderer';
import { TimelineRenderer } from './TimelineRenderer';
import { useReadable } from '../hooks/useReadable';

const RENDERERS = {
  cards: CardsRenderer,
  stats: StatsRenderer,
  chat: ChatRenderer,
  timeline: TimelineRenderer,
};

/**
 * Main Readable component - parses and renders LLM responses
 */
export const Readable: React.FC<ReadableProps> = ({
  response,
  renderer = 'cards',
  theme = 'dark',
  parserConfig,
  overrides,
  onParse,
}) => {
  const { result, error } = useReadable(response, parserConfig);

  if (error) {
    return (
      <div style={{ color: '#ef4444', padding: '1rem', fontFamily: 'monospace' }}>
        Error parsing response: {error}
      </div>
    );
  }

  if (!result) {
    return <div>Loading...</div>;
  }

  if (onParse) {
    onParse(result);
  }

  const RendererComponent = RENDERERS[renderer] || RENDERERS.cards;

  return <RendererComponent response={result} theme={theme} overrides={overrides} />;
};

export default Readable;
