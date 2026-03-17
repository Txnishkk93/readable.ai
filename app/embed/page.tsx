'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';

type RendererType = 'cards' | 'stats' | 'chat' | 'timeline';
type ThemeType = 'dark' | 'light';

interface EmbedConfig {
  containerId: string;
  response: string;
  renderer: RendererType;
  theme: ThemeType;
}

export default function EmbedPage() {
  const [config, setConfig] = useState<EmbedConfig>({
    containerId: 'readable-output',
    response: 'Conversion rate increased 23%. Traffic up 1200 users. Should implement caching.',
    renderer: 'cards',
    theme: 'dark',
  });
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const embedScript = `<div id="${config.containerId}"></div>
<script src="https://cdn.readable.ai/readable.umd.js"><\/script>
<script>
  window.Readable.render({
    containerId: '${config.containerId}',
    response: ${JSON.stringify(config.response)},
    renderer: '${config.renderer}',
    theme: '${config.theme}'
  });
<\/script>`;

  const htmlExample = `<!DOCTYPE html>
<html>
<head>
  <title>Readable.ai Embed Example</title>
</head>
<body>
  <h1>AI Response Parser</h1>
  
  ${embedScript}
  
</body>
</html>`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const subscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would be connected to a backend API
    console.log('Newsletter signup:', email);
    alert('Thanks for your interest! We\'ll notify you when readable.ai Pro launches.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Embed Configurator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Generate a script tag to embed readable.ai on any webpage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Configure</CardTitle>
              <CardDescription>Customize your embed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Container ID</label>
                <Input
                  value={config.containerId}
                  onChange={(e) => setConfig({ ...config, containerId: e.target.value })}
                  placeholder="readable-output"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Renderer</label>
                <Select value={config.renderer} onValueChange={(v) => setConfig({ ...config, renderer: v as RendererType })}>
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
                <label className="text-sm font-medium block mb-2">Theme</label>
                <Select value={config.theme} onValueChange={(v) => setConfig({ ...config, theme: v as ThemeType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Sample Response</label>
                <Textarea
                  value={config.response}
                  onChange={(e) => setConfig({ ...config, response: e.target.value })}
                  placeholder="Paste your AI response..."
                  className="min-h-32"
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Get notified when Pro launches with custom theming and advanced features.
                </p>
                <form onSubmit={subscribeNewsletter} className="space-y-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                  <Button type="submit" className="w-full" variant="secondary">
                    Notify Me
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Code Snippets */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Installation Code</CardTitle>
              <CardDescription>Copy and paste into your HTML</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="script" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="script">Script Tag</TabsTrigger>
                  <TabsTrigger value="html">Full HTML</TabsTrigger>
                  <TabsTrigger value="react">React</TabsTrigger>
                </TabsList>

                <TabsContent value="script" className="mt-4">
                  <div className="space-y-2">
                    <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-xs leading-loose">
                      {embedScript}
                    </pre>
                    <Button
                      onClick={() => copyToClipboard(embedScript, 'script')}
                      className="w-full"
                    >
                      {copied === 'script' ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Script
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="html" className="mt-4">
                  <div className="space-y-2">
                    <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-xs leading-loose">
                      {htmlExample}
                    </pre>
                    <Button
                      onClick={() => copyToClipboard(htmlExample, 'html')}
                      className="w-full"
                    >
                      {copied === 'html' ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy HTML
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="react" className="mt-4">
                  <div className="space-y-2">
                    <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-xs leading-loose">
{`import { Readable } from '@readable-ai/react';

export default function MyComponent() {
  return (
    <Readable
      response="${config.response}"
      renderer="${config.renderer}"
      theme="${config.theme}"
    />
  );
}`}
                    </pre>
                    <Button
                      onClick={() => copyToClipboard(`import { Readable } from '@readable-ai/react';\n\nexport default function MyComponent() {\n  return (\n    <Readable\n      response="${config.response}"\n      renderer="${config.renderer}"\n      theme="${config.theme}"\n    />\n  );\n}`, 'react')}
                      className="w-full"
                    >
                      {copied === 'react' ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy React Code
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Zero Setup</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Copy a script tag. No build step, no dependencies, works on any website.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">4 Renderers</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Cards, Stats, Chat, and Timeline. Pick the layout that fits your content.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Fully Themed</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Dark and light themes. Pro tier adds custom CSS variable theming.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
