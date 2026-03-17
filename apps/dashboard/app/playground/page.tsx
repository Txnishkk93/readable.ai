'use client';

import { useState } from 'react';
import { Readable } from '@/lib/react';
import type { ParsedResponse } from '@/lib/core';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const EXAMPLE_RESPONSES = {
  analytics: 'Conversion rate increased 23% month-over-month. Traffic rose by 1200 users. Average page load time improved from 2.3s to 1.8s. The bounce rate decreased 15%. Revenue per user climbed to $42.50.',
  actions: 'Should implement caching for database queries immediately. Need to add rate limiting to prevent abuse. Must fix the memory leak in the session handler. Consider optimizing the bundle size. Recommend adding unit tests.',
  mixed: 'We received 5000 customer feedback items this week. The satisfaction score is 4.2 out of 5.0. Should prioritize the top 10 complaints. Performance degraded 8% due to database load. Fix the email notification bug ASAP.',
};

type RendererType = 'cards' | 'stats' | 'chat' | 'timeline';
type ThemeType = 'dark' | 'light';

export default function PlaygroundPage() {
  const [input, setInput] = useState(EXAMPLE_RESPONSES.analytics);
  const [renderer, setRenderer] = useState<RendererType>('cards');
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [parsed, setParsed] = useState<ParsedResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleParse = (response: ParsedResponse) => {
    setParsed(response);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify({ response: input, renderer, theme }, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* Nav */}
      <nav className="h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-slate-900 dark:text-slate-50 tracking-tight">
            readable.ai
          </Link>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Playground</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight mb-1">
            Playground
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Paste any AI response and see how it&apos;s parsed and rendered.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Input */}
          <Card className="border-slate-200 dark:border-slate-800 h-fit">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-medium">Input</CardTitle>
              <CardDescription className="text-xs">Paste your LLM response</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste AI response here..."
                className="min-h-48 font-mono text-xs resize-none"
              />

              {/* Examples */}
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 tracking-wide uppercase">
                  Examples
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(EXAMPLE_RESPONSES).map(([key, value]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(value)}
                      className={`text-xs h-7 px-3 ${input === value ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1.5">
                    Renderer
                  </label>
                  <Select value={renderer} onValueChange={(v) => setRenderer(v as RendererType)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cards">Cards</SelectItem>
                      <SelectItem value="stats">Stats</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                      <SelectItem value="timeline">Timeline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1.5">
                    Theme
                  </label>
                  <Select value={theme} onValueChange={(v) => setTheme(v as ThemeType)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="w-full text-xs h-8"
              >
                {copied ? '✓ Copied' : 'Copy Config'}
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-medium">Output</CardTitle>
              <CardDescription className="text-xs">Rendered response</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div
                className={`p-5 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800'
                    : 'bg-white border-slate-200'
                }`}
              >
                <Readable
                  response={input}
                  renderer={renderer}
                  theme={theme}
                  onParse={handleParse}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parsed Data */}
        {parsed && (
          <Card className="mt-4 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-medium">Parsed data</CardTitle>
              <CardDescription className="text-xs">JSON representation of extracted data</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="h-8 gap-1 bg-slate-100 dark:bg-slate-800/50">
                  {[
                    { value: 'metrics', label: `Metrics (${parsed.metrics.length})` },
                    { value: 'insights', label: `Insights (${parsed.insights.length})` },
                    { value: 'actions', label: `Actions (${parsed.actions.length})` },
                    { value: 'all', label: 'Raw' },
                  ].map(({ value, label }) => (
                    <TabsTrigger key={value} value={value} className="text-xs h-6 px-3">
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {(['metrics', 'insights', 'actions'] as const).map((key) => (
                  <TabsContent key={key} value={key} className="mt-3">
                    <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-auto max-h-72 text-xs leading-relaxed">
                      {JSON.stringify(parsed[key], null, 2)}
                    </pre>
                  </TabsContent>
                ))}
                <TabsContent value="all" className="mt-3">
                  <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-auto max-h-72 text-xs leading-relaxed">
                    {JSON.stringify(parsed, null, 2)}
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