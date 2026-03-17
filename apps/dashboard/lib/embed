/**
 * @readable-ai/embed
 * UMD bundle for embedding Readable via script tag
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Readable } from '@readable-ai/react';
import type { ReadableProps } from '@readable-ai/react';

// Export for potential React environments that load this
export { Readable };
export type { ReadableProps };

// Global API for script tag usage
declare global {
  interface Window {
    Readable?: {
      render: (options: ReadableOptions) => void;
    };
  }
}

export interface ReadableOptions extends Omit<ReadableProps, 'response'> {
  containerId: string;
  response: string;
}

/**
 * Global render function for script tag usage
 */
function renderReadable(options: ReadableOptions): void {
  const container = document.getElementById(options.containerId);
  if (!container) {
    console.error(`[Readable] Container with id "${options.containerId}" not found`);
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      React.createElement(Readable, {
        response: options.response,
        renderer: options.renderer || 'cards',
        theme: options.theme || 'dark',
        parserConfig: options.parserConfig,
        overrides: options.overrides,
      })
    );
  } catch (error) {
    console.error('[Readable] Error rendering:', error);
  }
}

// Expose global API
if (typeof window !== 'undefined') {
  (window as any).Readable = {
    render: renderReadable,
  };
}

export default { render: renderReadable };
