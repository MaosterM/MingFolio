import type { StageId } from '../../lib/stages';
import { BrutalCard } from '../primitives/BrutalCard';
import { WindowChrome } from '../primitives/WindowChrome';
import { StageHeader } from './StageHeader';

interface StagePlaceholderProps {
  stage: StageId;
  title: string;
  /** Which checkpoint builds the real view. */
  arrivesIn: string;
}

/** Scaffolding: stands in for a stage until its real view is built. Delete once all four exist. */
export function StagePlaceholder({ stage, title, arrivesIn }: StagePlaceholderProps) {
  return (
    <div className="flex flex-col gap-6">
      <StageHeader stage={stage} title={title} />
      <BrutalCard>
        <WindowChrome title={`${stage}.pending`} />
        <p className="p-4">
          <span className="placeholder">[{title} — built in {arrivesIn}]</span>
        </p>
      </BrutalCard>
    </div>
  );
}
