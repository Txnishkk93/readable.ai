import React from 'react';
import type { ParsedResponse } from '@readable-ai/core';
import { useTheme } from '../hooks/useTheme';
import type { RendererProps } from './types';

export const CardsRenderer: React.FC<RendererProps> = ({ response, theme = 'dark', overrides = {} }) => {
  const tokens = useTheme(theme, overrides);

  const styles = {
    container: {
      fontFamily: tokens.font_family_sans,
      color: tokens.text_primary,
      fontSize: tokens.font_size_base,
      lineHeight: tokens.line_height_normal,
    } as React.CSSProperties,
    section: {
      marginBottom: tokens.spacing_lg,
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: tokens.font_size_lg,
      fontWeight: 600,
      marginBottom: tokens.spacing_md,
      color: tokens.text_primary,
    } as React.CSSProperties,
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: tokens.spacing_md,
      marginBottom: tokens.spacing_lg,
    } as React.CSSProperties,
    metricCard: {
      padding: tokens.spacing_md,
      backgroundColor: tokens.surface,
      border: `${tokens.border_width} solid ${tokens.border}`,
      borderRadius: tokens.radius_md,
      textAlign: 'center' as const,
    } as React.CSSProperties,
    metricValue: {
      fontSize: tokens.font_size_xl,
      fontWeight: 700,
      color: tokens.primary,
      marginBottom: tokens.spacing_xs,
    } as React.CSSProperties,
    metricLabel: {
      fontSize: tokens.font_size_sm,
      color: tokens.text_secondary,
    } as React.CSSProperties,
    listItem: {
      padding: `${tokens.spacing_sm} ${tokens.spacing_md}`,
      backgroundColor: tokens.surface,
      border: `${tokens.border_width} solid ${tokens.border}`,
      borderRadius: tokens.radius_md,
      marginBottom: tokens.spacing_sm,
    } as React.CSSProperties,
    actionItem: {
      borderLeftWidth: '3px',
      borderLeftColor: tokens.accent,
      borderLeftStyle: 'solid',
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      {/* Metrics Section */}
      {response.metrics.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Metrics</div>
          <div style={styles.metricsGrid}>
            {response.metrics.map((metric, idx) => (
              <div key={idx} style={styles.metricCard}>
                <div style={styles.metricValue}>
                  {metric.value}
                  {metric.unit && <span style={{ fontSize: tokens.font_size_sm }}>{metric.unit}</span>}
                </div>
                <div style={styles.metricLabel}>{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions Section */}
      {response.actions.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Actions</div>
          <div>
            {response.actions.map((action, idx) => (
              <div key={idx} style={{ ...styles.listItem, ...styles.actionItem }}>
                <strong>
                  {action.priority && `[${action.priority.toUpperCase()}]`}
                </strong>{' '}
                {action.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Section */}
      {response.insights.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Insights</div>
          <div>
            {response.insights.map((insight, idx) => (
              <div key={idx} style={styles.listItem}>
                {insight.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unparsed Section */}
      {response.unparsed.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Other</div>
          <div>
            {response.unparsed.map((text, idx) => (
              <div key={idx} style={styles.listItem}>
                {text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
