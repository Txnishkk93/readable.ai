"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  classifyIntent: () => classifyIntent,
  createStreamingState: () => createStreamingState,
  detectMetrics: () => detectMetrics,
  hasSufficientContext: () => hasSufficientContext,
  parseAIResponse: () => parseAIResponse,
  processStreamChunk: () => processStreamChunk,
  scoreConfidence: () => scoreConfidence,
  tokenizeLines: () => tokenizeLines,
  tokenizeText: () => tokenizeText,
  tokenizeWords: () => tokenizeWords
});
module.exports = __toCommonJS(index_exports);

// src/tokenizer.ts
function tokenizeText(text) {
  if (!text || text.trim().length === 0) {
    return [];
  }
  const sentences = text.split(/([.!?])\s+/).reduce((acc, part, index, arr) => {
    if (index % 2 === 0 && part.trim()) {
      const nextPunct = arr[index + 1];
      if (nextPunct && [".", "!", "?"].includes(nextPunct)) {
        acc.push((part + nextPunct).trim());
      } else {
        acc.push(part.trim());
      }
    }
    return acc;
  }, []);
  return sentences.filter((s) => s.length > 0 && !isCodeBlock(s)).map((s) => s.trim());
}
function isCodeBlock(sentence) {
  const codePatterns = [/```[\s\S]*?```/, /`[^`]+`/, /^\s*const\s+/, /^\s*function\s+/];
  return codePatterns.some((pattern) => pattern.test(sentence));
}
function tokenizeLines(text) {
  return text.split("\n").filter((line) => line.trim().length > 0);
}
function tokenizeWords(sentence) {
  return sentence.replace(/[^\w\s-]/g, " ").split(/\s+/).filter((w) => w.length > 0);
}

// src/metric-detector.ts
function detectMetrics(sentence, hint = "general") {
  const patterns = [
    // Percentage patterns (highest priority)
    { regex: /(\d+(?:\.\d+)?)\s*%(?:\s+(?:increase|decrease|growth|change))?/i, unit: "%", priority: 100 },
    { regex: /(?:increase|decrease|growth|change|up|down)\s+(\d+(?:\.\d+)?)\s*%/i, unit: "%", priority: 100 },
    { regex: /from\s+(\d+(?:\.\d+)?)\s*%\s+to\s+(\d+(?:\.\d+)?)\s*%/i, unit: "%", priority: 90 },
    // Time-based metrics
    { regex: /(\d+(?:\.\d+)?)\s*(?:ms|milliseconds?)/i, unit: "ms", priority: 95 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:sec|seconds?|s)(?!\w)/i, unit: "s", priority: 95 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:min|minutes?)/i, unit: "min", priority: 90 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:hour|hours?|hrs?)/i, unit: "h", priority: 90 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:days?|d)(?!\w)/i, unit: "d", priority: 85 },
    // Currency patterns
    { regex: /\$(\d+(?:,\d{3})*(?:\.\d+)?)/i, unit: "$", priority: 95 },
    { regex: /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:dollars?|USD)/i, unit: "$", priority: 90 },
    // Count metrics (users, requests, items)
    { regex: /(\d+(?:,\d{3})*)\s+(?:users?|requests?|items?|events?|sessions?)/i, priority: 85 },
    { regex: /(\d+(?:,\d{3})*)\s+(?:visitors?|customers?|people)/i, priority: 85 },
    // Size metrics
    { regex: /(\d+(?:\.\d+)?)\s*(?:GB|MB|KB|B)(?!\w)/i, priority: 85 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:gigabytes?|megabytes?|kilobytes?)/i, priority: 80 },
    // General number patterns (lowest priority)
    { regex: /(?:is|are|was|were|has|have|equals?|=)\s+(\d+(?:,\d{3})*(?:\.\d+)?)/i, priority: 50 },
    { regex: /(\d+(?:,\d{3})*(?:\.\d+)?)\s+(?:of|out of)/i, priority: 45 }
  ];
  if (hint === "analytics") {
    patterns.unshift(
      { regex: /(\d+(?:\.\d+)?)\s*(?:conversions?|clicks?)/i, priority: 100 },
      { regex: /CTR:?\s+(\d+(?:\.\d+)?)\s*%/i, unit: "%", priority: 100 },
      { regex: /bounce\s+rate:?\s+(\d+(?:\.\d+)?)\s*%/i, unit: "%", priority: 100 }
    );
  }
  for (const pattern of patterns) {
    const match = sentence.match(pattern.regex);
    if (match) {
      const value = match[1] ? match[1].replace(/,/g, "") : match[0];
      const confidence = 0.3 + pattern.priority / 100 * 0.7;
      return {
        label: extractLabel(sentence, match[0]),
        value: parseFloat(value) || value,
        unit: pattern.unit,
        context: sentence,
        confidence: Math.min(1, confidence),
        raw: match[0]
      };
    }
  }
  return null;
}
function extractLabel(sentence, metricMatch) {
  const beforeMetric = sentence.substring(0, sentence.indexOf(metricMatch)).trim();
  const afterMetric = sentence.substring(sentence.indexOf(metricMatch) + metricMatch.length).trim();
  const beforeWords = beforeMetric.split(/\s+/).slice(-3).join(" ");
  if (beforeWords && beforeWords.length > 0) {
    return beforeWords;
  }
  const afterWords = afterMetric.split(/\s+/).slice(0, 3).join(" ");
  if (afterWords && afterWords.length > 0) {
    return afterWords;
  }
  return metricMatch;
}

// src/intent-classifier.ts
var ACTION_KEYWORDS = [
  "should",
  "must",
  "need",
  "needs",
  "required",
  "require",
  "recommend",
  "suggestion",
  "suggest",
  "fix",
  "improve",
  "address",
  "resolve",
  "consider",
  "implement",
  "add",
  "remove",
  "update",
  "change",
  "investigate",
  "monitor"
];
var HIGH_PRIORITY_KEYWORDS = [
  "critical",
  "urgent",
  "immediately",
  "asap",
  "high priority",
  "must",
  "essential",
  "blocking"
];
var QUESTION_MARKERS = ["?", "what", "when", "where", "why", "how", "which", "who", "is", "are"];
function classifyIntent(sentence) {
  const lower = sentence.toLowerCase();
  if (sentence.includes("?") || QUESTION_MARKERS.some((marker) => lower.startsWith(marker))) {
    return {
      type: "insight",
      category: "question",
      confidence: 0.85
    };
  }
  const actionMatch = ACTION_KEYWORDS.find((kw) => lower.includes(kw));
  if (actionMatch) {
    let priority = "medium";
    if (HIGH_PRIORITY_KEYWORDS.some((kw) => lower.includes(kw))) {
      priority = "high";
    } else if (["consider", "might", "could", "optional"].some((kw) => lower.includes(kw))) {
      priority = "low";
    }
    return {
      type: "action",
      priority,
      confidence: 0.75
    };
  }
  return {
    type: "insight",
    category: "factual",
    confidence: 0.6
  };
}

// src/parser.ts
var DEFAULT_CONFIG = {
  confidenceThreshold: 0.3,
  hint: "general",
  strict: false
};
function parseAIResponse(text, config) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = (/* @__PURE__ */ new Date()).toISOString();
  const normalized = normalizeText(text);
  const sentences = tokenizeText(normalized);
  const metrics = [];
  const insights = [];
  const actions = [];
  const unparsed = [];
  for (const sentence of sentences) {
    const metricMatch = detectMetrics(sentence, mergedConfig.hint);
    if (metricMatch && metricMatch.confidence >= mergedConfig.confidenceThreshold) {
      metrics.push(metricMatch);
      continue;
    }
    const intent = classifyIntent(sentence);
    if (intent.type === "action" && intent.confidence >= mergedConfig.confidenceThreshold) {
      actions.push({
        text: sentence,
        priority: intent.priority,
        confidence: intent.confidence
      });
    } else if (intent.type === "insight") {
      insights.push({
        text: sentence,
        category: intent.category,
        confidence: intent.confidence
      });
    } else {
      unparsed.push(sentence);
    }
  }
  const allElements = [...metrics, ...insights, ...actions];
  const overallConfidence = allElements.length > 0 ? allElements.reduce((sum, el) => sum + el.confidence, 0) / allElements.length : 0;
  return {
    raw: text,
    metrics,
    insights,
    actions,
    confidence: Math.min(1, Math.max(0, overallConfidence)),
    unparsed,
    metadata: {
      processedAt: startTime,
      tokenCount: sentences.length,
      parseMode: "complete"
    }
  };
}
function createStreamingState() {
  return {
    buffer: "",
    lastParsedIndex: 0,
    pendingSentence: "",
    parsedSoFar: {
      metrics: [],
      insights: [],
      actions: [],
      unparsed: [],
      confidence: 0,
      metadata: {
        processedAt: (/* @__PURE__ */ new Date()).toISOString(),
        tokenCount: 0,
        parseMode: "streaming"
      }
    }
  };
}
function processStreamChunk(chunk, state, config) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  state.buffer += chunk;
  const sentenceRegex = /([^.!?\n]+[.!?\n])/g;
  let match;
  let lastIndex = 0;
  const completedSentences = [];
  while ((match = sentenceRegex.exec(state.buffer)) !== null) {
    completedSentences.push(match[1].trim());
    lastIndex = sentenceRegex.lastIndex;
  }
  state.pendingSentence = state.buffer.substring(lastIndex);
  for (const sentence of completedSentences) {
    const metricMatch = detectMetrics(sentence, mergedConfig.hint);
    if (metricMatch && metricMatch.confidence >= mergedConfig.confidenceThreshold) {
      state.parsedSoFar.metrics.push(metricMatch);
    } else {
      const intent = classifyIntent(sentence);
      if (intent.type === "action" && intent.confidence >= mergedConfig.confidenceThreshold) {
        state.parsedSoFar.actions.push({
          text: sentence,
          priority: intent.priority,
          confidence: intent.confidence
        });
      } else if (intent.type === "insight") {
        state.parsedSoFar.insights.push({
          text: sentence,
          category: intent.category,
          confidence: intent.confidence
        });
      } else {
        state.parsedSoFar.unparsed.push(sentence);
      }
    }
  }
  state.parsedSoFar.metadata.tokenCount = (state.parsedSoFar.metrics?.length || 0) + (state.parsedSoFar.insights?.length || 0) + (state.parsedSoFar.actions?.length || 0);
  const allElements = [
    ...state.parsedSoFar.metrics || [],
    ...state.parsedSoFar.insights || [],
    ...state.parsedSoFar.actions || []
  ];
  state.parsedSoFar.confidence = allElements.length > 0 ? allElements.reduce((sum, el) => sum + el.confidence, 0) / allElements.length : 0;
  return state.parsedSoFar;
}
function normalizeText(text) {
  return text.replace(/\s+/g, " ").replace(/\n\n+/g, "\n").trim();
}

// src/confidence-scorer.ts
function scoreConfidence(contextLength, matchQuality) {
  let score = 0;
  if (matchQuality === "exact") {
    score = 0.9;
  } else if (matchQuality === "fuzzy") {
    score = 0.6;
  } else {
    score = 0.4;
  }
  if (contextLength > 50) {
    score += 0.15;
  } else if (contextLength > 20) {
    score += 0.1;
  } else if (contextLength < 5) {
    score -= 0.2;
  }
  return Math.min(1, Math.max(0, score));
}
function hasSufficientContext(sentence, minWords = 3) {
  const words = sentence.split(/\s+/).filter((w) => w.length > 0);
  return words.length >= minWords;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  classifyIntent,
  createStreamingState,
  detectMetrics,
  hasSufficientContext,
  parseAIResponse,
  processStreamChunk,
  scoreConfidence,
  tokenizeLines,
  tokenizeText,
  tokenizeWords
});
