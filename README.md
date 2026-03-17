# readable.ai

Parse any LLM response into structured data and beautiful UI in three lines of code.

```typescript
import { Readable } from '@readable-ai/react';

export default () => (
  <Readable response={aiResponse} renderer="cards" theme="dark" />
);
```

## 🏗️ Next.js Monorepo Architecture

This project uses a **Next.js-native monorepo** with **Turbo** for efficient builds and development.

```
readable-ai/
├── apps/
│   └── dashboard/                 # Next.js 16 app - main dashboard & playground
├── packages/
│   ├── core/                      # Parser engine (zero dependencies)
│   ├── react/                     # React component library (ESM/CJS)
│   └── embed/                     # UMD bundle for <script> tag embedding
├── components/                    # Shared UI components (Radix UI based)
├── hooks/                         # Shared React hooks
├── lib/                           # Shared utilities
├── turbo.json                     # Monorepo orchestration config
├── tsconfig.json                  # Shared TypeScript base config
├── next.config.mjs                # Root Next.js configuration
└── pnpm-workspace.yaml            # pnpm workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- **pnpm** >= 9.0 (use `npm install -g pnpm`)
- **Node.js** >= 18

### Installation & Development

```bash
# Install dependencies
pnpm install

# Start all packages in development mode (using Turbo)
pnpm dev

# Start only the dashboard
pnpm dev:dashboard

# Visit http://localhost:3000
```

### Production Build

```bash
# Build all packages with Turbo (optimized)
pnpm build

# Start dashboard in production
cd apps/dashboard
pnpm start
```

## 📦 Workspaces Overview

### `apps/dashboard`
Main Next.js application featuring:
- 🎮 Interactive playground for testing the parser
- 📖 Component documentation 
- 🧪 Integration examples
- 📊 Real-time response rendering demos

**Commands:**
```bash
pnpm dev:dashboard          # Dev mode
pnpm build                  # Build (via Turbo)
pnpm lint                   # ESLint & Next.js lint
```

### `packages/core`
Zero-dependency TypeScript parser engine.

**Exports:**
- `parseAIResponse()` - Parse text into structured data
- `tokenize()` - Create tokens from text
- `classifyIntent()` - Identify intent categories
- `scoreConfidence()` - Get confidence metrics

**Commands:**
```bash
pnpm build       # Build to ESM/CJS with tsup
pnpm dev         # Watch mode
pnpm type-check  # Type checking
```

### `packages/react`
React component library with multiple renderers.

**Exports:**
- `<Readable />` - Main component with auto-detection
- `<CardsRenderer />` - Grid-based metrics renderer
- `<StatsRenderer />` - Analytics-focused renderer
- `<ChatRenderer />` - Conversation bubbles (coming soon)
- `<TimelineRenderer />` - Sequential timeline (coming soon)

**Theming:**
- Built-in dark/light themes
- CSS variable customization
- Theme provider included

**Commands:**
```bash
pnpm build       # Build to ESM/CJS with tsup
pnpm dev         # Watch mode
pnpm type-check  # Type checking
```

### `packages/embed`  
UMD bundle for embedding in non-React websites.

**Usage:**
```html
<script src="https://cdn.example.com/readable.umd.js"></script>
<script>
  window.Readable.render({
    container: '#target',
    response: 'AI response text...',
    theme: 'dark'
  });
</script>
```

**Commands:**
```bash
pnpm build       # Build UMD bundle with esbuild
pnpm dev         # Watch mode
pnpm type-check  # Type checking
```

## 🎯 Shared Resources

### `components/`
Radix UI-based component library available to all apps:
- 60+ pre-built components
- Full dark mode support
- Responsive & accessible
- Available at path `@/components/ui/*`

### `hooks/`
Reusable React hooks:
- `useToast` - Notifications
- `useMobile` - Responsive detection

### `lib/`
Utility functions:
- `cn()` - Class merging (clsx + tailwind-merge)
- Other shared utilities

## 🔧 Monorepo Commands

### Development
```bash
pnpm dev                    # All packages in watch mode
pnpm dev:dashboard          # Dashboard only
```

### Building
```bash
pnpm build                  # All packages (Turbo-optimized)
turbo build --filter=@readable-ai/react  # Specific package
```

### Code Quality
```bash
pnpm lint                   # ESLint on all packages
pnpm type-check             # TypeScript checking all packages
pnpm test                   # Run tests (when configured)
```

### Turbo Features
- **Caching**: Automatic caching of builds
- **Parallelization**: Builds run in parallel
- **Dependency tracking**: Only rebuilds affected packages
- **Remote caching**: (Optional) Vercel cache integration

## 📝 Using the npm Packages

Install and use in your own projects:

```bash
npm install @readable-ai/react @readable-ai/core
# or
pnpm add @readable-ai/react @readable-ai/core
```

**Example:**
```tsx
import { Readable } from '@readable-ai/react';
import { parseAIResponse } from '@readable-ai/core';

// Component rendering
<Readable 
  response="Your AI text..." 
  renderer="cards" 
  theme="dark" 
/>

// Manual parsing
const data = parseAIResponse(aiText);
console.log(data.metrics, data.actions, data.insights);
```

## 🎨 Renderers

- **cards**: Grid-based layout with metrics, insights, and actions
- **stats**: Horizontal analytics-focused layout
- **chat**: Bubble-based conversational (coming soon)
- **timeline**: Chronological/sequential data (coming soon)

## 📋 Features

### Parser Engine (`core`)
- 📊 **Metrics Detection**: 23%, 1200 users, $45K, etc.
- 🎯 **Intent Classification**: Actions, insights, questions
- 🎲 **Confidence Scoring**: 80%+ accuracy with graceful fallback
- 🔄 **Streaming Support**: Incremental parsing for real-time UI

### React Library (`react`)
- 🌓 **Dark/Light Themes**: Out of the box
- 🎨 **CSS Variable Theming**: Custom brand colors
- 📱 **Responsive Design**: Mobile-first markup
- ♿ **Accessibility**: WCAG-compliant components

### Configuration Files
- **tsconfig.json**: Shared TypeScript base configuration
- **next.config.mjs**: Next.js settings with transpile config
- **turbo.json**: Build orchestration and caching
- **.eslintrc.json**: ESLint + TypeScript rules
- **postcss.config.mjs**: Tailwind CSS setup
- **tailwind.config.ts**: Shared Tailwind theming

## 🧪 Development Workflow

### File Structure
```
readable-ai/
├── apps/dashboard/                # Next.js app with file-based routing
│   ├── app/                       # App Router (next/app)
│   ├── page.tsx                   # Home page
│   ├── layout.tsx                 # Root layout with metadata
│   ├── playground/                # AI response playground
│   └── embed/                     # Embed documentation
├── components/                    # Shared dark-mode aware components
├── packages/*/src/                # Source files
└── packages/*/dist/               # Built distributions
```

### Type Safety
- Full TypeScript across all packages
- Shared base `tsconfig.json`
- Path aliases for imports (`@/components`, `@readable-ai/*`)

### Monorepo Tips
1. **Root changes**: Update `turbo.json` for task config changes
2. **New app**: Create in `apps/` folder with `next.config.mjs`
3. **New library**: Create in `packages/`, add to `turbo.json` tasks
4. **Workspace**: Use workspace protocols (`workspace:*`) for internal deps
5. **Caching**: Turbo caches `.next`, `dist`, `build` outputs

## 🔗 Related Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Turbo Docs](https://turbo.build/repo)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript](https://www.typescriptlang.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

MIT - See LICENSE file


pnpm format
```

## Packages

### @readable-ai/core
The parser engine. Zero UI dependencies, works anywhere.

```typescript
import { parseAIResponse } from '@readable-ai/core';

const result = parseAIResponse('Your text here');
// → { metrics: [...], insights: [...], actions: [...], confidence: 0.82 }
```

### @readable-ai/react
React components for rendering parsed responses.

```typescript
import { Readable, useReadable } from '@readable-ai/react';

// Component-based usage
<Readable response={text} renderer="cards" theme="dark" />

// Hook-based usage
const { result, error } = useReadable(text, { hint: 'analytics' });
```

### @readable-ai/embed
UMD bundle for any website.

```html
<div id="readable-output"></div>
<script src="https://cdn.readable.ai/readable.umd.js"></script>
<script>
  window.Readable.render({
    containerId: 'readable-output',
    response: 'Your AI text...',
    renderer: 'cards',
    theme: 'dark'
  });
</script>
```

## Roadmap

- [x] Core parser engine with metric detection
- [x] CardsRenderer and StatsRenderer
- [x] React hooks and components
- [x] UMD embed bundle
- [ ] ChatRenderer and TimelineRenderer
- [ ] ML-powered classifier improvements
- [ ] Custom renderer SDK
- [ ] White-label theming
- [ ] Usage analytics dashboard
- [ ] Stripe billing integration

## Contributing

This is a private monorepo built for launch. Contributing guidelines coming after public release.

## License

MIT
