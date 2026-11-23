import { PROJECTS } from '../../../data/projects';
import { TOOL_COUNT } from '../../../data/stack';
import { useSystem } from '../../../store/useSystemStore';
import { BrutalCard } from '../../primitives/BrutalCard';
import { HardButton } from '../../primitives/HardButton';
import { WindowChrome } from '../../primitives/WindowChrome';

interface CardProps {
  className?: string;
}

/** Every number here is counted from src/data, so it can never drift from the real content. */
const COUNTS = [
  { label: 'Nodes', value: PROJECTS.length },
  { label: 'Live', value: PROJECTS.filter((p) => p.status === 'LIVE').length },
  { label: 'Building', value: PROJECTS.filter((p) => p.status === 'ACTIVE').length },
  { label: 'Tools', value: TOOL_COUNT },
];

/** What: a quick read-out of the system, with routes to the deeper stages. */
export function SystemMapCard({ className }: CardProps) {
  const { setStage } = useSystem();

  return (
    <BrutalCard as="section" tone="cobalt" aria-labelledby="map-title" className={className}>
      <WindowChrome title="sys.map" />
      <div className="flex flex-col gap-4 p-4 md:p-5">
        <h3 id="map-title" className="display text-2xl">
          System map
        </h3>
        {/* Same 2px-gap grid trick as the pipeline tabs */}
        <dl className="grid grid-cols-2 gap-[2px] border-2 border-line bg-line">
          {COUNTS.map((count) => (
            <div key={count.label} className="flex flex-col gap-1 bg-surface p-3">
              <dt className="label text-muted">{count.label}</dt>
              <dd className="display text-3xl">{String(count.value).padStart(2, '0')}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-3">
          <HardButton tone="cobalt" onClick={() => setStage('systems')}>
            Open project graph →
          </HardButton>
          <HardButton onClick={() => setStage('dispatch')}>Open dispatch →</HardButton>
        </div>
      </div>
    </BrutalCard>
  );
}
