import React from 'react';
import { useTheme } from '../hooks/useTheme';
import type { RendererProps } from './types';

export const StatsRenderer: React.FC<RendererProps> = ({ response, theme = 'dark', overrides = {} }) => {
  const tokens = useTheme(theme, overrides);

  const styles = {
    container: {
      fontFamily: tokens.font_family_sans,
      color: tokens.text_primary,
      fontSize: tokens.font_size_base,
    } as React.CSSProperties,
    section: {
      marginBottom: tokens.spacing_lg,
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: tokens.font_size_sm,
      fontWeight: 600,
      marginBottom: tokens.spacing_md,
      color: tokens.text_primary,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    } as React.CSSProperties,
    statRow: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing_md,
      paddingBottom: tokens.spacing_md,
      marginBottom: tokens.spacing_md,
      borderBottom: `${tokens.border_width} solid ${tokens.border}`,
    } as React.CSSProperties,
    statLabel: {
      flex: 1,
      fontSize: tokens.font_size_sm,
      color: tokens.text_secondary,
      minWidth: '150px',
    } as React.CSSProperties,
    statBar: {
      flex: 2,
      height: '20px',
      backgroundColor: tokens.surface,
      borderRadius: tokens.radius_sm,
      overflow: 'hidden' as const,
      border: `${tokens.border_width} solid ${tokens.border}`,
    } as React.CSSProperties,
    statBarFill: {
      height: '100%',
      backgroundColor: tokens.primary,
      transition: 'width 0.3s ease',
    } as React.CSSProperties,
    statValue: {
      minWidth: '60px',
      textAlign: 'right' as const,
      fontWeight: 600,
      fontSize: tokens.font_size_sm,
    } as React.CSSProperties,
    listItem: {
      padding: tokens.spacing_sm,
      marginBottom: tokens.spacing_sm,
      color: tokens.text_secondary,
      fontSize: tokens.font_size_sm,
    } as React.CSSProperties,
  };

  const getBarWidth = (metric: any): number => {
    if (typeof metric.value === 'number') {
      return Math.min(100, Math.max(5, metric.value));
    }
    return 50;
  };

  return (
    <div style={styles.container}>
      {response.metrics.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Key Metrics</div>
          <div>
            {response.metrics.map((metric, idx) => (
              <div key={idx} style={styles.statRow}>
                <div style={styles.statLabel}>{metric.label}</div>
                <div style={styles.statBar}>
                  <div style={{ ...styles.statBarFill, width: `${getBarWidth(metric)}%` }} />
                </div>
                <div style={styles.statValue}>
                  {metric.value}
                  {metric.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {response.actions.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Required Actions</div>
          <div>
            {response.actions.map((action, idx) => (
              <div key={idx} style={styles.listItem}>
                <strong>{action.priority ? `[${action.priority.toUpperCase()}]` : ''}</strong> {action.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {response.insights.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Key Insights</div>
          <div>
            {response.insights.map((insight, idx) => (
              <div key={idx} style={styles.listItem}>
                {insight.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};