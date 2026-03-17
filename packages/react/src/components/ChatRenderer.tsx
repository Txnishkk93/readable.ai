import React from 'react';
import type { ParsedResponse } from '@readable-ai/core';
import { useTheme } from '../hooks/useTheme';
import type { RendererProps } from './types';

export const ChatRenderer: React.FC<RendererProps> = ({ response, theme = 'dark', overrides = {} }) => {
  const tokens = useTheme(theme, overrides);

  const styles = {
    container: {
      fontFamily: tokens.font_family_sans,
      color: tokens.text_primary,
      fontSize: tokens.font_size_base,
      display: 'flex' as const,
      flexDirection: 'column' as const,
      gap: tokens.spacing_md,
    } as React.CSSProperties,
    bubble: {
      padding: `${tokens.spacing_md} ${tokens.spacing_lg}`,
      borderRadius: tokens.radius_lg,
      maxWidth: '80%',
      wordWrap: 'break-word' as const,
    } as React.CSSProperties,
    assistantBubble: {
      backgroundColor: tokens.surface,
      border: `${tokens.border_width} solid ${tokens.border}`,
      alignSelf: 'flex-start',
    } as React.CSSProperties,
    metricBubble: {
      backgroundColor: tokens.primary,
      color: 'white',
      alignSelf: 'flex-start',
    } as React.CSSProperties,
    actionBubble: {
      backgroundColor: tokens.accent,
      color: 'white',
      alignSelf: 'flex-end',
    } as React.CSSProperties,
    metricValue: {
      fontSize: tokens.font_size_lg,
      fontWeight: 700,
      marginBottom: tokens.spacing_xs,
    } as React.CSSProperties,
    metricLabel: {
      fontSize: tokens.font_size_sm,
      opacity: 0.9,
    } as React.CSSProperties,
    timestamp: {
      fontSize: tokens.font_size_xs,
      opacity: 0.6,
      marginTop: tokens.spacing_sm,
    } as React.CSSProperties,
  };

  const allItems = [
    ...response.metrics.map((m) => ({ type: 'metric' as const, data: m })),
    ...response.insights.map((i) => ({ type: 'insight' as const, data: i })),
    ...response.actions.map((a) => ({ type: 'action' as const, data: a })),
  ];

  return (
    <div style={styles.container}>
      {response.metrics.length > 0 && (
        <>
          {response.metrics.map((metric, idx) => (
            <div key={`metric-${idx}`} style={{ ...styles.bubble, ...styles.metricBubble }}>
              <div style={styles.metricValue}>
                {metric.value}
                {metric.unit && <span>{metric.unit}</span>}
              </div>
              <div style={styles.metricLabel}>{metric.label}</div>
            </div>
          ))}
        </>
      )}

      {response.insights.length > 0 && (
        <>
          {response.insights.map((insight, idx) => (
            <div key={`insight-${idx}`} style={{ ...styles.bubble, ...styles.assistantBubble }}>
              {insight.text}
            </div>
          ))}
        </>
      )}

      {response.actions.length > 0 && (
        <>
          {response.actions.map((action, idx) => (
            <div key={`action-${idx}`} style={{ ...styles.bubble, ...styles.actionBubble }}>
              {action.priority && <strong>[{action.priority.toUpperCase()}]</strong>} {action.text}
            </div>
          ))}
        </>
      )}

      {response.unparsed.length > 0 && (
        <>
          {response.unparsed.map((text, idx) => (
            <div key={`unparsed-${idx}`} style={{ ...styles.bubble, ...styles.assistantBubble }}>
              {text}
            </div>
          ))}
        </>
      )}
    </div>
  );
};
