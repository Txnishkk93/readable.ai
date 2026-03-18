'use client';

import { useState, useCallback } from 'react';
import type { ParsedResponse, ParserConfig } from '../core/types';

export type InputType = 'csv' | 'json' | 'prose' | 'metrics' | 'actions' | 'mixed' | 'unknown';
export type SuggestedRenderer = 'cards' | 'stats' | 'timeline' | 'chat';

export interface AIVisualizeResult {
  parsed: ParsedResponse;
  inputType: InputType;
  suggestedRenderer: SuggestedRenderer;
  confidence: number;
}

export interface UseAIVisualizeReturn {
  result: AIVisualizeResult | null;
  loading: boolean;
  error: string | null;
  analyze: (input: string, config?: ParserConfig) => Promise<void>;
  reset: () => void;
}

const GROQ_SYSTEM_PROMPT = `You are a data visualization expert. Analyze any input and return ONLY a valid JSON object — no markdown, no explanation, no backticks.

Return exactly this shape:
{
  "inputType": "csv" | "json" | "prose" | "metrics" | "actions" | "mixed" | "unknown",
  "suggestedRenderer": "cards" | "stats" | "timeline" | "chat",
  "confidence": number,
  "raw": "original input",
  "metrics": [{ "label": string, "value": string, "unit": string, "context": string, "confidence": number, "raw": string }],
  "insights": [{ "text": string, "category": "factual" | "observation" | "question", "confidence": number }],
  "actions": [{ "text": string, "priority": "high" | "medium" | "low", "confidence": number }],
  "unparsed": [],
  "metadata": { "processedAt": "ISO string", "tokenCount": number, "parseMode": "complete" }
}

Rules:
- Extract ALL numbers/percentages/monetary values as metrics with proper labels
- Bullet points with action verbs (fix, implement, add, update, etc.) → actions
- Facts, observations, questions → insights
- suggestedRenderer: "stats" for mostly numbers, "timeline" for steps/sequential, "cards" for mixed, "chat" for conversational
- For CSV: parse rows into metrics where values are numeric
- For JSON: extract key-value pairs into metrics or insights
- Return ONLY the JSON object.`;

export function useAIVisualize(): UseAIVisualizeReturn {
  const [result, setResult] = useState<AIVisualizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (input: string, _config?: ParserConfig) => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      if (!apiKey) throw new Error('NEXT_PUBLIC_GROQ_API_KEY is not set');

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.1,
          max_tokens: 2048,
          messages: [
            { role: 'system', content: GROQ_SYSTEM_PROMPT },
            { role: 'user', content: input },
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? `Groq error ${res.status}`);
      }

      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content ?? '';

      // Strip markdown fences if model adds them
      const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed: ParsedResponse = JSON.parse(clean);

      setResult({
        parsed,
        inputType: (parsed as unknown as { inputType: InputType }).inputType ?? 'unknown',
        suggestedRenderer: (parsed as unknown as { suggestedRenderer: SuggestedRenderer }).suggestedRenderer ?? 'cards',
        confidence: parsed.confidence ?? 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze input');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { result, loading, error, analyze, reset };
}