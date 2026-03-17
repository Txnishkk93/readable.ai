# readable.ai Quick Start

Get readable.ai running locally in 2 minutes.

## Prerequisites

- Node.js 18+
- pnpm (install: `npm install -g pnpm`)

## Installation

```bash
# Clone the repo
git clone https://github.com/your-org/readable-ai.git
cd readable-ai

# Install dependencies
pnpm install
```

## Development

```bash
# Start development mode for all packages
pnpm dev

# The dashboard will be available at:
# http://localhost:3000

# Try the playground:
# http://localhost:3000/playground

# Try the embed configurator:
# http://localhost:3000/embed
```

## Project Structure

```
readable-ai/
├── packages/
│   ├── core/           # Parser engine (types, parser, tokenizer, etc)
│   ├── react/          # React components (renderers, hooks)
│   └── embed/          # UMD bundle for script tag
├── apps/
│   └── dashboard/      # Next.js playground & docs
├── README.md           # Full documentation
└── LAUNCH.md          # Pre-launch checklist
```

## Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter @readable-ai/core
```

## Testing

```bash
# Run tests
pnpm test

# Test specific package
pnpm test --filter @readable-ai/core
```

## Using the Packages

### In a React App

```bash
npm install @readable-ai/react @readable-ai/core
```

```typescript
import { Readable } from '@readable-ai/react';

export default function App() {
  return (
    <Readable 
      response="Conversion rate up 23%. Performance improved 1.8s. Should implement caching."
      renderer="cards"
      theme="dark"
    />
  );
}
```

### Direct Parser Usage

```typescript
import { parseAIResponse } from '@readable-ai/core';

const result = parseAIResponse('Your AI response text');
console.log(result.metrics, result.actions, result.insights);
```

### Streaming

```typescript
import { useStreamingReadable } from '@readable-ai/react';

const { parsed, addChunk, finalize } = useStreamingReadable();

// Add chunks as they arrive from your stream
stream.on('data', (chunk) => {
  addChunk(chunk.toString());
});

// When done
stream.on('end', () => {
  finalize();
});

return <Readable response={parsed} renderer="cards" />;
```

### UMD Embed

```html
<div id="readable-output"></div>
<script src="https://cdn.readable.ai/readable.umd.js"></script>
<script>
  window.Readable.render({
    containerId: 'readable-output',
    response: 'Your AI response here',
    renderer: 'cards',
    theme: 'dark'
  });
</script>
```

## Renderers

- **cards** - Grid layout for metrics, lists for insights/actions
- **stats** - Horizontal bars for analytics, compact insights
- **chat** - Bubble-based layout for conversational responses
- **timeline** - Vertical timeline for sequential/analytical data

## Themes

- **dark** - Default dark mode (blue accent)
- **light** - Light mode (professional blue accent)

Custom themes via CSS variables (Pro tier feature).

## Next Steps

1. **Try the Playground**: http://localhost:3000/playground
   - Paste your own AI responses
   - Switch between renderers
   - See parsed JSON output

2. **Embed on a Website**: Use `/embed` page to configure
   - Generate custom embed code
   - Copy script tag to any HTML page
   - No build step required

3. **Build with React**: Install packages and integrate
   - Use `<Readable>` component
   - Use `useReadable` hook for custom rendering
   - Use `useStreamingReadable` for real-time updates

4. **Read Full Docs**: See [README.md](./README.md)
   - Architecture details
   - API reference
   - Advanced usage

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
PORT=3001 pnpm dev
```

### Build Errors
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### TypeScript Errors
```bash
# Rebuild TypeScript in all packages
pnpm tsc --recursive
```

## Support

- Check [README.md](./README.md) for detailed docs
- Review [LAUNCH.md](./LAUNCH.md) for architecture notes
- Check GitHub Issues for common problems

## Contributing

1. Create a feature branch
2. Make changes
3. Test locally (`pnpm test`)
4. Submit PR with description

Happy parsing!
