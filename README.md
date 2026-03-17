# readable.ai

Parse any LLM response into structured data and beautiful UI in three lines of code.

```typescript
import { Readable } from '@readable-ai/react';

export default () => (
  <Readable response={aiResponse} renderer="cards" theme="dark" />
);
```

## Monorepo Structure

```
readable-ai/
├── packages/
│   ├── core/          # Parser engine (zero dependencies)
│   ├── react/         # React component library  
│   └── embed/         # UMD bundle for script tag usage
├── apps/
│   └── dashboard/     # Next.js playground & docs
└── README.md
```

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start dev mode for all packages
pnpm dev

# Watch dashboard at http://localhost:3000
# Try the playground at http://localhost:3000/playground
```

### Using the npm Package

```bash
npm install @readable-ai/react @readable-ai/core
```

```typescript
import { Readable } from '@readable-ai/react';
import { parseAIResponse } from '@readable-ai/core';

// Option 1: Use the component (handles parsing internally)
<Readable response="Your AI text here..." renderer="cards" />

// Option 2: Parse and use custom rendering
const parsed = parseAIResponse(text);
console.log(parsed.metrics, parsed.actions, parsed.insights);
```

## Renderers

- **cards**: Grid-based layout with metrics as cards, insights and actions as lists
- **stats**: Horizontal bar chart style, good for analytics-heavy content
- **chat**: Bubble-based layout for conversational responses (coming soon)
- **timeline**: Vertical timeline for sequential/chronological data (coming soon)

## Features

- **Parser Engine**: Pure TypeScript, no dependencies
  - Detects metrics (23%, 1200 users, $45K, etc.)
  - Classifies intent (actions, insights, questions)
  - Confidence scoring (80% accuracy + graceful fallback)
  - Streaming support with incremental parsing

- **React Components**: Beautiful, theme-aware renderers
  - Dark/light themes out of the box
  - CSS variable-based theming for custom brands
  - Responsive, accessible markup

- **UMD Embed**: Use via script tag on any webpage
  - No build step required
  - Global `window.Readable.render()` API

## Development

### Build all packages

```bash
pnpm build
```

### Run tests

```bash
pnpm test
```

### Lint & format

```bash
pnpm lint
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
