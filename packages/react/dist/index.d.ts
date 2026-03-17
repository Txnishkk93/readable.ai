import React from 'react';
import { ParsedResponse, ParserConfig } from '@readable-ai/core';

type RendererType = 'cards' | 'stats' | 'chat' | 'timeline';
type ThemeType = 'dark' | 'light';
interface RendererProps {
    response: ParsedResponse;
    theme?: ThemeType;
    overrides?: Record<string, string>;
}
interface ReadableProps {
    response: string | ParsedResponse;
    renderer?: RendererType;
    theme?: ThemeType;
    parserConfig?: ParserConfig;
    overrides?: Record<string, string>;
    onParse?: (response: ParsedResponse) => void;
}

/**
 * Main Readable component - parses and renders LLM responses
 */
declare const Readable: React.FC<ReadableProps>;

declare const CardsRenderer: React.FC<RendererProps>;

declare const StatsRenderer: React.FC<RendererProps>;

declare const ChatRenderer: React.FC<RendererProps>;

declare const TimelineRenderer: React.FC<RendererProps>;

declare function useReadable(input: string | ParsedResponse, config?: ParserConfig): {
    result: ParsedResponse | null;
    error: string | null;
};

declare function useStreamingReadable(config?: ParserConfig): {
    parsed: ParsedResponse | null;
    error: string | null;
    addChunk: (chunk: string) => void;
    reset: () => void;
    finalize: () => void;
};

/**
 * Design tokens for theming readable-ai renderers
 */
interface ThemeTokens {
    primary: string;
    primary_light: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text_primary: string;
    text_secondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    font_family_sans: string;
    font_family_mono: string;
    font_size_xs: string;
    font_size_sm: string;
    font_size_base: string;
    font_size_lg: string;
    font_size_xl: string;
    line_height_tight: string;
    line_height_normal: string;
    line_height_relaxed: string;
    spacing_xs: string;
    spacing_sm: string;
    spacing_md: string;
    spacing_lg: string;
    spacing_xl: string;
    radius_sm: string;
    radius_md: string;
    radius_lg: string;
    border_width: string;
    shadow_sm: string;
    shadow_md: string;
    shadow_lg: string;
}

declare function useTheme(theme?: ThemeType, overrides?: Record<string, string>): ThemeTokens;

export { CardsRenderer, ChatRenderer, Readable, type ReadableProps, type RendererProps, type RendererType, StatsRenderer, type ThemeType, TimelineRenderer, useReadable, useStreamingReadable, useTheme };
