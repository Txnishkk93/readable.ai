import React from 'react';
import { useTheme } from '../hooks/useTheme';
import type { RendererProps } from './types';

export const TimelineRenderer: React.FC<RendererProps> = ({ response, theme = 'dark', overrides = {} }) => {
  const tokens = useTheme(theme, overrides);

  const styles = {
    container: {
      fontFamily: tokens.font_family_sans,
      color: tokens.text_primary,
      fontSize: tokens.font_size_base,
      position: 'relative' as const,
      paddingLeft: '2rem',
    } as React.CSSProperties,
    timeline: {
      position: 'absolute' as const,
      left: '0.5rem',
      top: 0,
      bottom: 0,
      width: '1px',
      backgroundColor: tokens.border,
    } as React.CSSProperties,
    timelineItem: {
      position: 'relative' as const,
      marginBottom: tokens.spacing_lg,
    } as React.CSSProperties,
    dot: {
      position: 'absolute' as const,
      left: 'calc(-2rem + -6px)',
      top: tokens.spacing_md,
      width: '12px',
      height: '12px',
      backgroundColor: tokens.primary,
      border: `2px solid ${tokens.background}`,
      borderRadius: '50%',
    } as React.CSSProperties,
    metricDot: {
      backgroundColor: tokens.accent,
    } as React.CSSProperties,
    actionDot: {
      backgroundColor: tokens.success,
    } as React.CSSProperties,
    content: {
      padding: tokens.spacing_md,
      backgroundColor: tokens.surface,
      border: `${tokens.border_width} solid ${tokens.border}`,
      borderRadius: tokens.radius_md,
    } as React.CSSProperties,
    metricValue: {
      fontSize: tokens.font_size_lg,
      fontWeight: 700,
      color: tokens.primary,
      marginBottom: tokens.spacing_xs,
    } as React.CSSProperties,
    metricLabel: {
      fontSize: tokens.font_size_sm,
      color: tokens.text_secondary,
    } as React.CSSProperties,
    label: {
      fontSize: tokens.font_size_sm,
      fontWeight: 600,
      color: tokens.text_secondary,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      marginBottom: tokens.spacing_sm,
    } as React.CSSProperties,
  };

  // ❌ REMOVED - this was declared but never used
  // const allItems = [
  //   ...response.metrics.map((m, i) => ({ type: 'metric' as const, data: m, idx: i })),
  //   ...response.insights.map((i, idx) => ({ type: 'insight' as const, data: i, idx })),
  //   ...response.actions.map((a, idx) => ({ type: 'action' as const, data: a, idx })),
  // ];

  return (
    <div style={styles.container}>
      <div style={styles.timeline} />

      {response.metrics.length > 0 && (
        <>
          <div style={styles.label}>Metrics</div>
          {response.metrics.map((metric, idx) => (
            <div key={`metric-${idx}`} style={styles.timelineItem}>
              <div style={{ ...styles.dot, ...styles.metricDot }} />
              <div style={styles.content}>
                <div style={styles.metricValue}>
                  {metric.value}
                  {metric.unit && <span>&nbsp;{metric.unit}</span>}
                </div>
                <div style={styles.metricLabel}>{metric.label}</div>
              </div>
            </div>
          ))}
        </>
      )}

      {response.insights.length > 0 && (
        <>
          <div style={styles.label}>Insights</div>
          {response.insights.map((insight, idx) => (
            <div key={`insight-${idx}`} style={styles.timelineItem}>
              <div style={styles.dot} />
              <div style={styles.content}>{insight.text}</div>
            </div>
          ))}
        </>
      )}

      {response.actions.length > 0 && (
        <>
          <div style={styles.label}>Actions</div>
          {response.actions.map((action, idx) => (
            <div key={`action-${idx}`} style={styles.timelineItem}>
              <div style={{ ...styles.dot, ...styles.actionDot }} />
              <div style={styles.content}>
                {action.priority && <strong>[{action.priority.toUpperCase()}]</strong>} {action.text}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};