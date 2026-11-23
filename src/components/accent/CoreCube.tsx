import { useState, type CSSProperties } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Domain } from '../../data/projects';
import type { AccentTone } from '../../lib/ui';
import { useSystem } from '../../store/useSystemStore';
import { BrutalCard } from '../primitives/BrutalCard';
import { HardButton } from '../primitives/HardButton';
import { WindowChrome } from '../primitives/WindowChrome';
import './coreCube.css';

type Side = 'front' | 'right' | 'back' | 'left';

interface Face {
  side: Side;
  label: string;
  tone: AccentTone;
  /** Rotation that brings this face to the front. */
  yaw: number;
  /** The header filter that turns the cube to this face. */
  domain: Domain;
}

/** The four labelled sides, one per domain, in the order the idle animation shows them. */
const FACES: readonly Face[] = [
  { side: 'front', label: 'UI', tone: 'magenta', yaw: 0, domain: 'ui' },
  { side: 'right', label: 'Backend', tone: 'cobalt', yaw: -90, domain: 'backend' },
  { side: 'back', label: 'Data', tone: 'yellow', yaw: -180, domain: 'data' },
  { side: 'left', label: 'Security', tone: 'periwinkle', yaw: -270, domain: 'security' },
];

/**
 * The 3D accent: a cube whose faces are the domains.
 *  - No filter: it steps through its faces (pausable, still under reduced motion).
 *  - A header filter: it stops and turns that domain's face to the front.
 */
export function CoreCubeCard({ className }: { className?: string }) {
  const { state } = useSystem();
  const [paused, setPaused] = useState(false);

  const target = FACES.find((face) => face.domain === state.filter) ?? FACES[0]!;
  const spinning = state.filter === null && !paused;

  return (
    <BrutalCard as="section" aria-labelledby="core-title" className={className}>
      <WindowChrome title="sys.core" />
      <div className="flex flex-col items-center gap-5 p-5">
        <h3 id="core-title" className="label self-start text-muted">
          Domain core
        </h3>

        <div
          className="cube-stage my-4"
          role="img"
          aria-label={spinning ? 'Cube turning through the domains UI, Backend, Data and Security' : `Cube showing the ${target.label} face`}
        >
          <div className="cube" data-spin={spinning} style={{ '--yaw': `${target.yaw}deg` } as CSSProperties}>
            {FACES.map((face) => (
              <div key={face.side} className="cube-face" data-side={face.side} data-tone={face.tone} aria-hidden="true">
                <span className="label font-medium">{face.label}</span>
              </div>
            ))}
            <div className="cube-face" data-side="top" aria-hidden="true" />
            <div className="cube-face" data-side="bottom" aria-hidden="true" />
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <p className="label text-muted">
            Face: <span className="text-ink">{spinning ? 'cycling' : target.label}</span>
          </p>
          <HardButton
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            disabled={state.filter !== null}
            className="disabled:pointer-events-none disabled:opacity-50"
          >
            {paused ? <Play aria-hidden="true" size={14} strokeWidth={2.25} /> : <Pause aria-hidden="true" size={14} strokeWidth={2.25} />}
            {paused ? 'Resume rotation' : 'Pause rotation'}
          </HardButton>
        </div>
      </div>
    </BrutalCard>
  );
}
