import { LINKS, type ProfileLink } from '../../data/profile';
import { useSystem } from '../../store/useSystemStore';
import { AccentBadge } from '../primitives/AccentBadge';
import { BrutalCard } from '../primitives/BrutalCard';
import { HardLink } from '../primitives/HardButton';
import { WindowChrome } from '../primitives/WindowChrome';
import { StageHeader } from './StageHeader';

const CHANNELS: readonly ProfileLink[] = Object.values(LINKS);

/**
 * 04 / DISPATCH: ways to reach the owner. Links only, no form and no backend.
 * A channel without an address (href: null, e.g. the resume) shows its "-" and never renders as a link.
 */
export function DispatchStage() {
  return (
    <div className="flex flex-col gap-6">
      <StageHeader
        stage="dispatch"
        title="Open a channel"
        intro="Web channels open in a new tab; email opens your mail app."
      />
      <ul className="grid gap-6 sm:grid-cols-2">
        {CHANNELS.map((link, index) => (
          <ChannelCard key={link.key} link={link} index={index} />
        ))}
      </ul>
    </div>
  );
}

function ChannelCard({ link, index }: { link: ProfileLink; index: number }) {
  const { logEvent } = useSystem();
  const titleId = `channel-${link.key}`;
  const live = link.href !== null;

  return (
    <BrutalCard as="li" tone={live ? 'yellow' : 'ink'} aria-labelledby={titleId} className="flex flex-col">
      <WindowChrome title={`dispatch/${link.key}`} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="label text-muted">CH.{String(index + 1).padStart(2, '0')}</p>
          {live && <AccentBadge tone="yellow">Open</AccentBadge>}
        </div>
        <h3 id={titleId} className="display text-2xl">
          {link.label}
        </h3>
        <p className="file-id break-all">
          {link.display}
          {!live && <span className="sr-only">: not available yet</span>}
        </p>
        {link.href !== null && (
          <div className="mt-auto pt-2">
            <HardLink href={link.href} tone="yellow" onClick={() => logEvent('DISPATCH', `opened ${link.key}`)}>
              {link.key === 'email' ? 'Send an email' : `Open ${link.label}`}
            </HardLink>
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
