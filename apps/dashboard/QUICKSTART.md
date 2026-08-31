# readable.ai Quick Start

Get the Next.js monorepo up and running in **5 minutes**.

## Prerequisites

- **Node.js** >= 18 ([Download](https://nodejs.org/))
- **pnpm** >= 9.0 (`npm install -g pnpm`)

## Installation

```bash
# Navigate to project
cd readable-ai

# Install dependencies (includes Turbo, all packages, and apps)
pnpm install
```

**⏱️ Takes 1-2 minutes**

## Development

```bash
# Start all packages in dev mode
pnpm dev

# Dashboard available at: http://localhost:3000
# All packages in watch mode with hot reload
```

**Press Ctrl+C to stop**

### Alternative: Dashboard Only

```bash
pnpm dev:dashboard
```

Lighter weight if you only need the dashboard.

## Building

```bash
# Build all packages (Turbo-optimized with caching)
pnpm build

# Start production build
cd apps/dashboard
pnpm start
```

## Project Structure

```
readable-ai/ (Next.js Turbo Monorepo)
├── apps/
│   └── dashboard/           # Next.js 16 app (port 3000)
├── packages/
│   ├── core/                # Parser engine (zero dependencies)
│   ├── react/               # React components & renderers
│   └── embed/               # UMD bundle for <script> tags
├── components/              # Shared UI components (60+)
├── hooks/                   # Shared React hooks
├── lib/                     # Shared utilities
├── turbo.json               # Monorepo orchestration
├── pnpm-workspace.yaml      # Workspace definition
└── MONOREPO.md              # Detailed architecture guide
```

## Common Tasks

```bash
# Development
pnpm dev                      # All packages
pnpm dev:dashboard            # Dashboard only

# Building & Production
pnpm build                    # Build all packages
turbo build --filter=@readable-ai/react  # Specific package

# Code Quality
pnpm lint                     # ESLint + Next.js rules
pnpm type-check               # TypeScript checking

# Workspace Info
pnpm list --depth=0           # Installed packages
turbo run build --graph       # Dependency graph
```

## Features

🎨 **60+ UI Components** (Radix UI)  
🌓 **Dark Mode Support** (next-themes)  
⚡ **Fast Builds** (Turbo caching)  
🔄 **Parallel Development** (All packages watch mode)  
📦 **Monorepo Structure** (pnpm workspaces)  
🎯 **Type Safe** (TypeScript strict mode)  
🚀 **Next.js 16 App Router** (Bleeding edge)  

## Documentation

- **README.md** - Project overview
- **MONOREPO.md** - Detailed monorepo guide
- **NEXTJS_CONVERSION.md** - Conversion history
- **LAUNCH.md** - Deployment checklist

## Troubleshooting

### Port 3000 in use?
```bash
pnpm dev -- -p 3001
```

### Dependencies issue?
```bash
rm -rf node_modules .turbo
pnpm install
```

### Build fails?
```bash
pnpm build
pnpm type-check
```

## That's it! 🎉

```bash
pnpm dev  # Start coding
```

Visit **http://localhost:3000** in your browser.

For more details, check **MONOREPO.md** or **NEXTJS_CONVERSION.md**.

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
