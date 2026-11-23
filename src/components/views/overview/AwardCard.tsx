import { PROFILE } from '../../../data/profile';
import { findProject } from '../../../data/projects';
import { useSystem } from '../../../store/useSystemStore';
import { BrutalCard } from '../../primitives/BrutalCard';
import { WindowChrome } from '../../primitives/WindowChrome';
import { AccentBadge } from '../../primitives/AccentBadge';
import { HardButton } from '../../primitives/HardButton';

interface CardProps {
  className?: string;
}

/** The hackathon win, featured with a yellow shadow (yellow = "featured" in the design direction). */
export function AwardCard({ className }: CardProps) {
  const { award } = PROFILE;
  const { inspect } = useSystem();
  // Only offer the button when the winning project is actually on the site.
  const entry = award.projectSlug ? findProject(award.projectSlug) : undefined;

  return (
    <BrutalCard as="section" tone="yellow" aria-labelledby="award-title" className={className}>
      <WindowChrome title="award.log" />
      <div className="flex h-full flex-col gap-3 p-4 md:p-5">
        <p className="label text-muted">
          {award.event} / {award.dates}
        </p>
        <h3 id="award-title" className="display text-2xl md:text-3xl">
          {award.title}
        </h3>
        <p>
          <AccentBadge tone="yellow">Team {award.team}</AccentBadge>
        </p>
        {entry && (
          <HardButton tone="yellow" onClick={() => inspect(entry.slug)} className="mt-auto self-start">
            Inspect {entry.title} →
          </HardButton>
        )}
      </div>
    </BrutalCard>
  );
}
