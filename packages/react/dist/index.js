// src/themes/tokens.ts
var DARK_THEME = {
  // Colors
  primary: "#3b82f6",
  primary_light: "#60a5fa",
  secondary: "#8b5cf6",
  accent: "#ec4899",
  background: "#0f172a",
  surface: "#1e293b",
  text_primary: "#f1f5f9",
  text_secondary: "#cbd5e1",
  border: "#334155",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
  // Typography
  font_family_sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  font_family_mono: '"Fira Code", "Courier New", monospace',
  font_size_xs: "0.75rem",
  font_size_sm: "0.875rem",
  font_size_base: "1rem",
  font_size_lg: "1.125rem",
  font_size_xl: "1.25rem",
  line_height_tight: "1.2",
  line_height_normal: "1.5",
  line_height_relaxed: "1.75",
  // Spacing
  spacing_xs: "0.25rem",
  spacing_sm: "0.5rem",
  spacing_md: "1rem",
  spacing_lg: "1.5rem",
  spacing_xl: "2rem",
  // Borders & Radius
  radius_sm: "0.25rem",
  radius_md: "0.5rem",
  radius_lg: "0.75rem",
  border_width: "1px",
  // Shadows
  shadow_sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  shadow_md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  shadow_lg: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
};
var LIGHT_THEME = {
  // Colors
  primary: "#0052cc",
  primary_light: "#0052cc",
  secondary: "#6f42c1",
  accent: "#dc3545",
  background: "#ffffff",
  surface: "#f8f9fa",
  text_primary: "#212529",
  text_secondary: "#6c757d",
  border: "#dee2e6",
  success: "#198754",
  warning: "#ffc107",
  error: "#dc3545",
  info: "#0dcaf0",
  // Typography
  font_family_sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  font_family_mono: '"Fira Code", "Courier New", monospace',
  font_size_xs: "0.75rem",
  font_size_sm: "0.875rem",
  font_size_base: "1rem",
  font_size_lg: "1.125rem",
  font_size_xl: "1.25rem",
  line_height_tight: "1.2",
  line_height_normal: "1.5",
  line_height_relaxed: "1.75",
  // Spacing
  spacing_xs: "0.25rem",
  spacing_sm: "0.5rem",
  spacing_md: "1rem",
  spacing_lg: "1.5rem",
  spacing_xl: "2rem",
  // Borders & Radius
  radius_sm: "0.25rem",
  radius_md: "0.5rem",
  radius_lg: "0.75rem",
  border_width: "1px",
  // Shadows
  shadow_sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  shadow_md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  shadow_lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
};

// src/hooks/useTheme.ts
function useTheme(theme = "dark", overrides = {}) {
  const baseTheme = theme === "dark" ? DARK_THEME : LIGHT_THEME;
  return {
    ...baseTheme,
    ...overrides
  };
}

// src/components/CardsRenderer.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var CardsRenderer = ({ response, theme = "dark", overrides = {} }) => {
  const tokens = useTheme(theme, overrides);
  const styles = {
    container: {
      fontFamily: tokens.font_family_sans,
      color: tokens.text_primary,
      fontSize: tokens.font_size_base,
      lineHeight: tokens.line_height_normal
    },
    section: {
      marginBottom: tokens.spacing_lg
    },
    sectionTitle: {
      fontSize: tokens.font_size_lg,
      fontWeight: 600,
      marginBottom: tokens.spacing_md,
      color: tokens.text_primary
    },
    metricsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: tokens.spacing_md,
      marginBottom: tokens.spacing_lg
    },
    metricCard: {
      padding: tokens.spacing_md,
      backgroundColor: tokens.surface,
      border: `${tokens.border_width} solid ${tokens.border}`,
      borderRadius: tokens.radius_md,
      textAlign: "center"
    },
    metricValue: {
      fontSize: tokens.font_size_xl,
      fontWeight: 700,
      color: tokens.primary,
      marginBottom: tokens.spacing_xs
    },
    metricLabel: {
      fontSize: tokens.font_size_sm,
      color: tokens.text_secondary
    },
    listItem: {
      padding: `${tokens.spacing_sm} ${tokens.spacing_md}`,
      backgroundColor: tokens.surface,
      border: `${tokens.border_width} solid ${tokens.border}`,
      borderRadius: tokens.radius_md,
      marginBottom: tokens.spacing_sm
    },
    actionItem: {
      borderLeftWidth: "3px",
      borderLeftColor: tokens.accent,
      borderLeftStyle: "solid"
    }
  };
  return /* @__PURE__ */ jsxs("div", { style: styles.container, children: [
    response.metrics.length > 0 && /* @__PURE__ */ jsxs("div", { style: styles.section, children: [
      /* @__PURE__ */ jsx("div", { style: styles.sectionTitle, children: "Metrics" }),
      /* @__PURE__ */ jsx("div", { style: styles.metricsGrid, children: response.metrics.map((metric, idx) => /* @__PURE__ */ jsxs("div", { style: styles.metricCard, children: [
        /* @__PURE__ */ jsxs("div", { style: styles.metricValue, children: [
          metric.value,
          metric.unit && /* @__PURE__ */ jsx("span", { style: { fontSize: tokens.font_size_sm }, children: metric.unit })
        ] }),
        /* @__PURE__ */ jsx("div", { style: styles.metricLabel, children: metric.label })
      ] }, idx)) })
    ] }),
    response.actions.length > 0 && /* @__PURE__ */ jsxs("div", { style: styles.section, children: [
      /* @__PURE__ */ jsx("div", { style: styles.sectionTitle, children: "Actions" }),
      /* @__PURE__ */ jsx("div", { children: response.actions.map((action, idx) => /* @__PURE__ */ jsxs("div", { style: { ...styles.listItem, ...styles.actionItem }, children: [
        /* @__PURE__ */ jsx("strong", { children: action.priority && `[${action.priority.toUpperCase()}]` }),
        " ",
        action.text
      ] }, idx)) })
    ] }),
    response.insights.length > 0 && /* @__PURE__ */ jsxs("div", { style: styles.section, children: [
      /* @__PURE__ */ jsx("div", { style: styles.sectionTitle, children: "Insights" }),
      /* @__PURE__ */ jsx("div", { children: response.insights.map((insight, idx) => /* @__PURE__ */ jsx("div", { style: styles.listItem, children: insight.text }, idx)) })
    ] }),
    response.unparsed.length > 0 && /* @__PURE__ */ jsxs("div", { style: styles.section, children: [
      /* @__PURE__ */ jsx("div", { style: styles.sectionTitle, children: "Other" }),
      /* @__PURE__ */ jsx("div", { children: response.unparsed.map((text, idx) => /* @__PURE__ */ jsx("div", { style: styles.listItem, children: text }, idx)) })
    ] })
  ] });
};

// src/components/StatsRenderer.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var StatsRenderer = ({ response, theme = "dark", overrides = {} }) => {
  const tokens = useTheme(theme, overrides);
  const styles = {
    container: {
      fontFamily: tokens.font_family_sans,
      color: tokens.text_primary,
      fontSize: tokens.font_size_base
    },
    section: {
      marginBottom: tokens.spacing_lg
    },
    sectionTitle: {
      fontSize: tokens.font_size_sm,
      fontWeight: 600,
      marginBottom: tokens.spacing_md,
      color: tokens.text_primary,
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    },
    statRow: {
      display: "flex",
      alignItems: "center",
      gap: tokens.spacing_md,
      paddingBottom: tokens.spacing_md,
      marginBottom: tokens.spacing_md,
      borderBottom: `${tokens.border_width} solid ${tokens.border}`
    },
    statLabel: {
      flex: 1,
      fontSize: tokens.font_size_sm,
      color: tokens.text_secondary,
      minWidth: "150px"
    },
    statBar: {
      flex: 2,
      height: "20px",
      backgroundColor: tokens.surface,
      borderRadius: tokens.radius_sm,
      overflow: "hidden",
      border: `${tokens.border_width} solid ${tokens.border}`
    },
    statBarFill: {
      height: "100%",
      backgroundColor: tokens.primary,
      transition: "width 0.3s ease"
    },
    statValue: {
      minWidth: "60px",
      textAlign: "right",
      fontWeight: 600,
      fontSize: tokens.font_size_sm
    },
    listItem: {
      padding: tokens.spacing_sm,
      marginBottom: tokens.spacing_sm,
      color: tokens.text_secondary,
      fontSize: tokens.font_size_sm
    }
  };
  const getBarWidth = (metric) => {
    if (typeof metric.value === "number") {
      return Math.min(100, Math.max(5, metric.value));
    }
    return 50;
  };
  return /* @__PURE__ */ jsxs2("div", { style: styles.container, children: [
    response.metrics.length > 0 && /* @__PURE__ */ jsxs2("div", { style: styles.section, children: [
      /* @__PURE__ */ jsx2("div", { style: styles.sectionTitle, children: "Key Metrics" }),
      /* @__PURE__ */ jsx2("div", { children: response.metrics.map((metric, idx) => /* @__PURE__ */ jsxs2("div", { style: styles.statRow, children: [
        /* @__PURE__ */ jsx2("div", { style: styles.statLabel, children: metric.label }),
        /* @__PURE__ */ jsx2("div", { style: styles.statBar, children: /* @__PURE__ */ jsx2("div", { style: { ...styles.statBarFill, width: `${getBarWidth(metric)}%` } }) }),
        /* @__PURE__ */ jsxs2("div", { style: styles.statValue, children: [
          metric.value,
          metric.unit
        ] })
      ] }, idx)) })
    ] }),
    response.actions.length > 0 && /* @__PURE__ */ jsxs2("div", { style: styles.section, children: [
      /* @__PURE__ */ jsx2("div", { style: styles.sectionTitle, children: "Required Actions" }),
      /* @__PURE__ */ jsx2("div", { children: response.actions.map((action, idx) => /* @__PURE__ */ jsxs2("div", { style: styles.listItem, children: [
        /* @__PURE__ */ jsx2("strong", { children: action.priority ? `[${action.priority.toUpperCase()}]` : "" }),
        " ",
        action.text
      ] }, idx)) })
    ] }),
    response.insights.length > 0 && /* @__PURE__ */ jsxs2("div", { style: styles.section, children: [
      /* @__PURE__ */ jsx2("div", { style: styles.sectionTitle, children: "Key Insights" }),
      /* @__PURE__ */ jsx2("div", { children: response.insights.map((insight, idx) => /* @__PURE__ */ jsx2("div", { style: styles.listItem, children: insight.text }, idx)) })
    ] })
  ] });
};

// src/components/ChatRenderer.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var ChatRenderer = ({ response, theme = "dark", overrides = {} }) => {
  const tokens = useTheme(theme, overrides);
  const styles = {
    container: {
      fontFamily: tokens.font_family_sans,
      color: tokens.text_primary,
      fontSize: tokens.font_size_base,
      display: "flex",
      flexDirection: "column",
      gap: tokens.spacing_md
    },
    bubble: {
      padding: `${tokens.spacing_md} ${tokens.spacing_lg}`,
      borderRadius: tokens.radius_lg,
      maxWidth: "80%",
      wordWrap: "break-word"
    },
    assistantBubble: {
      backgroundColor: tokens.surface,
      border: `${tokens.border_width} solid ${tokens.border}`,
      alignSelf: "flex-start"
    },
    metricBubble: {
      backgroundColor: tokens.primary,
      color: "white",
      alignSelf: "flex-start"
    },
    actionBubble: {
      backgroundColor: tokens.accent,
      color: "white",
      alignSelf: "flex-end"
    },
    metricValue: {
      fontSize: tokens.font_size_lg,
      fontWeight: 700,
      marginBottom: tokens.spacing_xs
    },
    metricLabel: {
      fontSize: tokens.font_size_sm,
      opacity: 0.9
    },
    timestamp: {
      fontSize: tokens.font_size_xs,
      opacity: 0.6,
      marginTop: tokens.spacing_sm
    }
  };
  const allItems = [
    ...response.metrics.map((m) => ({ type: "metric", data: m })),
    ...response.insights.map((i) => ({ type: "insight", data: i })),
    ...response.actions.map((a) => ({ type: "action", data: a })),
    ...response.unparsed.map((u) => ({ type: "unparsed", data: u }))
  ];
  const renderItem = (item, idx) => {
    switch (item.type) {
      case "metric": {
        const m = item.data;
        return /* @__PURE__ */ jsxs3("div", { style: { ...styles.bubble, ...styles.metricBubble }, children: [
          /* @__PURE__ */ jsxs3("div", { style: styles.metricValue, children: [
            m.value,
            m.unit && /* @__PURE__ */ jsxs3("span", { children: [
              "\xA0",
              m.unit
            ] })
          ] }),
          /* @__PURE__ */ jsx3("div", { style: styles.metricLabel, children: m.label })
        ] }, `metric-${idx}`);
      }
      case "insight":
        return /* @__PURE__ */ jsx3("div", { style: { ...styles.bubble, ...styles.assistantBubble }, children: item.data.text }, `insight-${idx}`);
      case "action": {
        const a = item.data;
        return /* @__PURE__ */ jsxs3("div", { style: { ...styles.bubble, ...styles.actionBubble }, children: [
          a.priority && /* @__PURE__ */ jsxs3("strong", { children: [
            "[",
            a.priority.toUpperCase(),
            "]"
          ] }),
          " ",
          a.text
        ] }, `action-${idx}`);
      }
      case "unparsed":
        return /* @__PURE__ */ jsx3("div", { style: { ...styles.bubble, ...styles.assistantBubble }, children: item.data }, `unparsed-${idx}`);
    }
  };
  return /* @__PURE__ */ jsx3("div", { style: styles.container, children: allItems.length === 0 ? /* @__PURE__ */ jsx3("div", { style: { color: tokens.text_secondary }, children: "No content available" }) : allItems.map((item, idx) => renderItem(item, idx)) });
};

// src/components/TimelineRenderer.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var TimelineRenderer = ({ response, theme = "dark", overrides = {} }) => {
  const tokens = useTheme(theme, overrides);
  const styles = {
    container: {
      fontFamily: tokens.font_family_sans,
      color: tokens.text_primary,
      fontSize: tokens.font_size_base,
      position: "relative",
      paddingLeft: "2rem"
    },
    timeline: {
      position: "absolute",
      left: "0.5rem",
      top: 0,
      bottom: 0,
      width: "1px",
      backgroundColor: tokens.border
    },
    timelineItem: {
      position: "relative",
      marginBottom: tokens.spacing_lg
    },
    dot: {
      position: "absolute",
      left: "calc(-2rem + -6px)",
      top: tokens.spacing_md,
      width: "12px",
      height: "12px",
      backgroundColor: tokens.primary,
      border: `2px solid ${tokens.background}`,
      borderRadius: "50%"
    },
    metricDot: {
      backgroundColor: tokens.accent
    },
    actionDot: {
      backgroundColor: tokens.success
    },
    content: {
      padding: tokens.spacing_md,
      backgroundColor: tokens.surface,
      border: `${tokens.border_width} solid ${tokens.border}`,
      borderRadius: tokens.radius_md
    },
    metricValue: {
      fontSize: tokens.font_size_lg,
      fontWeight: 700,
      color: tokens.primary,
      marginBottom: tokens.spacing_xs
    },
    metricLabel: {
      fontSize: tokens.font_size_sm,
      color: tokens.text_secondary
    },
    label: {
      fontSize: tokens.font_size_sm,
      fontWeight: 600,
      color: tokens.text_secondary,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: tokens.spacing_sm
    }
  };
  return /* @__PURE__ */ jsxs4("div", { style: styles.container, children: [
    /* @__PURE__ */ jsx4("div", { style: styles.timeline }),
    response.metrics.length > 0 && /* @__PURE__ */ jsxs4(Fragment, { children: [
      /* @__PURE__ */ jsx4("div", { style: styles.label, children: "Metrics" }),
      response.metrics.map((metric, idx) => /* @__PURE__ */ jsxs4("div", { style: styles.timelineItem, children: [
        /* @__PURE__ */ jsx4("div", { style: { ...styles.dot, ...styles.metricDot } }),
        /* @__PURE__ */ jsxs4("div", { style: styles.content, children: [
          /* @__PURE__ */ jsxs4("div", { style: styles.metricValue, children: [
            metric.value,
            metric.unit && /* @__PURE__ */ jsxs4("span", { children: [
              "\xA0",
              metric.unit
            ] })
          ] }),
          /* @__PURE__ */ jsx4("div", { style: styles.metricLabel, children: metric.label })
        ] })
      ] }, `metric-${idx}`))
    ] }),
    response.insights.length > 0 && /* @__PURE__ */ jsxs4(Fragment, { children: [
      /* @__PURE__ */ jsx4("div", { style: styles.label, children: "Insights" }),
      response.insights.map((insight, idx) => /* @__PURE__ */ jsxs4("div", { style: styles.timelineItem, children: [
        /* @__PURE__ */ jsx4("div", { style: styles.dot }),
        /* @__PURE__ */ jsx4("div", { style: styles.content, children: insight.text })
      ] }, `insight-${idx}`))
    ] }),
    response.actions.length > 0 && /* @__PURE__ */ jsxs4(Fragment, { children: [
      /* @__PURE__ */ jsx4("div", { style: styles.label, children: "Actions" }),
      response.actions.map((action, idx) => /* @__PURE__ */ jsxs4("div", { style: styles.timelineItem, children: [
        /* @__PURE__ */ jsx4("div", { style: { ...styles.dot, ...styles.actionDot } }),
        /* @__PURE__ */ jsxs4("div", { style: styles.content, children: [
          action.priority && /* @__PURE__ */ jsxs4("strong", { children: [
            "[",
            action.priority.toUpperCase(),
            "]"
          ] }),
          " ",
          action.text
        ] })
      ] }, `action-${idx}`))
    ] })
  ] });
};

// src/hooks/useReadable.ts
import { useState, useMemo } from "react";
import { parseAIResponse } from "@readable-ai/core";
function useReadable(input, config) {
  const [error, setError] = useState(null);
  const result = useMemo(() => {
    try {
      if (typeof input === "string") {
        return parseAIResponse(input, config);
      }
      return input;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error parsing response";
      setError(message);
      return null;
    }
  }, [input, config]);
  return { result, error };
}

// src/components/Readable.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var RENDERERS = {
  cards: CardsRenderer,
  stats: StatsRenderer,
  chat: ChatRenderer,
  timeline: TimelineRenderer
};
var Readable = ({
  response,
  renderer = "cards",
  theme = "dark",
  parserConfig,
  overrides,
  onParse
}) => {
  const { result, error } = useReadable(response, parserConfig);
  if (error) {
    return /* @__PURE__ */ jsxs5("div", { style: { color: "#ef4444", padding: "1rem", fontFamily: "monospace" }, children: [
      "Error parsing response: ",
      error
    ] });
  }
  if (!result) {
    return /* @__PURE__ */ jsx5("div", { children: "Loading..." });
  }
  if (onParse) {
    onParse(result);
  }
  const RendererComponent = RENDERERS[renderer] || RENDERERS.cards;
  return /* @__PURE__ */ jsx5(RendererComponent, { response: result, theme, overrides });
};

// src/hooks/useStreamingReadable.ts
import { useState as useState2, useCallback, useRef } from "react";
import { createStreamingState, processStreamChunk } from "@readable-ai/core";
function useStreamingReadable(config) {
  const [parsed, setParsed] = useState2(null);
  const [error, setError] = useState2(null);
  const stateRef = useRef(null);
  const reset = useCallback(() => {
    stateRef.current = createStreamingState();
    setParsed(null);
    setError(null);
  }, []);
  const addChunk = useCallback(
    (chunk) => {
      try {
        if (!stateRef.current) {
          stateRef.current = createStreamingState();
        }
        const result = processStreamChunk(chunk, stateRef.current, config);
        setParsed(result);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error processing chunk";
        setError(message);
      }
    },
    [config]
  );
  const finalize = useCallback(() => {
    if (stateRef.current && parsed) {
      setParsed({
        ...parsed,
        metadata: {
          ...parsed.metadata,
          parseMode: "complete"
        }
      });
    }
  }, [parsed]);
  return { parsed, error, addChunk, reset, finalize };
}
export {
  CardsRenderer,
  ChatRenderer,
  Readable,
  StatsRenderer,
  TimelineRenderer,
  useReadable,
  useStreamingReadable,
  useTheme
};
