import * as esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isWatch = process.argv.includes('--watch');

const config = {
  entryPoints: [path.join(__dirname, 'src/index.ts')],
  bundle: true,
  platform: 'browser',
  format: 'umd',
  globalName: 'ReadableAI',
  external: [],
  outfile: path.join(__dirname, 'dist/readable.umd.js'),
  minify: true,
  sourcemap: true,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
};

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(config);
      await ctx.watch();
      console.log('[Embed] Watching for changes...');
    } else {
      await esbuild.build(config);
      console.log(`[Embed] Built to ${config.outfile}`);
    }
  } catch (error) {
    console.error('[Embed] Build failed:', error);
    process.exit(1);
  }
}

build();
