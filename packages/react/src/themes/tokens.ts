/**
 * Design tokens for theming readable-ai renderers
 */

export interface ThemeTokens {
  // Colors
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

  // Typography
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

  // Spacing
  spacing_xs: string;
  spacing_sm: string;
  spacing_md: string;
  spacing_lg: string;
  spacing_xl: string;

  // Borders & Radius
  radius_sm: string;
  radius_md: string;
  radius_lg: string;
  border_width: string;

  // Shadows
  shadow_sm: string;
  shadow_md: string;
  shadow_lg: string;
}

export const DARK_THEME: ThemeTokens = {
  // Colors
  primary: '#3b82f6',
  primary_light: '#60a5fa',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  background: '#0f172a',
  surface: '#1e293b',
  text_primary: '#f1f5f9',
  text_secondary: '#cbd5e1',
  border: '#334155',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',

  // Typography
  font_family_sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  font_family_mono: '"Fira Code", "Courier New", monospace',
  font_size_xs: '0.75rem',
  font_size_sm: '0.875rem',
  font_size_base: '1rem',
  font_size_lg: '1.125rem',
  font_size_xl: '1.25rem',
  line_height_tight: '1.2',
  line_height_normal: '1.5',
  line_height_relaxed: '1.75',

  // Spacing
  spacing_xs: '0.25rem',
  spacing_sm: '0.5rem',
  spacing_md: '1rem',
  spacing_lg: '1.5rem',
  spacing_xl: '2rem',

  // Borders & Radius
  radius_sm: '0.25rem',
  radius_md: '0.5rem',
  radius_lg: '0.75rem',
  border_width: '1px',

  // Shadows
  shadow_sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadow_md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadow_lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
};

export const LIGHT_THEME: ThemeTokens = {
  // Colors
  primary: '#0052cc',
  primary_light: '#0052cc',
  secondary: '#6f42c1',
  accent: '#dc3545',
  background: '#ffffff',
  surface: '#f8f9fa',
  text_primary: '#212529',
  text_secondary: '#6c757d',
  border: '#dee2e6',
  success: '#198754',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#0dcaf0',

  // Typography
  font_family_sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  font_family_mono: '"Fira Code", "Courier New", monospace',
  font_size_xs: '0.75rem',
  font_size_sm: '0.875rem',
  font_size_base: '1rem',
  font_size_lg: '1.125rem',
  font_size_xl: '1.25rem',
  line_height_tight: '1.2',
  line_height_normal: '1.5',
  line_height_relaxed: '1.75',

  // Spacing
  spacing_xs: '0.25rem',
  spacing_sm: '0.5rem',
  spacing_md: '1rem',
  spacing_lg: '1.5rem',
  spacing_xl: '2rem',

  // Borders & Radius
  radius_sm: '0.25rem',
  radius_md: '0.5rem',
  radius_lg: '0.75rem',
  border_width: '1px',

  // Shadows
  shadow_sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadow_md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadow_lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
};
