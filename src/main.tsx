import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Self-hosted fonts: only the weights the design uses, so nothing extra is downloaded.
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import './styles/tokens.css';

import { applyTheme, readStoredTheme } from './lib/theme';
import App from './App';

// Apply the saved theme before React's first paint, so there is no light→dark flash.
applyTheme(readStoredTheme());

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('index.html is missing <div id="root">');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
