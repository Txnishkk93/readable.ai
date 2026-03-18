'use client';

import { useState, useEffect, useRef } from 'react';
import { Readable } from '@/lib/react';
import type { ParsedResponse } from '@/lib/core';
import { useAIVisualize } from '@/lib/hooks/useAIVisualize';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Loader2, Zap, FileText, Braces, Table2, ArrowRight, RotateCcw } from 'lucide-react';

const EXAMPLE_RESPONSES = {
  analytics: 'Conversion rate increased 23% month-over-month. Traffic rose by 1200 users. Average page load time improved from 2.3s to 1.8s. The bounce rate decreased 15%. Revenue per user climbed to $42.50.',
  actions: 'Should implement caching for database queries immediately. Need to add rate limiting to prevent abuse. Must fix the memory leak in the session handler. Consider optimizing the bundle size. Recommend adding unit tests.',
  mixed: 'We received 5000 customer feedback items this week. The satisfaction score is 4.2 out of 5.0. Should prioritize the top 10 complaints. Performance degraded 8% due to database load. Fix the email notification bug ASAP.',
  csv: 'Month,Revenue,Users,Churn\nJan,42000,1200,3.2%\nFeb,51000,1450,2.8%\nMar,63000,1820,2.1%\nApr,71000,2100,1.9%',
  json: '{"summary":"Q4 Performance","revenue":284000,"growth":"34%","topProducts":["Pro Plan","Enterprise"],"churnRate":0.024,"nps":72}',
};

const EXAMPLE_ICONS: Record<string, React.ReactNode> = {
  analytics: <Zap className="w-3 h-3" />,
  actions: <FileText className="w-3 h-3" />,
  mixed: <Sparkles className="w-3 h-3" />,
  csv: <Table2 className="w-3 h-3" />,
  json: <Braces className="w-3 h-3" />,
};

type RendererType = 'cards' | 'stats' | 'chat' | 'timeline';
type ThemeType = 'dark' | 'light';
type ModeType = 'manual' | 'ai';

export default function PlaygroundPage() {
  const [input, setInput] = useState(EXAMPLE_RESPONSES.analytics);
  const [renderer, setRenderer] = useState<RendererType>('cards');
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [manualParsed, setManualParsed] = useState<ParsedResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<ModeType>('manual');
  const parsedRef = useRef<ParsedResponse | null>(null);

  const { result: aiResult, loading: aiLoading, error: aiError, analyze, reset } = useAIVisualize();

  useEffect(() => {
    if (parsedRef.current) {
      setManualParsed(parsedRef.current);
      parsedRef.current = null;
    }
  });

  const handleParse = (response: ParsedResponse) => {
    parsedRef.current = response;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify({ response: input, renderer, theme }, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyze = async () => {
    reset();
    await analyze(input);
  };

  const effectiveRenderer: RendererType =
    mode === 'ai' && aiResult?.suggestedRenderer &&
    (['cards', 'stats', 'chat', 'timeline'] as string[]).includes(aiResult.suggestedRenderer)
      ? (aiResult.suggestedRenderer as RendererType)
      : renderer;

  const displayParsed = mode === 'ai' && aiResult ? aiResult.parsed : manualParsed;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Top spacing so content doesn't stick to very top */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-16 pb-12">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Playground
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'ai'
                ? 'AI auto-detects your data type and picks the best renderer.'
                : "Paste any AI response and see how it's parsed and rendered."}
            </p>
          </div>

          {/* Top-right mode switch */}
          {mode === 'manual' ? (
            <Button
              onClick={() => setMode('ai')}
              variant="outline"
              size="lg"
              className="gap-2 border-slate-300 dark:border-slate-600"
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Try AI Mode
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => { setMode('manual'); reset(); }}
              variant="outline"
              size="lg"
              className="gap-2 border-slate-300 dark:border-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
              Back to Manual
            </Button>
          )}
        </div>

        {/* ── AI mode info banner ── */}
        {mode === 'ai' && (
          <div className="mb-6 flex items-start gap-3 px-5 py-4 bg-slate-900 dark:bg-slate-800 border border-slate-700 rounded-lg">
            <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">
                Powered by Groq · Llama 3.3 70B
              </p>
              <p className="text-sm text-slate-400">
                Paste CSV, JSON, prose, or bullet points — AI picks the best renderer automatically.
                Requires{' '}
                <code className="bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded font-mono text-xs">
                  NEXT_PUBLIC_GROQ_API_KEY
                </code>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Input Panel ── */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-fit">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50">Input</CardTitle>
              <CardDescription>
                {mode === 'ai' ? 'Paste any data — CSV, JSON, text, LLM output' : 'Paste your LLM response'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <Textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); reset(); }}
                placeholder={mode === 'ai'
                  ? 'Paste anything — CSV, JSON, plain text, AI output...'
                  : 'Paste AI response here...'}
                className="min-h-48 font-mono text-xs resize-none bg-slate-50 dark:bg-slate-950"
              />

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Examples
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(EXAMPLE_RESPONSES).map(([key, value]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => { setInput(value); reset(); }}
                      className={`text-xs h-7 px-3 gap-1.5 border-slate-200 dark:border-slate-700 ${
                        input === value
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {EXAMPLE_ICONS[key]}
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Manual controls */}
              {mode === 'manual' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Renderer</label>
                      <Select value={renderer} onValueChange={(v) => setRenderer(v as RendererType)}>
                        <SelectTrigger className="h-9 text-sm bg-white dark:bg-slate-950"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cards">Cards</SelectItem>
                          <SelectItem value="stats">Stats</SelectItem>
                          <SelectItem value="chat">Chat</SelectItem>
                          <SelectItem value="timeline">Timeline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Theme</label>
                      <Select value={theme} onValueChange={(v) => setTheme(v as ThemeType)}>
                        <SelectTrigger className="h-9 text-sm bg-white dark:bg-slate-950"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={copyToClipboard} variant="outline" className="w-full h-9 border-slate-200 dark:border-slate-700">
                    {copied ? '✓ Copied' : 'Copy Config'}
                  </Button>
                </>
              )}

              {/* AI mode controls */}
              {mode === 'ai' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Theme</label>
                      <Select value={theme} onValueChange={(v) => setTheme(v as ThemeType)}>
                        <SelectTrigger className="h-9 text-sm bg-white dark:bg-slate-950"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Override Renderer</label>
                      <Select value={effectiveRenderer} onValueChange={(v) => setRenderer(v as RendererType)}>
                        <SelectTrigger className="h-9 text-sm bg-white dark:bg-slate-950"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cards">Cards</SelectItem>
                          <SelectItem value="stats">Stats</SelectItem>
                          <SelectItem value="chat">Chat</SelectItem>
                          <SelectItem value="timeline">Timeline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={aiLoading || !input.trim()}
                    size="lg"
                    className="w-full gap-2"
                  >
                    {aiLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Analyzing with Groq...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" />Analyze &amp; Visualize<ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>
                  {aiError && (
                    <div className="px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">{aiError}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Output Panel ── */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 pt-6 px-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50">Output</CardTitle>
                  <CardDescription>Rendered response</CardDescription>
                </div>
                {mode === 'ai' && aiResult && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-medium border border-slate-200 dark:border-slate-700">
                      {aiResult.inputType}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-white font-medium border border-slate-700">
                      {aiResult.suggestedRenderer}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium border border-slate-200 dark:border-slate-700">
                      {Math.round(aiResult.confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {mode === 'ai' && !aiResult && !aiLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">Ready to analyze</p>
                    <p className="text-sm text-slate-400">Paste your data on the left and click Analyze &amp; Visualize</p>
                  </div>
                </div>
              )}
              {mode === 'ai' && aiLoading && (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Analyzing your data...</p>
                </div>
              )}
              {(mode === 'manual' || (mode === 'ai' && aiResult)) && (
                <div className={`p-5 rounded-lg border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <Readable
                    response={mode === 'ai' && aiResult ? aiResult.parsed : input}
                    renderer={effectiveRenderer}
                    theme={theme}
                    onParse={handleParse}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Parsed Data ── */}
        {displayParsed && (
          <Card className="mt-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50">Parsed data</CardTitle>
              <CardDescription>
                {mode === 'ai' ? 'AI-extracted structured data via Groq' : 'JSON output from core parser'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="h-9 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {[
                    { value: 'metrics', label: `Metrics (${displayParsed.metrics.length})` },
                    { value: 'insights', label: `Insights (${displayParsed.insights.length})` },
                    { value: 'actions', label: `Actions (${displayParsed.actions.length})` },
                    { value: 'all', label: 'Raw JSON' },
                  ].map(({ value, label }) => (
                    <TabsTrigger key={value} value={value} className="text-xs px-3">{label}</TabsTrigger>
                  ))}
                </TabsList>
                {(['metrics', 'insights', 'actions'] as const).map((key) => (
                  <TabsContent key={key} value={key} className="mt-3">
                    <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-auto max-h-72 text-xs leading-relaxed border border-slate-800">
                      {JSON.stringify(displayParsed[key], null, 2)}
                    </pre>
                  </TabsContent>
                ))}
                <TabsContent value="all" className="mt-3">
                  <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-auto max-h-72 text-xs leading-relaxed border border-slate-800">
                    {JSON.stringify(displayParsed, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}