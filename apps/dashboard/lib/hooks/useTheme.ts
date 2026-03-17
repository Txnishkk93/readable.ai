export type ThemeType = 'dark' | 'light';

export interface ThemeTokens {
  font_family_sans: string;
  font_size_sm: string;
  font_size_base: string;
  font_size_lg: string;
  font_size_xl: string;
  font_weight_normal: string;
  font_weight_bold: string;
  line_height_normal: string;
  spacing_xs: string;
  spacing_sm: string;
  spacing_md: string;
  spacing_lg: string;
  spacing_xl: string;
  radius_sm: string;
  radius_md: string;
  radius_lg: string;
  border_width: string;
  primary: string;
  accent: string;
  surface: string;
  border: string;
  text_primary: string;
  text_secondary: string;
}

const DARK_THEME: ThemeTokens = {
  font_family_sans: 'Inter, system-ui, sans-serif',
  font_size_sm: '0.75rem',
  font_size_base: '0.875rem',
  font_size_lg: '1rem',
  font_size_xl: '1.25rem',
  font_weight_normal: '400',
  font_weight_bold: '700',
  line_height_normal: '1.5',
  spacing_xs: '4px',
  spacing_sm: '8px',
  spacing_md: '12px',
  spacing_lg: '20px',
  spacing_xl: '32px',
  radius_sm: '4px',
  radius_md: '8px',
  radius_lg: '12px',
  border_width: '1px',
  primary: '#6366f1',
  accent: '#8b5cf6',
  surface: '#1e1e2e',
  border: '#2e2e3e',
  text_primary: '#e2e8f0',
  text_secondary: '#94a3b8',
};

const LIGHT_THEME: ThemeTokens = {
  ...DARK_THEME,
  surface: '#ffffff',
  border: '#e2e8f0',
  text_primary: '#0f172a',
  text_secondary: '#64748b',
};

export function useTheme(
  theme: ThemeType = 'dark',
  overrides: Partial<ThemeTokens> = {}
): ThemeTokens {
  const base = theme === 'light' ? LIGHT_THEME : DARK_THEME;
  return { ...base, ...overrides };
}