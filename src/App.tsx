import TokenSpecimen from './dev/TokenSpecimen';
import { SystemProvider } from './store/useSystemStore';

// Temporary: shows the design tokens and store probe until the real shell lands in checkpoint 5.
export default function App() {
  return (
    <SystemProvider>
      <TokenSpecimen />
    </SystemProvider>
  );
}
