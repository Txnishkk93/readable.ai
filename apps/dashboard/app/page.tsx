'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, Zap, Palette, X, ChevronRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type PageId =
  | 'overview' | 'quickstart' | 'installation'
  | 'parser' | 'renderers' | 'themes' | 'streaming'
  | 'core-api' | 'react-api' | 'embed-api'
  | 'vercel-ai' | 'openai' | 'anthropic'
  | 'embed-guide' | 'playground-guide' | 'changelog';

type RendererTab = 'cards' | 'stats' | 'chat' | 'timeline';

// ─── Sidebar config ───────────────────────────────────────────────────────────

const SIDEBAR_SECTIONS = [
  {
    title: 'Getting Started',
    links: [
      { id: 'overview' as PageId, label: 'Overview', icon: '⬡' },
      { id: 'quickstart' as PageId, label: 'Quickstart', icon: '⚡' },
      { id: 'installation' as PageId, label: 'Installation', icon: '📦' },
    ],
  },
  {
    title: 'Core Concepts',
    links: [
      { id: 'parser' as PageId, label: 'Parser Engine', icon: '⚙' },
      { id: 'renderers' as PageId, label: 'Renderers', icon: '🎨' },
      { id: 'themes' as PageId, label: 'Theming', icon: '◐' },
      { id: 'streaming' as PageId, label: 'Streaming', icon: '⟳', badge: 'new' },
    ],
  },
  {
    title: 'Packages',
    links: [
      { id: 'core-api' as PageId, label: '@readable-ai/core', icon: '◈' },
      { id: 'react-api' as PageId, label: '@readable-ai/react', icon: '◈' },
      { id: 'embed-api' as PageId, label: '@readable-ai/embed', icon: '◈' },
    ],
  },
  {
    title: 'Integrations',
    links: [
      { id: 'vercel-ai' as PageId, label: 'Vercel AI SDK', icon: '▲' },
      { id: 'openai' as PageId, label: 'OpenAI', icon: '○' },
      { id: 'anthropic' as PageId, label: 'Anthropic', icon: '◇' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { id: 'embed-guide' as PageId, label: 'Embed Guide', icon: '</>' },
      { id: 'playground-guide' as PageId, label: 'Playground', icon: '⧐' },
      { id: 'changelog' as PageId, label: 'Changelog', icon: '📋', badge: '0.1' },
    ],
  },
];

// ─── Docs primitives ──────────────────────────────────────────────────────────

function CodeBlock({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <div className="relative my-4 rounded-xl border border-white/[0.07] bg-slate-900 overflow-x-auto">
      <span className="absolute top-2.5 right-3 text-[10px] font-mono text-white/20 uppercase tracking-wider select-none">{lang}</span>
      <pre className="p-4 pr-14 overflow-x-auto">
        <code className="font-mono text-[13px] leading-relaxed text-slate-200">{children}</code>
      </pre>
    </div>
  );
}

const Kw  = ({ c }: { c: string }) => <span className="text-pink-400">{c}</span>;
const Str = ({ c }: { c: string }) => <span className="text-green-300">{c}</span>;
const Fn  = ({ c }: { c: string }) => <span className="text-blue-400">{c}</span>;
const Cm  = ({ c }: { c: string }) => <span className="text-white/30">{c}</span>;
const Num = ({ c }: { c: string }) => <span className="text-orange-400">{c}</span>;
const Prop = ({ c }: { c: string }) => <span className="text-purple-400">{c}</span>;
const Op  = ({ c }: { c: string }) => <span className="text-slate-400">{c}</span>;

function IC({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-purple-600 dark:text-purple-400 text-[12px] px-1.5 py-0.5 rounded-md font-mono">
      {children}
    </code>
  );
}

function Callout({ type = 'info', icon, children }: { type?: 'info' | 'tip' | 'warn'; icon: string; children: React.ReactNode }) {
  const s = {
    info: 'bg-blue-50 dark:bg-blue-500/[0.08] border-blue-200 dark:border-blue-500/20 text-blue-800 dark:text-blue-200',
    tip:  'bg-emerald-50 dark:bg-emerald-500/[0.08] border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-200',
    warn: 'bg-amber-50 dark:bg-amber-500/[0.08] border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-200',
  };
  return (
    <div className={`flex gap-3 items-start rounded-xl border p-4 my-4 text-sm ${s[type]}`}>
      <span className="text-base mt-0.5 flex-shrink-0">{icon}</span>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-3 text-xl font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
      <span className="font-mono text-sm font-normal text-emerald-500">#</span>
      {children}
    </h2>
  );
}

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 tracking-widest mb-3 uppercase">
      <span className="w-4 h-px bg-emerald-500" />{label}
    </div>
  );
}

function PropsTable({ cols, rows }: { cols: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="my-4 rounded-xl border border-slate-200 dark:border-white/[0.07] overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/[0.07]">
            {cols.map((c) => <th key={c} className="text-left px-4 py-2.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-white/25">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 dark:border-white/[0.05] last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.01]">
              {row.map((cell, j) => <td key={j} className="px-4 py-2.5 text-slate-600 dark:text-white/50 align-top">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeatureList({ items }: { items: React.ReactNode[] }) {
  return (
    <div className="flex flex-col gap-1.5 my-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-white/50">
          <span className="text-emerald-500 text-xs mt-1 flex-shrink-0">✓</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function Steps({ steps }: { steps: { title: string; content: React.ReactNode }[] }) {
  return (
    <div className="relative pl-8 my-5">
      <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500 to-transparent" />
      {steps.map((step, i) => (
        <div key={i} className="relative mb-6">
          <div className="absolute -left-8 top-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold font-mono text-black">{i + 1}</div>
          <div className="text-sm font-semibold text-slate-800 dark:text-white/90 mb-1.5">{step.title}</div>
          {step.content}
        </div>
      ))}
    </div>
  );
}

function PageNav({ prev, next, onNavigate }: {
  prev?: { id: PageId; label: string };
  next?: { id: PageId; label: string };
  onNavigate: (id: PageId) => void;
}) {
  return (
    <div className="flex justify-between gap-4 mt-14 pt-6 border-t border-slate-200 dark:border-white/[0.07]">
      {prev
        ? <button onClick={() => onNavigate(prev.id)} className="flex flex-col gap-1 px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] rounded-xl hover:border-slate-300 dark:hover:border-white/15 transition-colors text-left max-w-[200px]">
            <span className="text-[11px] font-mono text-slate-400">← prev</span>
            <span className="text-[13px] font-medium text-slate-700 dark:text-white/80">{prev.label}</span>
          </button>
        : <div />}
      {next &&
        <button onClick={() => onNavigate(next.id)} className="flex flex-col gap-1 px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] rounded-xl hover:border-slate-300 dark:hover:border-white/15 transition-colors text-right ml-auto max-w-[200px]">
          <span className="text-[11px] font-mono text-slate-400">next →</span>
          <span className="text-[13px] font-medium text-slate-700 dark:text-white/80">{next.label}</span>
        </button>}
    </div>
  );
}

// ─── Individual doc pages ─────────────────────────────────────────────────────

function OverviewPage({ nav }: { nav: (id: PageId) => void }) {
  return (
    <div>
      <Eyebrow label="Getting Started" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 leading-tight">
        Parse AI responses into <span className="text-emerald-500 italic">beautiful</span> UI
      </h1>
      <p className="text-slate-600 dark:text-white/50 leading-relaxed max-w-xl mb-8 text-[15px]">
        readable.ai converts raw LLM text into structured data and stunning React components. Stop rebuilding the same display layer for every AI feature.
      </p>
      <div className="flex gap-2.5 mb-10 flex-wrap">
        <button onClick={() => nav('quickstart')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
          ⚡ Quickstart — 5 min
        </button>
        <Link href="/playground" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-white/15 text-slate-600 dark:text-white/50 text-sm hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
          Try Playground ↗
        </Link>
      </div>
      <CodeBlock lang="tsx">
        <Kw c="import" />{' { '}<Fn c="Readable" />{' } '}<Kw c="from" />{' '}<Str c="'@readable-ai/react'" />{';'}
        {'\n\n'}<Kw c="export default function" />{' '}<Fn c="AIDashboard" />{'() {\n  '}
        <Kw c="const" />{' response = '}<Kw c="await" />{' '}<Fn c="callYourLLM" />{'();\n  '}
        <Kw c="return" />{' (\n    <'}<Fn c="Readable" />{'\n      '}<Prop c="response" />{'={response}\n      '}
        <Prop c="renderer" />{'='}<Str c='"cards"' />{'\n      '}<Prop c="theme" />{'='}<Str c='"dark"' />{'\n    />\n  );\n}'}
      </CodeBlock>
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent my-10" />
      <H2>What is readable.ai?</H2>
      <p className="text-sm text-slate-600 dark:text-white/50 mb-5 leading-relaxed">
        Every developer building AI-powered products faces the same moment: the LLM call works perfectly, and then you stare at a wall of unformatted text asking: <em className="text-slate-700 dark:text-white/70">&quot;How do I show this to a user?&quot;</em>
      </p>
      <div className="grid grid-cols-2 gap-3 my-5">
        {[
          { icon: '⚙', title: 'Parser Engine', desc: 'Pure TypeScript. Converts raw LLM text into structured metrics, insights, and actions.', page: 'parser' as PageId },
          { icon: '🎨', title: 'Renderer Library', desc: 'React components. Four layouts. Dark and light themes. CSS variable theming.', page: 'renderers' as PageId },
          { icon: '</>', title: 'Embed System', desc: 'Script tag for any webpage. No React, no build step, no complexity.', page: 'embed-guide' as PageId },
          { icon: '⟳', title: 'Streaming Support', desc: 'Progressive rendering as tokens arrive. Works with Vercel AI SDK out of the box.', page: 'streaming' as PageId },
        ].map((c) => (
          <button key={c.title} onClick={() => nav(c.page)} className="text-left bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] rounded-xl p-4 hover:border-slate-300 dark:hover:border-white/15 transition-colors">
            <div className="text-xl mb-2">{c.icon}</div>
            <div className="text-sm font-semibold text-slate-800 dark:text-white/90 mb-1">{c.title}</div>
            <div className="text-xs text-slate-500 dark:text-white/40 leading-relaxed">{c.desc}</div>
          </button>
        ))}
      </div>
      <H2>Key features</H2>
      <FeatureList items={[
        <><strong className="text-slate-800 dark:text-white/80">Zero dependencies</strong> in the core parser — the default fast path works anywhere TypeScript runs</>,
        <><strong className="text-slate-800 dark:text-white/80">Smart mode</strong> is opt-in and uses a server-side Groq proxy when higher accuracy is worth the API cost</>,
        <><strong className="text-slate-800 dark:text-white/80">4 renderers</strong> — Cards, Stats, Chat, Timeline — all themeable via CSS variables</>,
        <><strong className="text-slate-800 dark:text-white/80">Streaming-first</strong> — incremental parse buffer, no full re-parse on each chunk</>,
        <><strong className="text-slate-800 dark:text-white/80">TypeScript native</strong> — fully typed API, no <IC>any</IC> anywhere</>,
      ]} />
      <PageNav next={{ id: 'quickstart', label: 'Quickstart' }} onNavigate={nav} />
    </div>
  );
}

function QuickstartPage({ nav }: { nav: (id: PageId) => void }) {
  return (
    <div>
      <Eyebrow label="Getting Started" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Quickstart</h1>
      <p className="text-slate-600 dark:text-white/50 text-[15px] mb-8">Get from zero to a rendered AI response in under 5 minutes.</p>
      <Steps steps={[
        { title: 'Install the packages', content: <CodeBlock lang="bash"><Op c="npm" />{' install @readable-ai/core @readable-ai/react\n'}<Cm c="# or: pnpm add @readable-ai/core @readable-ai/react" /></CodeBlock> },
        { title: 'Import and use the component', content: <CodeBlock lang="tsx"><Kw c="import" />{' { '}<Fn c="Readable" />{' } '}<Kw c="from" />{' '}<Str c="'@readable-ai/react'" />{';'}{'\n\n'}<Kw c="export default function" />{' '}<Fn c="Page" />{'() {\n  '}<Kw c="return" />{' <'}<Fn c="Readable" />{' '}<Prop c="response" />{'={aiText} '}<Prop c="renderer" />{'='}<Str c='"cards"' />{' />;\n}'}</CodeBlock> },
        { title: 'Pick a theme', content: <CodeBlock lang="tsx">{'<'}<Fn c="Readable" />{' '}<Prop c="response" />{'={text} '}<Prop c="renderer" />{'='}<Str c='"cards"' />{' '}<Prop c="theme" />{'='}<Str c='"dark"' />{' '}<Cm c="// or: light" />{' />'}</CodeBlock> },
        { title: 'Try different renderers', content: <CodeBlock lang="tsx"><Cm c={'// "cards" | "stats" | "chat" | "timeline"'} />{'\n'}{'<'}<Fn c="Readable" />{' '}<Prop c="renderer" />{'='}<Str c='"stats"' />{' '}<Prop c="response" />{'={text} />'}</CodeBlock> },
      ]} />
      <Callout type="tip" icon="💡">
        <strong>Not sure which renderer?</strong> Visit the <Link href="/playground" className="text-emerald-600 dark:text-emerald-400 underline">Playground</Link> to see all four side by side.
      </Callout>
      <PageNav prev={{ id: 'overview', label: 'Overview' }} next={{ id: 'installation', label: 'Installation' }} onNavigate={nav} />
    </div>
  );
}

function InstallationPage({ nav }: { nav: (id: PageId) => void }) {
  return (
    <div>
      <Eyebrow label="Getting Started" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Installation</h1>
      <p className="text-slate-600 dark:text-white/50 text-[15px] mb-8">The core parser and React renderer are separate packages — use only what you need.</p>
      <CodeBlock lang="bash">
        <Cm c="# React developers" />{'\n'}<Op c="npm" />{' install @readable-ai/core @readable-ai/react\n\n'}
        <Cm c="# Core parser only (no React)" />{'\n'}<Op c="npm" />{' install @readable-ai/core\n\n'}
        <Cm c="# pnpm" />{'\n'}<Op c="pnpm" />{' add @readable-ai/core @readable-ai/react'}
      </CodeBlock>
      <H2>Requirements</H2>
      <FeatureList items={['Node.js 18+ (server-side usage)', <><IC>React 18+</IC> (for @readable-ai/react)</>, 'TypeScript 5+ recommended (types included)']} />
      <Callout type="info" icon="ℹ">
        <strong>@readable-ai/core</strong> has zero dependencies — works in Node.js, edge functions, Deno, and browsers.
      </Callout>
      <PageNav prev={{ id: 'quickstart', label: 'Quickstart' }} next={{ id: 'parser', label: 'Parser Engine' }} onNavigate={nav} />
    </div>
  );
}

function ParserPage({ nav }: { nav: (id: PageId) => void }) {
  return (
    <div>
      <Eyebrow label="Core Concepts" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Parser Engine</h1>
      <p className="text-slate-600 dark:text-white/50 text-[15px] mb-8">A pure TypeScript function that converts any LLM output into a typed, structured object.</p>
      <CodeBlock lang="ts">
        <Kw c="import" />{' { '}<Fn c="parseAIResponse" />{' } '}<Kw c="from" />{' '}<Str c="'@readable-ai/core'" />{';'}
        {'\n\n'}<Kw c="const" />{' result = '}<Fn c="parseAIResponse" />{"(`Revenue grew 23% to $1.2M. Churn dropped to 4%.`);"}
        {'\n\n'}<Cm c="// →" />{'\n{\n  '}<Prop c="metrics" />{': [{ '}<Prop c="value" />{': '}<Num c="23" />{', '}<Prop c="unit" />{': '}<Str c="'%'" />{', '}<Prop c="label" />{': '}<Str c="'Revenue growth'" />{', '}<Prop c="confidence" />{': '}<Num c="0.91" />{' }],\n  '}
        <Prop c="actions" />{': [{ '}<Prop c="text" />{': '}<Str c="'Fix onboarding flow'" />{', '}<Prop c="priority" />{': '}<Str c="'high'" />{' }],\n  '}<Prop c="confidence" />{': '}<Num c="0.84" />{'\n}'}
      </CodeBlock>
      <H2>ParsedResponse type</H2>
      <PropsTable cols={['Field', 'Type', 'Description']} rows={[
        [<IC key="m">metrics</IC>, <span key="t" className="text-blue-500 dark:text-blue-300 font-mono text-xs">Metric[]</span>, 'Numbers with units, labels, context'],
        [<IC key="i">insights</IC>, <span key="t" className="text-blue-500 dark:text-blue-300 font-mono text-xs">Insight[]</span>, 'Factual sentences'],
        [<IC key="a">actions</IC>, <span key="t" className="text-blue-500 dark:text-blue-300 font-mono text-xs">Action[]</span>, 'Directive sentences — things to do'],
        [<IC key="r">raw</IC>, <span key="t" className="text-blue-500 dark:text-blue-300 font-mono text-xs">string</span>, 'Original text, unmodified'],
        [<IC key="c">confidence</IC>, <span key="t" className="text-blue-500 dark:text-blue-300 font-mono text-xs">number</span>, 'Overall parse confidence, 0–1'],
      ]} />
      <H2>Hint option</H2>
      <CodeBlock lang="ts">
        <Fn c="parseAIResponse" />{'(text, { '}<Prop c="hint" />{': '}<Str c="'analytics'" />{' });  '}<Cm c="// boosts metric detection" />{'\n'}
        <Fn c="parseAIResponse" />{'(text, { '}<Prop c="hint" />{': '}<Str c="'feedback'" />{' });  '}<Cm c="// boosts insight extraction" />{'\n'}
        <Fn c="parseAIResponse" />{'(text, { '}<Prop c="hint" />{': '}<Str c="'action_plan'" />{' }); '}<Cm c="// boosts action detection" />
      </CodeBlock>
      <Callout type="info" icon="ℹ">The default <IC>fast</IC> parser stays zero-dependency and deterministic. <IC>smart</IC> mode is an explicit backend-powered alternative for higher-accuracy extraction when a server-side Groq key is configured.</Callout>
      <PageNav prev={{ id: 'installation', label: 'Installation' }} next={{ id: 'renderers', label: 'Renderers' }} onNavigate={nav} />
    </div>
  );
}

function RenderersPage({ nav }: { nav: (id: PageId) => void }) {
  const [activeTab, setActiveTab] = useState<RendererTab>('cards');
  return (
    <div>
      <Eyebrow label="Core Concepts" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Renderers</h1>
      <p className="text-slate-600 dark:text-white/50 text-[15px] mb-6">Four layouts for the same structured data. Each is standalone and fully themeable.</p>

      <div className="border border-slate-200 dark:border-white/[0.07] rounded-xl overflow-hidden my-5">
        <div className="flex bg-slate-50 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/[0.07] px-1 gap-0.5">
          {(['cards', 'stats', 'chat', 'timeline'] as RendererTab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-mono rounded-md transition-colors ${activeTab === tab ? 'text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/50">
          {activeTab === 'cards' && (
            <>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[{ l: 'Revenue Growth', v: '+23%' }, { l: 'Revenue', v: '$1.2M' }, { l: 'Churn', v: '4%' }].map((c) => (
                  <div key={c.l} className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] rounded-lg p-3">
                    <div className="text-[10px] font-mono uppercase tracking-wide text-slate-400 mb-1">{c.l}</div>
                    <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{c.v}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {['Fix the onboarding flow', 'Add dark mode to dashboard'].map((a) => (
                  <div key={a} className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/40">
                    <span className="font-mono text-amber-500">→</span>{a}
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {[{ l: 'Revenue Growth', v: '23%', p: 23 }, { l: 'Retention', v: '94%', p: 94 }, { l: 'Churn', v: '4%', p: 4 }].map((s) => (
                <div key={s.l}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5"><span>{s.l}</span><span className="font-mono text-emerald-600 dark:text-emerald-400">{s.v}</span></div>
                  <div className="h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.p}%` }} /></div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'chat' && (
            <div className="space-y-2.5">
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-xs flex-shrink-0">📊</div>
                <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-white/50">
                  Revenue grew <span className="text-emerald-600 dark:text-emerald-400 font-mono">23%</span> to <span className="text-emerald-600 dark:text-emerald-400 font-mono">$1.2M</span>.
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center text-xs flex-shrink-0">→</div>
                <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-white/50">Prioritize the onboarding flow redesign.</div>
              </div>
            </div>
          )}
          {activeTab === 'timeline' && (
            <div className="relative pl-5">
              <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gradient-to-b from-emerald-500 to-transparent" />
              {[
                { type: 'metric', color: 'bg-emerald-500', tc: 'text-emerald-600 dark:text-emerald-400', text: 'Revenue grew 23% to $1.2M.' },
                { type: 'action', color: 'bg-amber-500', tc: 'text-amber-600 dark:text-amber-400', text: 'Fix the onboarding flow.' },
              ].map((item) => (
                <div key={item.type} className="relative mb-4">
                  <div className={`absolute -left-5 top-0.5 w-3 h-3 ${item.color} rounded-full border-2 border-white dark:border-slate-900`} />
                  <div className={`text-[10px] font-mono mb-0.5 ${item.tc}`}>{item.type}</div>
                  <div className="text-sm text-slate-600 dark:text-white/50">{item.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <H2>Props reference</H2>
      <PropsTable cols={['Prop', 'Type', 'Default', 'Description']} rows={[
        [<IC key="r">response</IC>, <span key="t" className="text-blue-500 dark:text-blue-300 font-mono text-xs">string | ReadableStream</span>, <span key="req" className="text-[10px] font-mono bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-1.5 py-0.5 rounded">required</span>, 'Raw LLM output or stream'],
        [<IC key="r2">renderer</IC>, <span key="t" className="font-mono text-xs text-slate-500 dark:text-slate-400">&quot;cards&quot;|&quot;stats&quot;|&quot;chat&quot;|&quot;timeline&quot;</span>, <span key="d" className="font-mono text-xs text-slate-400">&quot;cards&quot;</span>, 'Which layout to use'],
        [<IC key="t">theme</IC>, <span key="t" className="font-mono text-xs text-slate-500 dark:text-slate-400">&quot;dark&quot;|&quot;light&quot;</span>, <span key="d" className="font-mono text-xs text-slate-400">&quot;dark&quot;</span>, 'Color scheme preset'],
        [<IC key="h">hint</IC>, <span key="t" className="font-mono text-xs text-slate-500 dark:text-slate-400">&quot;analytics&quot;|&quot;feedback&quot;|...</span>, <span key="d" className="font-mono text-xs text-slate-400">undefined</span>, 'Biases the parser'],
        [<IC key="tk">tokens</IC>, <span key="t" className="font-mono text-xs text-slate-500 dark:text-slate-400">CSSTokenMap</span>, <span key="d" className="font-mono text-xs text-slate-400">undefined</span>, 'Override CSS variable tokens'],
      ]} />
      <PageNav prev={{ id: 'parser', label: 'Parser Engine' }} next={{ id: 'themes', label: 'Theming' }} onNavigate={nav} />
    </div>
  );
}

function ThemesPage({ nav }: { nav: (id: PageId) => void }) {
  return (
    <div>
      <Eyebrow label="Core Concepts" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Theming</h1>
      <p className="text-slate-600 dark:text-white/50 text-[15px] mb-8">All visual properties are CSS variables. Override any token — no CSS-in-JS, no specificity battles.</p>
      <H2>Built-in themes</H2>
      <CodeBlock lang="tsx">{'<'}<Fn c="Readable" />{' '}<Prop c="response" />{'={text} '}<Prop c="renderer" />{'='}<Str c='"cards"' />{' '}<Prop c="theme" />{'='}<Str c='"light"' />{' />'}</CodeBlock>
      <H2>
        Custom tokens{' '}
        <span className="text-[11px] font-mono bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full ml-1 font-normal">Pro</span>
      </H2>
      <CodeBlock lang="tsx">
        {'<'}<Fn c="Readable" />{' '}<Prop c="tokens" />{'={{\n  '}<Str c="'--readable-accent'" />{': '}<Str c="'#6366f1'" />{',\n  '}
        <Str c="'--readable-bg'" />{': '}<Str c="'#0f0f23'" />{',\n  '}<Str c="'--readable-radius'" />{': '}<Str c="'6px'" />{',\n}} />'}
      </CodeBlock>
      <H2>Token reference</H2>
      <PropsTable cols={['Token', 'Default (dark)', 'Description']} rows={[
        [<IC key="k">--readable-bg</IC>, <span key="v" className="font-mono text-xs text-slate-400">#0f0f0f</span>, 'Component background'],
        [<IC key="k">--readable-accent</IC>, <span key="v" className="font-mono text-xs text-slate-400">#10b981</span>, 'Primary accent color'],
        [<IC key="k">--readable-text</IC>, <span key="v" className="font-mono text-xs text-slate-400">#e8e8e8</span>, 'Primary text color'],
        [<IC key="k">--readable-border</IC>, <span key="v" className="font-mono text-xs text-slate-400">rgba(255,255,255,0.07)</span>, 'Element borders'],
        [<IC key="k">--readable-radius</IC>, <span key="v" className="font-mono text-xs text-slate-400">10px</span>, 'Border radius'],
      ]} />
      <Callout type="info" icon="ℹ">Custom tokens are a <strong>Pro feature</strong>. Free tier is limited to <IC>dark</IC> and <IC>light</IC> presets.</Callout>
      <PageNav prev={{ id: 'renderers', label: 'Renderers' }} next={{ id: 'streaming', label: 'Streaming' }} onNavigate={nav} />
    </div>
  );
}

function StreamingPage({ nav }: { nav: (id: PageId) => void }) {
  return (
    <div>
      <Eyebrow label="Core Concepts" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Streaming</h1>
      <p className="text-slate-600 dark:text-white/50 text-[15px] mb-8">Progressive rendering as tokens arrive. Don&apos;t wait for the full response.</p>
      <H2>With Vercel AI SDK</H2>
      <CodeBlock lang="tsx">
        <Str c="'use client'" />{';'}
        {'\n\n'}<Kw c="import" />{' { '}<Fn c="useChat" />{' } '}<Kw c="from" />{' '}<Str c="'ai/react'" />{';'}
        {'\n'}<Kw c="import" />{' { '}<Fn c="Readable" />{' } '}<Kw c="from" />{' '}<Str c="'@readable-ai/react'" />{';'}
        {'\n\n'}<Kw c="export default function" />{' '}<Fn c="Chat" />{'() {\n  '}
        <Kw c="const" />{' { messages } = '}<Fn c="useChat" />{'();\n  '}
        <Kw c="return" />{'(\n    <div>\n      {messages.map((m) =>\n        m.role === '}<Str c="'assistant'" />{'\n          ? <'}<Fn c="Readable" />{' '}<Prop c="key" />{'={m.id} '}<Prop c="response" />{'={m.content} '}<Prop c="renderer" />{'='}<Str c='"chat"' />{' />\n          : null\n      )}\n    </div>\n  );\n}'}
      </CodeBlock>
      <Callout type="warn" icon="⚠">readable.ai maintains a parse buffer — only new complete sentences are re-parsed on each chunk, keeping re-renders cheap.</Callout>
      <PageNav prev={{ id: 'themes', label: 'Theming' }} next={{ id: 'vercel-ai', label: 'Vercel AI SDK' }} onNavigate={nav} />
    </div>
  );
}

function VercelAIPage({ nav }: { nav: (id: PageId) => void }) {
  return (
    <div>
      <Eyebrow label="Integrations" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Vercel AI SDK</h1>
      <p className="text-slate-600 dark:text-white/50 text-[15px] mb-6">Pass any message content directly to <IC>&lt;Readable /&gt;</IC>. No adapters, no wrappers.</p>
      <Callout type="tip" icon="💡">If you&apos;re using <IC>useChat</IC> or <IC>useCompletion</IC>, passing <IC>m.content</IC> to readable.ai is all you need.</Callout>
      <H2>useCompletion integration</H2>
      <CodeBlock lang="tsx">
        <Kw c="const" />{' { completion, complete } = '}<Fn c="useCompletion" />{'({ '}<Prop c="api" />{': '}<Str c="'/api/analyze'" />{' });\n\n'}
        <Kw c="return" />{'(\n  <div>\n    <button '}<Prop c="onClick" />{'={() => complete('}<Str c="'Analyze Q3'" />{')}>Run</button>\n    {completion && (\n      <'}<Fn c="Readable" />{' '}<Prop c="response" />{'={completion} '}<Prop c="renderer" />{'='}<Str c='"stats"' />{' '}<Prop c="hint" />{'='}<Str c='"analytics"' />{' />\n    )}\n  </div>\n);'}
      </CodeBlock>
      <PageNav prev={{ id: 'streaming', label: 'Streaming' }} next={{ id: 'openai', label: 'OpenAI' }} onNavigate={nav} />
    </div>
  );
}

function EmbedGuidePage({ nav }: { nav: (id: PageId) => void }) {
  return (
    <div>
      <Eyebrow label="Reference" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Embed Guide</h1>
      <p className="text-slate-600 dark:text-white/50 text-[15px] mb-8">Use readable.ai on any webpage via a script tag — no npm, no build step, no React required.</p>
      <CodeBlock lang="html">
        {'<div id='}<Str c='"readable-output"' />{' />\n'}
        {'<script src='}<Str c='"https://cdn.readable.ai/readable.umd.js"' />{' />\n'}
        {'<script>\n  window.Readable.render({\n    '}<Prop c="containerId" />{': '}<Str c="'readable-output'" />{',\n    '}<Prop c="response" />{': '}<Str c="'Revenue grew 23%...'" />{',\n    '}<Prop c="renderer" />{': '}<Str c="'cards'" />{',\n    '}<Prop c="theme" />{': '}<Str c="'dark'" />{',\n  });\n</script>'}
      </CodeBlock>
      <H2>window.Readable API</H2>
      <PropsTable cols={['Method', 'Description']} rows={[
        [<IC key="r">Readable.render(config)</IC>, 'Renders into a container element'],
        [<IC key="d">Readable.destroy(containerId)</IC>, 'Unmounts and cleans up'],
        [<IC key="u">Readable.update(containerId, response)</IC>, 'Updates response without remounting'],
        [<IC key="p">Readable.parse(text)</IC>, 'Runs the parser, returns structured object'],
      ]} />
      <PageNav prev={{ id: 'vercel-ai', label: 'Vercel AI SDK' }} next={{ id: 'changelog', label: 'Changelog' }} onNavigate={nav} />
    </div>
  );
}

function ChangelogPage({ nav }: { nav: (id: PageId) => void }) {
  return (
    <div>
      <Eyebrow label="Reference" />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Changelog</h1>
      <p className="text-slate-600 dark:text-white/50 text-[15px] mb-8">Every release, every change.</p>
      <H2>
        v0.1.0 — Initial Release{' '}
        <span className="text-[11px] font-mono bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full ml-1 font-normal">latest</span>
      </H2>
      <p className="text-xs font-mono text-slate-400 mb-4">March 2026</p>
      <FeatureList items={[
        <><strong className="text-slate-700 dark:text-white/70">@readable-ai/core</strong> — Parser engine with metric detection, intent classification, confidence scoring</>,
        <><strong className="text-slate-700 dark:text-white/70">@readable-ai/react</strong> — CardsRenderer + StatsRenderer, dark/light themes</>,
        <><strong className="text-slate-700 dark:text-white/70">@readable-ai/embed</strong> — UMD bundle with <IC>window.Readable</IC> API</>,
        <><strong className="text-slate-700 dark:text-white/70">Playground</strong> — Live demo at readable-ai.vercel.app/playground</>,
        <><strong className="text-slate-700 dark:text-white/70">Streaming</strong> — Incremental parse buffer, progressive re-renders</>,
      ]} />
      <H2>Coming soon</H2>
      <FeatureList items={[
        <span key="1" className="text-slate-400">ChatRenderer — bubble layout</span>,
        <span key="2" className="text-slate-400">TimelineRenderer — vertical sequential layout</span>,
        <span key="3" className="text-slate-400">Custom token theming (Pro)</span>,
        <span key="4" className="text-slate-400">Stripe billing integration</span>,
      ]} />
      <PageNav prev={{ id: 'embed-guide', label: 'Embed Guide' }} onNavigate={nav} />
    </div>
  );
}

function GenericPage({ title, eyebrow, children, prev, next, nav }: {
  title: string; eyebrow: string; children: React.ReactNode;
  prev?: { id: PageId; label: string }; next?: { id: PageId; label: string };
  nav: (id: PageId) => void;
}) {
  return (
    <div>
      <Eyebrow label={eyebrow} />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">{title}</h1>
      {children}
      <PageNav prev={prev} next={next} onNavigate={nav} />
    </div>
  );
}

// ─── Docs shell (full-screen overlay) ────────────────────────────────────────

function DocsShell({ onClose }: { onClose: () => void }) {
  const [activePage, setActivePage] = useState<PageId>('overview');

  const navigate = (id: PageId) => {
    setActivePage(id);
    document.getElementById('docs-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allLinks = SIDEBAR_SECTIONS.flatMap((s) => s.links);
  const activeLabel = allLinks.find((l) => l.id === activePage)?.label ?? activePage;

  const renderPage = () => {
    switch (activePage) {
      case 'overview':     return <OverviewPage nav={navigate} />;
      case 'quickstart':   return <QuickstartPage nav={navigate} />;
      case 'installation': return <InstallationPage nav={navigate} />;
      case 'parser':       return <ParserPage nav={navigate} />;
      case 'renderers':    return <RenderersPage nav={navigate} />;
      case 'themes':       return <ThemesPage nav={navigate} />;
      case 'streaming':    return <StreamingPage nav={navigate} />;
      case 'vercel-ai':    return <VercelAIPage nav={navigate} />;
      case 'embed-guide':  return <EmbedGuidePage nav={navigate} />;
      case 'changelog':    return <ChangelogPage nav={navigate} />;
      case 'core-api':
        return (
          <GenericPage title="@readable-ai/core" eyebrow="Packages" nav={navigate} next={{ id: 'react-api', label: '@readable-ai/react' }}>
            <p className="text-sm text-slate-600 dark:text-white/50 mb-4">The parser engine. Zero dependencies.</p>
            <CodeBlock lang="ts">
              <Kw c="import" />{' { '}<Fn c="parseAIResponse" />{' } '}<Kw c="from" />{' '}<Str c="'@readable-ai/core'" />{';'}
              {'\n'}<Kw c="const" />{' result = '}<Fn c="parseAIResponse" />{'(text, { '}<Prop c="hint" />{': '}<Str c="'analytics'" />{' });'}
            </CodeBlock>
            <Callout type="tip" icon="💡">See <button onClick={() => navigate('parser')} className="text-emerald-600 dark:text-emerald-400 underline">Parser Engine</button> for full docs.</Callout>
          </GenericPage>
        );
      case 'react-api':
        return (
          <GenericPage title="@readable-ai/react" eyebrow="Packages" nav={navigate} prev={{ id: 'core-api', label: '@readable-ai/core' }} next={{ id: 'embed-api', label: '@readable-ai/embed' }}>
            <p className="text-sm text-slate-600 dark:text-white/50 mb-4">React components and hooks for rendering parsed AI responses.</p>
            <CodeBlock lang="tsx">
              <Kw c="import" />{' { '}<Fn c="Readable" />{', '}<Fn c="useReadable" />{', '}<Fn c="useStreamingReadable" />{' } '}<Kw c="from" />{' '}<Str c="'@readable-ai/react'" />{';'}
            </CodeBlock>
          </GenericPage>
        );
      case 'embed-api':
        return (
          <GenericPage title="@readable-ai/embed" eyebrow="Packages" nav={navigate} prev={{ id: 'react-api', label: '@readable-ai/react' }}>
            <p className="text-sm text-slate-600 dark:text-white/50">UMD bundle for any webpage. See the <button onClick={() => navigate('embed-guide')} className="text-emerald-600 dark:text-emerald-400 underline">Embed Guide</button>.</p>
          </GenericPage>
        );
      case 'openai':
        return (
          <GenericPage title="OpenAI Integration" eyebrow="Integrations" nav={navigate} prev={{ id: 'vercel-ai', label: 'Vercel AI SDK' }} next={{ id: 'anthropic', label: 'Anthropic' }}>
            <CodeBlock lang="ts">
              <Kw c="const" />{' msg = '}<Kw c="await" />{' client.chat.completions.'}<Fn c="create" />{'({ '}<Prop c="model" />{': '}<Str c="'gpt-4o'" />{', '}<Prop c="messages" />{': [...] });\n'}
              <Kw c="const" />{' result = '}<Fn c="parseAIResponse" />{'(msg.choices['}<Num c="0" />{'].message.content);'}
            </CodeBlock>
          </GenericPage>
        );
      case 'anthropic':
        return (
          <GenericPage title="Anthropic Integration" eyebrow="Integrations" nav={navigate} prev={{ id: 'openai', label: 'OpenAI' }}>
            <CodeBlock lang="ts">
              <Kw c="const" />{' msg = '}<Kw c="await" />{' client.messages.'}<Fn c="create" />{'({ '}<Prop c="model" />{': '}<Str c="'claude-sonnet-4-20250514'" />{', '}<Prop c="messages" />{': [...] });\n'}
              <Kw c="const" />{' result = '}<Fn c="parseAIResponse" />{'(msg.content['}<Num c="0" />{'].text);'}
            </CodeBlock>
          </GenericPage>
        );
      case 'playground-guide':
        return (
          <GenericPage title="Playground" eyebrow="Reference" nav={navigate}>
            <p className="text-sm text-slate-600 dark:text-white/50 mb-4">Paste any LLM response and see it rendered across all four layouts in real time. No sign-in required.</p>
            <FeatureList items={['Paste your own AI response text', 'Switch renderers and themes with one click', 'Inspect the parsed JSON output', 'Generate a ready-to-use embed script tag']} />
            <div className="mt-5">
              <Link href="/playground" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
                Open Playground ↗
              </Link>
            </div>
          </GenericPage>
        );
      default: return <OverviewPage nav={navigate} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col">

      {/* Top bar */}
      <div className="flex-shrink-0 h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={onClose} className="font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            readable.ai
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <span>Docs</span>
          <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[10px] font-mono px-1.5 py-0.5 rounded">
            v0.1
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/playground" className="hidden md:block text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Playground</Link>
          <a href="https://github.com/Txnishkk93/readable.ai" target="_blank" rel="noreferrer" className="hidden md:block text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">GitHub ↗</a>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-y-auto py-4">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} className="px-3 mb-5">
              <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400 dark:text-white/20 px-2 mb-1">
                {section.title}
              </div>
              {section.links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all text-[13px] relative ${
                    activePage === link.id
                      ? 'bg-emerald-50 dark:bg-emerald-500/[0.1] text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-800 dark:hover:text-white/70'
                  }`}
                >
                  {activePage === link.id && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 bg-emerald-500 rounded-full" />
                  )}
                  <span className={`text-sm ${activePage === link.id ? 'opacity-100' : 'opacity-50'}`}>{link.icon}</span>
                  {link.label}
                  {link.badge && (
                    <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-sm ${
                      link.badge === 'new'
                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-slate-200 dark:bg-white/[0.06] text-slate-500 dark:text-white/25'
                    }`}>{link.badge}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Content */}
        <div id="docs-scroll" className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 md:px-12 py-10 pb-28">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
              <button onClick={() => navigate('overview')} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Docs</button>
              <ChevronRight className="w-3 h-3" />
              <span>{activeLabel}</span>
            </div>
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [showDocs, setShowDocs] = useState(false);

  return (
    <>
      {showDocs && <DocsShell onClose={() => setShowDocs(false)} />}

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">

        {/* Navigation */}
        <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">readable.ai</div>
            <div className="flex gap-2 items-center">
              <Link href="/playground"><Button variant="ghost">Playground</Button></Link>
              <Link href="/embed"><Button variant="ghost">Embed</Button></Link>
              <Button variant="ghost" onClick={() => setShowDocs(true)}>Docs</Button>
              <a href="https://github.com/Txnishkk93/readable.ai" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">GitHub</Button>
              </a>
            </div>
          </div>
        </nav>

        {/* Hero */}
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
                  Try Playground <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => setShowDocs(true)}>
                Read the Docs
              </Button>
            </div>
          </div>

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

        {/* Features */}
        <section className="bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-50 mb-12">Why readable.ai</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader><Code className="w-8 h-8 text-blue-500 mb-2" /><CardTitle>Zero Dependencies</CardTitle></CardHeader>
                <CardContent><CardDescription>Pure TypeScript parser. Works anywhere. npm, browsers, edge functions — it doesn&apos;t matter.</CardDescription></CardContent>
              </Card>
              <Card>
                <CardHeader><Zap className="w-8 h-8 text-yellow-500 mb-2" /><CardTitle>Fast Mode</CardTitle></CardHeader>
                <CardContent><CardDescription>Pattern-based detection handles metrics, actions, and insights in zero-dependency mode. Smart mode remains opt-in for Groq-backed parsing.</CardDescription></CardContent>
              </Card>
              <Card>
                <CardHeader><Palette className="w-8 h-8 text-pink-500 mb-2" /><CardTitle>4 Renderers</CardTitle></CardHeader>
                <CardContent><CardDescription>Cards, Stats, Chat, Timeline. Dark/light themes. CSS variable theming for custom brands.</CardDescription></CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">The Problem</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Your LLM returns intelligent output. And you stare at a wall of unformatted text asking: &quot;Now how do I show this to a user?&quot;</p>
              <p className="text-slate-600 dark:text-slate-400 mb-4">You build it yourself. Every time. You write regex to find numbers. You map bullet points into JSX. You handle streaming. You repeat this for every new AI feature.</p>
              <p className="text-slate-600 dark:text-slate-400">This is the equivalent of building your own button before you can ship a form. It&apos;s invisible work that produces no competitive advantage.</p>
            </div>
            <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900">
              <CardHeader><CardTitle className="text-red-900 dark:text-red-100">Before</CardTitle></CardHeader>
              <CardContent className="text-red-800 dark:text-red-200 text-sm space-y-2">
                <p>✗ Call GPT-4, get 400 words of plain text</p>
                <p>✗ Spend 3 days building display component</p>
                <p>✗ Component breaks when LLM changes format</p>
                <p>✗ Repeat for next AI feature</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Solution */}
        <section className="bg-blue-50 dark:bg-blue-950">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900 order-2">
                <CardHeader><CardTitle className="text-green-900 dark:text-green-100">After</CardTitle></CardHeader>
                <CardContent className="text-green-800 dark:text-green-200 text-sm space-y-2">
                  <p>✓ Pass response to {'<Readable />'}</p>
                  <p>✓ Pick a renderer</p>
                  <p>✓ Ship in 20 minutes</p>
                  <p>✓ Parser adapts to output drift</p>
                </CardContent>
              </Card>
              <div className="order-1">
                <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-6">The Solution</h2>
                <p className="text-blue-800 dark:text-blue-200 mb-4"><strong>readable.ai</strong> is three things:</p>
                <ul className="space-y-3 text-blue-800 dark:text-blue-200">
                  <li className="flex gap-2"><span className="font-bold">1. Parser Engine</span><span>Pure TS function. Converts raw text into structured data.</span></li>
                  <li className="flex gap-2"><span className="font-bold">2. Renderer Library</span><span>React components. Pick your layout. Customize with CSS variables.</span></li>
                  <li className="flex gap-2"><span className="font-bold">3. Embed System</span><span>Script tag. Works anywhere. No build step required.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">Ready to ship AI features faster?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Try the playground with your own AI responses. Free forever for indie developers. Pro tier coming soon for teams.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/playground"><Button size="lg">Start Building</Button></Link>
            <Button size="lg" variant="outline" onClick={() => setShowDocs(true)}>Read the Docs</Button>
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
    </>
  );
}