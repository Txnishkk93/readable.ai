// In lib/hooks/useTheme.ts
import type { ThemeTokens } from '@readable-ai/react/themes/tokens';
import { DARK_THEME, LIGHT_THEME } from '@readable-ai/react/themes/tokens';
import type { ThemeType } from '../components/types';

export function useTheme(theme: ThemeType = 'dark', overrides: Record<string, string> = {}): ThemeTokens {
  const baseTheme = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  return {
    ...baseTheme,
    ...overrides,
  };
}