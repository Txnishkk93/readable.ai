import type { ThemeTokens } from '../themes/tokens';
import { DARK_THEME, LIGHT_THEME } from '../themes/tokens';
import type { ThemeType } from '../components/types';

export function useTheme(theme: ThemeType = 'dark', overrides: Record<string, string> = {}): ThemeTokens {
  const baseTheme = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  return {
    ...baseTheme,
    ...overrides,
  };
}
