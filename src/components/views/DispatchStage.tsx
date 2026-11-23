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
 * A channel without a verified address (href: null) shows its placeholder and never renders as a link.
 */
export function DispatchStage() {
  return (
    <div className="flex flex-col gap-6">
      <StageHeader
        stage="dispatch"
        title="Open a channel"
        intro="Every live channel opens in a new tab. Channels marked pending have no published address yet."
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
  const live = link.href !== null;
  const titleId = `channel-${link.key}`;

  return (
    <BrutalCard as="li" tone={live ? 'yellow' : 'ink'} aria-labelledby={titleId} className="flex flex-col">
      <WindowChrome title={`dispatch/${link.key}`} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="label text-muted">CH.{String(index + 1).padStart(2, '0')}</p>
          <AccentBadge tone={live ? 'yellow' : 'periwinkle'}>{live ? 'Open' : 'Pending'}</AccentBadge>
        </div>
        <h3 id={titleId} className="display text-2xl">
          {link.label}
        </h3>
        <p className="file-id break-all">
          {live ? link.display : <span className="placeholder">{link.display}</span>}
        </p>
        <div className="mt-auto pt-2">
          {link.href !== null ? (
            <HardLink
              href={link.href}
              tone="yellow"
              onClick={() => logEvent('DISPATCH', `opened ${link.key}`)}
            >
              Open {link.label}
            </HardLink>
          ) : (
            <p className="label text-muted">Not published yet</p>
          )}
        </div>
      </div>
    </BrutalCard>
  );
}
