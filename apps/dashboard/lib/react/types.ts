import type { ParsedResponse, ParserConfig } from '@/lib/core';

export type RendererType = 'cards' | 'stats' | 'chat' | 'timeline';

export type ThemeType = 'dark' | 'light';

export interface RendererProps {
  response: ParsedResponse;
  theme?: ThemeType;
  overrides?: Record<string, string>;
}

export interface ReadableProps {
  response: string | ParsedResponse;
  renderer?: RendererType;
  theme?: ThemeType;
  parserConfig?: ParserConfig;
  overrides?: Record<string, string>;
  onParse?: (response: ParsedResponse) => void;
}

export interface RendererRegistry {
  [key: string]: React.ComponentType<RendererProps>;
}
