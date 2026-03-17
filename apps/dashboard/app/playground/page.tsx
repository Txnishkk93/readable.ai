'use client';

import { useState } from 'react';
import { Readable } from '@readable-ai/react';
import type { ParsedResponse } from '@readable-ai/core';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    const config = {
      response: input,
      renderer,
      theme,
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            readable.ai Playground
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Paste any AI response and see how it's parsed and rendered.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>Paste your LLM response</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste AI response here..."
                className="min-h-64 font-mono text-sm"
              />

              {/* Quick Examples */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Quick Examples:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(EXAMPLE_RESPONSES).map(([key, value]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(value)}
                      className="justify-start"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                    Renderer
                  </label>
                  <Select value={renderer} onValueChange={(v) => setRenderer(v as RendererType)}>
                    <SelectTrigger>
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                    Theme
                  </label>
                  <Select value={theme} onValueChange={(v) => setTheme(v as ThemeType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={copyToClipboard} className="w-full">
                {copied ? '✓ Copied' : 'Copy Config'}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>Rendered response</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`p-6 rounded-lg border ${
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

        {/* Parse Data Section */}
        {parsed && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Parsed Data</CardTitle>
              <CardDescription>JSON representation of extracted data</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="metrics">
                    Metrics ({parsed.metrics.length})
                  </TabsTrigger>
                  <TabsTrigger value="insights">
                    Insights ({parsed.insights.length})
                  </TabsTrigger>
                  <TabsTrigger value="actions">
                    Actions ({parsed.actions.length})
                  </TabsTrigger>
                  <TabsTrigger value="all">Raw</TabsTrigger>
                </TabsList>
                <TabsContent value="metrics" className="mt-4">
                  <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                    {JSON.stringify(parsed.metrics, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="insights" className="mt-4">
                  <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                    {JSON.stringify(parsed.insights, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="actions" className="mt-4">
                  <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                    {JSON.stringify(parsed.actions, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="all" className="mt-4">
                  <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-sm">
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
