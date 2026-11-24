import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { findProject, STATUS_BADGE } from '../../data/projects';
import { useSystem } from '../../store/useSystemStore';
import { AccentBadge } from '../primitives/AccentBadge';
import { HardLink } from '../primitives/HardButton';
import { WindowChrome } from '../primitives/WindowChrome';

/**
 * The OS-window spec sheet for one project.
 *
 * Built on the native <dialog> element opened with showModal(), which gives us for free:
 *  - focus moves into the window and Tab stays inside it
 *  - the page behind becomes inert (not clickable, hidden from screen readers)
 *  - Esc closes it, and focus returns to whatever opened it
 *
 * The store is the source of truth: `state.inspected` (also ?node= in the URL) decides
 * whether the window is open. This component only mirrors that onto the <dialog>.
 */
export function ProjectInspector() {
  const { state, inspect } = useSystem();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const project = state.inspected ? findProject(state.inspected) : undefined;

  // Store → dialog: open or close the real element when the inspected project changes.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  // Dialog → store: the dialog closed itself (Esc, [X], backdrop), so tell the store.
  // inspect(null) does nothing if the store already says closed, so this can't loop.
  function handleClose() {
    inspect(null);
  }

  /** Clicks on the dark backdrop around the window should close it. */
  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget)
    {
      dialogRef.current?.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="inspector-title"
      onClose={handleClose}
      onClick={handleDialogClick}
      className="inspector"
    >
      {project && (
        <div>
          <WindowChrome
            title={`project.spec // ${project.slug}`}
            className="sticky top-0 z-10"
            actions={
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close project spec"
                className="label -mr-3 min-h-11 px-3 hover:bg-yellow hover:text-on-accent"
              >
                [X]
              </button>
            }
          />

          <div className="flex flex-col gap-6 p-5 md:p-6">
            <header className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="label text-muted">{project.indexLabel}</p>
                <AccentBadge tone={STATUS_BADGE[project.status].tone}>{STATUS_BADGE[project.status].label}</AccentBadge>
              </div>
              <h2 id="inspector-title" className="display text-3xl md:text-4xl">
                {project.title}
              </h2>
              <p className="max-w-prose">{project.tagline}</p>
              {project.context && <p className="label text-muted">{project.context}</p>}
            </header>

            {/* Each section appears only when there is something true to say in it. */}
            {project.brief.problem && <SpecSection title="Problem">{project.brief.problem}</SpecSection>}

            {(project.stack.length > 0 || project.brief.highlights.length > 0) && (
              <SpecSection title="What's inside">
                {project.stack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tool) => (
                      <AccentBadge key={tool} tone="periwinkle">
                        {tool}
                      </AccentBadge>
                    ))}
                  </div>
                )}
                <Bullets items={project.brief.highlights} />
              </SpecSection>
            )}

            {project.brief.results.length > 0 && (
              <SpecSection title="Results / key decisions">
                <Bullets items={project.brief.results} />
              </SpecSection>
            )}

            <SpecSection title="Links">
              <div className="flex flex-wrap items-center gap-3">
                {project.links.live && (
                  <HardLink href={project.links.live} tone="yellow">
                    Live demo
                  </HardLink>
                )}
                {project.links.package && <HardLink href={project.links.package}>PyPI package</HardLink>}
                {project.links.repo && <HardLink href={project.links.repo}>Source repo</HardLink>}
                {project.sourcePrivate && <span className="label text-muted">Source code: private repository</span>}
              </div>
            </SpecSection>
          </div>
        </div>
      )}
    </dialog>
  );
}

function SpecSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t-2 border-line pt-4">
      <h3 className="label text-muted">{title}</h3>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="text-cobalt">
            →
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
