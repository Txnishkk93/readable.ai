'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, Zap, Palette } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            readable.ai
          </div>
          <div className="flex gap-4">
            <Link href="/playground">
              <Button variant="ghost">Playground</Button>
            </Link>
            <Link href="/embed">
              <Button variant="ghost">Embed</Button>
            </Link>
            <a href="https://github.com/Txnishkk93/readable.ai" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">GitHub</Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6 leading-tight">
            Parse AI responses into beautiful UI
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Every developer building with LLMs rebuilds the same display layer. Convert walls of text into structured data and stunning components in three lines of code.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/playground">
              <Button size="lg" className="gap-2">
                Try Playground
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a
              href="https://github.com/Txnishkk93/readable.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>

        {/* Code Example */}
        <Card className="max-w-2xl mx-auto mb-12">
          <CardContent className="pt-6">
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto text-sm">
{`import { Readable } from '@readable-ai/react';

export default () => (
  <Readable 
    response={aiResponse} 
    renderer="cards" 
    theme="dark" 
  />
);`}
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-50 mb-12">
            Why readable.ai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Code className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle>Zero Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Pure TypeScript parser. Works anywhere. npm, browsers, edge functions — it doesn't matter.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                <CardTitle>80% Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Pattern-based detection handles metrics, actions, and insights. Graceful fallback to plain text for edge cases.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Palette className="w-8 h-8 text-pink-500 mb-2" />
                <CardTitle>4 Renderers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cards, Stats, Chat, Timeline. Dark/light themes. CSS variable theming for custom brands.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
              The Problem
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Your LLM returns intelligent output. And you stare at a wall of unformatted text asking: "Now how do I show this to a user?"
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You build it yourself. Every time. You write regex to find numbers. You map bullet points into JSX. You handle streaming. You repeat this for every new AI feature.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              This is the equivalent of building your own button before you can ship a form. It's invisible work that produces no competitive advantage.
            </p>
          </div>
          <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-900 dark:text-red-100">Before</CardTitle>
            </CardHeader>
            <CardContent className="text-red-800 dark:text-red-200 text-sm space-y-2">
              <p>✗ Call GPT-4, get 400 words of plain text</p>
              <p>✗ Spend 3 days building display component</p>
              <p>✗ Component breaks when LLM changes format</p>
              <p>✗ Repeat for next AI feature</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-blue-50 dark:bg-blue-950">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900 order-2">
              <CardHeader>
                <CardTitle className="text-green-900 dark:text-green-100">After</CardTitle>
              </CardHeader>
              <CardContent className="text-green-800 dark:text-green-200 text-sm space-y-2">
                <p>✓ Pass response to {'<Readable />'}</p>
                <p>✓ Pick a renderer</p>
                <p>✓ Ship in 20 minutes</p>
                <p>✓ Parser adapts to output drift</p>
              </CardContent>
            </Card>
            <div className="order-1">
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-6">
                The Solution
              </h2>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                <strong>readable.ai</strong> is three things:
              </p>
              <ul className="space-y-3 text-blue-800 dark:text-blue-200">
                <li className="flex gap-2">
                  <span className="font-bold">1. Parser Engine</span>
                  <span>Pure TS function. Converts raw text into structured data.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2. Renderer Library</span>
                  <span>React components. Pick your layout. Customize with CSS variables.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3. Embed System</span>
                  <span>Script tag. Works anywhere. No build step required.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Ready to ship AI features faster?
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Try the playground with your own AI responses. Free forever for indie developers. Pro tier coming soon for teams.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/playground">
            <Button size="lg">Start Building</Button>
          </Link>
          <Link href="/embed">
            <Button size="lg" variant="outline">
              Embed on Website
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 text-center text-slate-600 dark:text-slate-400 text-sm">
          <p>
            readable.ai — Parse AI responses into beautiful UI.{' '}
            <a href="https://github.com/Txnishkk93/readable.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
              View Source
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
