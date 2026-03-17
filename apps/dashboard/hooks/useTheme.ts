// hooks/useTheme.ts

type ThemeOverrides = Record<string, string>;

const darkTokens = {
  font_family_sans: 'Inter, system-ui, sans-serif',
  font_size_sm:  '0.75rem',
  font_size_base: '0.875rem',
  font_size_lg:  '1rem',
  font_size_xl:  '1.25rem',
  font_weight_normal: '400',
  font_weight_bold:   '700',
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
  // Colors
  primary:        '#6366f1',
  accent:         '#8b5cf6',
  surface:        '#1e1e2e',
  border:         '#2e2e3e',
  text_primary:   '#e2e8f0',
  text_secondary: '#94a3b8',
};

const lightTokens: typeof darkTokens = {
  ...darkTokens,
  surface:        '#ffffff',
  border:         '#e2e8f0',
  text_primary:   '#0f172a',
  text_secondary: '#64748b',
};

export type ThemeTokens = typeof darkTokens;

export function useTheme(
  theme: string = 'dark',
  overrides: ThemeOverrides = {}
): ThemeTokens {
  const base = theme === 'light' ? lightTokens : darkTokens;
  return { ...base, ...overrides } as ThemeTokens;
}