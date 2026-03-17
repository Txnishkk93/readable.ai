import React from 'react';
import { useTheme, type ThemeType } from '../hooks/useTheme';
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
      fontSize: tokens.font_size_sm,
      opacity: 0.6,
      marginTop: tokens.spacing_sm,
    } as React.CSSProperties,
  };


   const allItems = [
    ...response.metrics.map((m) => ({ type: 'metric' as const, data: m })),
    ...response.insights.map((i) => ({ type: 'insight' as const, data: i })),
    ...response.actions.map((a) => ({ type: 'action' as const, data: a })),
    ...response.unparsed.map((u) => ({ type: 'unparsed' as const, data: u })),
  ];

  const renderItem = (item: typeof allItems[0], idx: number) => {
    switch (item.type) {
      case 'metric': {
        const m = item.data;
        return (
          <div key={`metric-${idx}`} style={{ ...styles.bubble, ...styles.metricBubble }}>
            <div style={styles.metricValue}>
              {m.value}
              {m.unit && <span>&nbsp;{m.unit}</span>}
            </div>
            <div style={styles.metricLabel}>{m.label}</div>
          </div>
        );
      }
      case 'insight':
        return (
          <div key={`insight-${idx}`} style={{ ...styles.bubble, ...styles.assistantBubble }}>
            {item.data.text}
          </div>
        );
      case 'action': {
        const a = item.data;
        return (
          <div key={`action-${idx}`} style={{ ...styles.bubble, ...styles.actionBubble }}>
            {a.priority && <strong>[{a.priority.toUpperCase()}]</strong>} {a.text}
          </div>
        );
      }
      case 'unparsed':
        return (
          <div key={`unparsed-${idx}`} style={{ ...styles.bubble, ...styles.assistantBubble }}>
            {item.data}
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      {allItems.length === 0 ? (
        <div style={{ color: tokens.text_secondary }}>No content available</div>
      ) : (
        allItems.map((item, idx) => renderItem(item, idx))
      )}
    </div>
  );
};