'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Play, RotateCcw, Copy, Check, FileCode, Eye, Terminal, Sparkles, X } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────

type SupportedLang = 'html' | 'css' | 'js' | 'jsx' | 'tsx' | 'ts';

interface UploadedFile {
  name: string;
  lang: SupportedLang;
  content: string;
}

interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  ts: number;
}

interface AIAnalysis {
  metrics: { label: string; value: string }[];
  insights: string[];
  actions: string[];
}

// ─── Helpers ──────────────────────────────────────────────────

const LANG_MAP: Record<string, SupportedLang> = {
  html: 'html', css: 'css', js: 'js',
  jsx: 'jsx', tsx: 'tsx', ts: 'ts',
};

const LANG_COLORS: Record<SupportedLang, string> = {
  html: 'text-orange-500', css: 'text-blue-500',
  js: 'text-yellow-500', jsx: 'text-cyan-500',
  tsx: 'text-purple-500', ts: 'text-blue-400',
};

const LANG_BG: Record<SupportedLang, string> = {
  html: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-900',
  css: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900',
  js: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900',
  jsx: 'bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-900',
  tsx: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-900',
  ts: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900',
};

function detectLang(filename: string): SupportedLang {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return LANG_MAP[ext] ?? 'js';
}

// ─── Build iframe srcdoc from uploaded files ─────────────────

function buildSrcdoc(files: UploadedFile[]): string {
  const htmlFile = files.find(f => f.lang === 'html');
  const cssFiles = files.filter(f => f.lang === 'css');
  const jsFiles = files.filter(f => ['js'].includes(f.lang));
  const reactFiles = files.filter(f => ['jsx', 'tsx'].includes(f.lang));

  const hasReact = reactFiles.length > 0;

  const cssBlock = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');

  // Console capture script
  const consoleCapture = `
<script>
  (function() {
    const orig = { log: console.log, error: console.error, warn: console.warn, info: console.info };
    ['log','error','warn','info'].forEach(type => {
      console[type] = function(...args) {
        orig[type](...args);
        window.parent.postMessage({ type: 'console', level: type, message: args.map(a => {
          try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); } catch(e) { return String(a); }
        }).join(' ') }, '*');
      };
    });
    window.onerror = (msg, src, line, col, err) => {
      window.parent.postMessage({ type: 'console', level: 'error', message: \`\${msg} (line \${line})\` }, '*');
    };
  })();
</script>`;

  if (hasReact) {
    // Babel + React transform
    const combinedJSX = reactFiles.map(f => f.content).join('\n\n');
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
${cssBlock}
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>body{margin:0;padding:16px;font-family:system-ui,sans-serif;}</style>
</head>
<body>
${consoleCapture}
<div id="root"></div>
<script type="text/babel">
${combinedJSX}

// Auto-mount: find a default export or any component
try {
  const allExports = Object.keys(window).filter(k => typeof window[k] === 'function' && /^[A-Z]/.test(k));
  const root = ReactDOM.createRoot(document.getElementById('root'));
  if (typeof App !== 'undefined') root.render(React.createElement(App));
  else if (typeof Default !== 'undefined') root.render(React.createElement(Default));
  else root.render(React.createElement('div', { style: { color: '#888', fontSize: 14 } }, 'No default export found. Export a component named "App".'));
} catch(e) {
  document.getElementById('root').innerHTML = '<pre style="color:red;font-size:12px;">' + e.message + '</pre>';
}
</script>
</body>
</html>`;
  }

  if (htmlFile) {
    // Inject CSS + JS into the HTML file
    let base = htmlFile.content;
    const cssInject = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
    const jsInject = jsFiles.map(f => `<script>${f.content}<\/script>`).join('\n');
    // Inject before </body> or at end
    if (base.includes('</body>')) {
      base = base.replace('</body>', `${cssInject}\n${jsInject}\n${consoleCapture}\n</body>`);
    } else {
      base = base + cssInject + jsInject + consoleCapture;
    }
    return base;
  }

  // Pure JS/CSS files — wrap in a minimal shell
  const jsBlock = jsFiles.map(f => `<script>${f.content}<\/script>`).join('\n');
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><style>body{margin:0;padding:16px;font-family:system-ui,sans-serif;}${cssFiles.map(f => f.content).join('\n')}</style></head>
<body>
${consoleCapture}
${jsBlock}
</body>
</html>`;
}

// ─── Simple AI analysis (pattern-based, no LLM call) ─────────

function analyzeCode(files: UploadedFile[]): AIAnalysis {
  const allCode = files.map(f => f.content).join('\n');
  const lines = allCode.split('\n').length;
  const chars = allCode.length;
  const components = (allCode.match(/function\s+[A-Z][a-zA-Z]+|const\s+[A-Z][a-zA-Z]+\s*=/g) || []).length;
  const hooks = (allCode.match(/use[A-Z][a-zA-Z]+/g) || []).length;
  const imports = (allCode.match(/^import\s/gm) || []).length;
  const todos = (allCode.match(/\/\/\s*TODO/gi) || []).length;
  const consoles = (allCode.match(/console\.(log|warn|error)/g) || []).length;
  const hasTypeScript = files.some(f => ['ts', 'tsx'].includes(f.lang));
  const hasCSS = files.some(f => f.lang === 'css');

  const metrics = [
    { label: 'Lines of code', value: String(lines) },
    { label: 'Files', value: String(files.length) },
    { label: 'Components', value: String(components) },
    { label: 'React hooks', value: String(hooks) },
    { label: 'Imports', value: String(imports) },
    { label: 'Characters', value: chars.toLocaleString() },
  ];

  const insights: string[] = [];
  if (hasTypeScript) insights.push('TypeScript detected — type safety is enabled.');
  if (hasCSS) insights.push('Separate CSS file found — styles are cleanly separated from logic.');
  if (hooks > 0) insights.push(`${hooks} React hook usage(s) detected — component has state or side effects.`);
  if (components > 1) insights.push(`${components} components found — consider splitting into separate files if growing.`);
  if (imports > 8) insights.push(`${imports} imports — dependency count is getting high.`);

  const actions: string[] = [];
  if (todos > 0) actions.push(`${todos} TODO comment(s) found — resolve before shipping.`);
  if (consoles > 0) actions.push(`${consoles} console.log(s) found — remove before production.`);
  if (!hasTypeScript && files.some(f => ['jsx', 'js'].includes(f.lang))) {
    actions.push('Consider migrating to TypeScript for better developer experience.');
  }
  if (allCode.includes('any')) actions.push('TypeScript "any" usage detected — replace with specific types.');
  if (lines > 200) actions.push('File is over 200 lines — consider splitting into smaller modules.');

  return { metrics, insights, actions };
}

// ─── Syntax highlighter (very lightweight) ───────────────────

function highlight(code: string, lang: SupportedLang): string {
  const esc = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return esc
    // strings
    .replace(/(["'`])(.*?)\1/g, '<span style="color:#a3e635">$1$2$1</span>')
    // comments
    .replace(/(\/\/.*)/g, '<span style="color:#6b7280;font-style:italic">$1</span>')
    // keywords
    .replace(/\b(import|export|default|from|const|let|var|function|return|if|else|for|while|class|extends|new|typeof|async|await|try|catch|throw|interface|type|enum)\b/g,
      '<span style="color:#818cf8">$1</span>')
    // React/JSX tags
    .replace(/(&lt;\/?[A-Z][a-zA-Z]*)/g, '<span style="color:#f472b6">$1</span>')
    .replace(/(&lt;\/?[a-z][a-z0-9-]*)/g, '<span style="color:#67e8f9">$1</span>')
    // numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#fb923c">$1</span>')
    // props/attributes
    .replace(/\b([a-zA-Z]+)=/g, '<span style="color:#fbbf24">$1</span>=');
}

// ─── Main Component ───────────────────────────────────────────

export default function SandboxPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [activeFile, setActiveFile] = useState<UploadedFile | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'analysis'>('preview');
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [srcdoc, setSrcdoc] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for console messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'console') {
        setLogs(prev => [...prev, {
          type: e.data.level as ConsoleLog['type'],
          message: e.data.message,
          ts: Date.now(),
        }]);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const readFile = (file: File): Promise<UploadedFile> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve({
        name: file.name,
        lang: detectLang(file.name),
        content: e.target?.result as string,
      });
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const addFiles = useCallback(async (incoming: File[]) => {
    const supported = incoming.filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
      return ext in LANG_MAP;
    });
    const parsed = await Promise.all(supported.map(readFile));
    setFiles(prev => {
      const names = new Set(prev.map(f => f.name));
      const merged = [...prev, ...parsed.filter(f => !names.has(f.name))];
      return merged;
    });
    if (parsed.length > 0) setActiveFile(parsed[0]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const handleRun = () => {
    if (files.length === 0) return;
    setLogs([]);
    setSrcdoc(buildSrcdoc(files));
    setAnalysis(analyzeCode(files));
    setHasRun(true);
    setActiveTab('preview');
  };

  const handleReset = () => {
    setFiles([]);
    setActiveFile(null);
    setSrcdoc('');
    setLogs([]);
    setAnalysis(null);
    setHasRun(false);
  };

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const removeFile = (name: string) => {
    setFiles(prev => {
      const next = prev.filter(f => f.name !== name);
      if (activeFile?.name === name) setActiveFile(next[0] ?? null);
      return next;
    });
  };

  const LOG_COLORS: Record<ConsoleLog['type'], string> = {
    log: 'text-slate-300',
    info: 'text-blue-400',
    warn: 'text-yellow-400',
    error: 'text-red-400',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* Nav */}
      <nav className="h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center px-6">
        <div className="max-w-full w-full flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-slate-900 dark:text-slate-50 tracking-tight">
            readable.ai
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Sandbox</span>
            {files.length > 0 && (
              <>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="text-xs h-7 px-2 text-slate-500 gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleRun}
                  className="text-xs h-7 px-3 gap-1.5"
                >
                  <Play className="w-3 h-3" /> Run
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-48px)]">

        {/* ── Left: File panel ── */}
        <div className="w-56 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={`w-full border border-dashed rounded-lg p-3 text-center transition-colors cursor-pointer
                ${isDragging
                  ? 'border-slate-400 bg-slate-50 dark:bg-slate-800'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
              <Upload className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Drop files or click</p>
              <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">html css js jsx tsx ts</p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".html,.css,.js,.jsx,.tsx,.ts"
              className="hidden"
              onChange={e => addFiles(Array.from(e.target.files ?? []))}
            />
          </div>

          {/* File list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {files.length === 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-600 text-center mt-4 px-2">
                No files yet. Upload to get started.
              </p>
            )}
            {files.map(f => (
              <div
                key={f.name}
                onClick={() => setActiveFile(f)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer group transition-colors
                  ${activeFile?.name === f.name
                    ? 'bg-slate-100 dark:bg-slate-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
              >
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${LANG_COLORS[f.lang]}`} />
                <span className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1">{f.name}</span>
                <button
                  onClick={e => { e.stopPropagation(); removeFile(f.name); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
            ))}
          </div>

          {/* Lang legend */}
          {files.length > 0 && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
              {Array.from(new Set(files.map(f => f.lang))).map(lang => (
                <div key={lang} className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-medium ${LANG_COLORS[lang]}`}>.{lang}</span>
                  <span className="text-xs text-slate-400">{files.filter(f => f.lang === lang).length} file(s)</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Center: Code editor ── */}
        <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800 min-w-0">
          {activeFile ? (
            <>
              {/* Editor header */}
              <div className="h-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-medium ${LANG_COLORS[activeFile.lang]}`}>
                    .{activeFile.lang}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{activeFile.name}</span>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Code with syntax highlight */}
              <div className="flex-1 overflow-auto bg-slate-950">
                <div className="flex">
                  {/* Line numbers */}
                  <div className="select-none shrink-0 text-right pr-4 pl-4 pt-4 pb-4 font-mono text-xs text-slate-600 leading-6 border-r border-slate-800">
                    {activeFile.content.split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  {/* Code */}
                  <pre
                    className="flex-1 p-4 font-mono text-xs leading-6 text-slate-300 overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: highlight(activeFile.content, activeFile.lang) }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-950">
              <div className="text-center">
                <FileCode className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-600">Upload a file to view its code</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Output panel ── */}
        <div className="w-[420px] shrink-0 flex flex-col bg-white dark:bg-slate-900">
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as typeof activeTab)} className="flex flex-col h-full">

            {/* Tab bar */}
            <div className="h-10 border-b border-slate-200 dark:border-slate-800 px-3 flex items-center shrink-0">
              <TabsList className="h-7 gap-0.5 bg-transparent p-0">
                <TabsTrigger value="preview" className="text-xs h-6 px-3 gap-1.5 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
                  <Eye className="w-3 h-3" /> Preview
                </TabsTrigger>
                <TabsTrigger value="console" className="text-xs h-6 px-3 gap-1.5 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
                  <Terminal className="w-3 h-3" /> Console
                  {logs.length > 0 && (
                    <span className={`ml-1 text-xs rounded-full px-1.5 py-0 ${logs.some(l => l.type === 'error') ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {logs.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="analysis" className="text-xs h-6 px-3 gap-1.5 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
                  <Sparkles className="w-3 h-3" /> Analysis
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Preview */}
            <TabsContent value="preview" className="flex-1 mt-0 overflow-hidden">
              {hasRun ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={srcdoc}
                  sandbox="allow-scripts allow-modals"
                  className="w-full h-full border-0 bg-white"
                  title="Sandbox Preview"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
                  <Eye className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {files.length === 0
                      ? 'Upload files and press Run to preview'
                      : `${files.length} file(s) ready — press Run`}
                  </p>
                  {files.length > 0 && (
                    <Button size="sm" onClick={handleRun} className="text-xs h-7 px-4 gap-1.5 mt-1">
                      <Play className="w-3 h-3" /> Run now
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Console */}
            <TabsContent value="console" className="flex-1 mt-0 overflow-hidden">
              <div className="h-full bg-slate-950 overflow-y-auto p-3 font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-slate-600 mt-2">
                    {hasRun ? '// No console output' : '// Run your code to see console output'}
                  </p>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className={`flex gap-2 py-0.5 border-b border-slate-900 ${LOG_COLORS[log.type]}`}>
                      <span className="text-slate-600 shrink-0">{new Date(log.ts).toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      <span className="text-slate-600 shrink-0 uppercase w-8">{log.type === 'log' ? '▶' : log.type === 'error' ? '✕' : log.type === 'warn' ? '⚠' : 'ℹ'}</span>
                      <pre className="whitespace-pre-wrap break-all">{log.message}</pre>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Analysis */}
            <TabsContent value="analysis" className="flex-1 mt-0 overflow-y-auto">
              {analysis ? (
                <div className="p-4 space-y-4">

                  {/* Metrics grid */}
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Metrics</p>
                    <div className="grid grid-cols-2 gap-2">
                      {analysis.metrics.map(m => (
                        <div key={m.label} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{m.label}</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insights */}
                  {analysis.insights.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Insights</p>
                      <div className="space-y-2">
                        {analysis.insights.map((s, i) => (
                          <div key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg p-2.5">
                            <span className="text-blue-400 shrink-0">●</span> {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {analysis.actions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Actions</p>
                      <div className="space-y-2">
                        {analysis.actions.map((a, i) => (
                          <div key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 rounded-lg p-2.5">
                            <span className="text-amber-400 shrink-0">▲</span> {a}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File breakdown */}
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Files</p>
                    <div className="space-y-1.5">
                      {files.map(f => (
                        <div key={f.name} className={`flex items-center justify-between text-xs rounded-lg px-3 py-2 border ${LANG_BG[f.lang]}`}>
                          <span className="font-mono text-slate-700 dark:text-slate-300">{f.name}</span>
                          <span className="text-slate-500">{f.content.split('\n').length} lines</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-6">
                  <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Run your code to see AI analysis
                  </p>
                </div>
              )}
            </TabsContent>

          </Tabs>
        </div>

      </div>
    </div>
  );
}