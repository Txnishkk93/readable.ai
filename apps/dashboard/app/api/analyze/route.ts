import { NextResponse } from 'next/server';

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

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function isAllowed(ip: string): boolean {
  const now = Date.now();
  const current = rateLimitMap.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!isAllowed(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again in a minute.' },
      { status: 429 }
    );
  }

  const { input } = await request.json().catch(() => ({ input: '' }));
  const text = typeof input === 'string' ? input.trim() : '';

  if (!text) {
    return NextResponse.json({ error: 'Input is required.' }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Smart mode is unavailable because GROQ_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
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
          { role: 'user', content: text },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err?.error?.message ?? `Groq request failed (${res.status})` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? '';
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ parsed });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Smart analysis failed.' },
      { status: 500 }
    );
  }
}
