import { PROFILE } from '../../../data/profile';
import { BrutalCard } from '../../primitives/BrutalCard';
import { WindowChrome } from '../../primitives/WindowChrome';
import { AccentBadge } from '../../primitives/AccentBadge';

interface CardProps {
  className?: string;
}

/** The hackathon win, featured with a yellow shadow (yellow = "featured" in the design direction). */
export function AwardCard({ className }: CardProps) {
  const { award } = PROFILE;

  return (
    <BrutalCard as="section" tone="yellow" aria-labelledby="award-title" className={className}>
      <WindowChrome title="award.log" />
      <div className="flex flex-col gap-3 p-4 md:p-5">
        <p className="label text-muted">
          {award.event} / {award.dates}
        </p>
        <h3 id="award-title" className="display text-2xl md:text-3xl">
          {award.title}
        </h3>
        <p>
          <AccentBadge tone="yellow">Team {award.team}</AccentBadge>
        </p>
      </div>
    </BrutalCard>
  );
}
