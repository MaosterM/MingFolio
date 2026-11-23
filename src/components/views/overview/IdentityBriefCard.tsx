import { PROFILE } from '../../../data/profile';
import { BrutalCard } from '../../primitives/BrutalCard';
import { WindowChrome } from '../../primitives/WindowChrome';

interface CardProps {
  /** Grid placement from the parent, e.g. "md:col-span-7". */
  className?: string;
}

/** Who: the verified facts as a definition list, plus the availability status. */
export function IdentityBriefCard({ className }: CardProps) {
  return (
    <BrutalCard as="section" aria-labelledby="brief-title" className={className}>
      <WindowChrome title="identity.brief" />
      <div className="flex flex-col gap-4 p-4 md:p-5">
        <h3 id="brief-title" className="display text-2xl">
          Identity brief
        </h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          {PROFILE.facts.map((fact) => (
            <div key={fact.label} className="contents">
              <dt className="label pt-0.5 text-muted">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
          <dt className="label pt-0.5 text-muted">Status</dt>
          <dd>
            {PROFILE.availability ?? <span className="placeholder">[Availability placeholder]</span>}
          </dd>
        </dl>
      </div>
    </BrutalCard>
  );
}
