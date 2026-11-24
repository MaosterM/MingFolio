import { BRANCHES, PROJECTS, STATUS_BADGE, type Branch, type ProjectNode } from '../../../data/projects';
import { cx } from '../../../lib/ui';
import { useSystem } from '../../../store/useSystemStore';
import { AccentBadge } from '../../primitives/AccentBadge';
import { BrutalCard } from '../../primitives/BrutalCard';
import { HardButton } from '../../primitives/HardButton';
import { WindowChrome } from '../../primitives/WindowChrome';

/** 01 / ROUTER: the root every branch hangs from. */
export function RouterNode() {
  return (
    <BrutalCard thick className="mx-auto w-full max-w-sm">
      <WindowChrome title="router.core" />
      <div className="flex flex-col gap-1 p-4">
        <p className="label text-muted">01 / Router</p>
        <p className="display text-2xl">Project router</p>
        <p className="label text-muted">
          {BRANCHES.length} branches / {PROJECTS.length} nodes
        </p>
      </div>
    </BrutalCard>
  );
}

/** 02 / <BRANCH>: a category label box, smaller than a project window. */
export function BranchNode({ branch, count }: { branch: Branch; count: number }) {
  return (
    <div data-tone={branch.tone} className="frame flex items-center justify-between gap-3 px-3 py-2.5">
      <span className="flex items-center gap-2">
        <span data-tone={branch.tone} aria-hidden="true" className="fill size-3 border-2 border-line" />
        <span className="label">{branch.indexLabel}</span>
      </span>
      <span className="label text-muted">
        {count} {count === 1 ? 'node' : 'nodes'}
      </span>
    </div>
  );
}

/** 03 / <PROJECT>: a project window with its status, stack and an Inspect action. */
export function ProjectLeaf({ project, className }: { project: ProjectNode; className?: string }) {
  const { inspect } = useSystem();
  const titleId = `leaf-${project.slug}`;
  const badge = STATUS_BADGE[project.status];

  return (
    <BrutalCard as="article" tone={project.tone} aria-labelledby={titleId} className={cx('flex flex-col', className)}>
      <WindowChrome title={`${project.slug}.spec`} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="label text-muted">{project.indexLabel}</p>
        <h3 id={titleId} className="display text-xl md:text-2xl">
          {project.title}
        </h3>
        <p className="text-sm">{project.tagline}</p>
        <div className="flex flex-wrap gap-2">
          <AccentBadge tone={badge.tone}>{badge.label}</AccentBadge>
        </div>
        {project.stack.length > 0 && <p className="file-id text-muted">{project.stack.join(' · ')}</p>}
        {/* mt-auto pins the button to the bottom so the three windows' buttons line up */}
        <HardButton
          tone={project.tone}
          onClick={() => inspect(project.slug)}
          aria-label={`Inspect ${project.title}`}
          className="mt-auto self-start"
        >
          Inspect →
        </HardButton>
      </div>
    </BrutalCard>
  );
}
