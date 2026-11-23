import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * GitHub Pages cannot send HTTP headers, so the Content-Security-Policy ships as a <meta> tag.
 * It is injected only into the production build: Vite's dev server relies on inline scripts
 * (React refresh preamble) that this policy would block.
 * `frame-ancestors` is ignored in <meta>, so it is not listed here.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

function cspMeta(): Plugin {
  return {
    name: 'csp-meta',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
    ],
  };
}

export default defineConfig({
  // Relative base so the build works under https://<user>.github.io/MingFolio/ without hard-coding the repo name.
  base: './',
  plugins: [react(), tailwindcss(), cspMeta()],
});
