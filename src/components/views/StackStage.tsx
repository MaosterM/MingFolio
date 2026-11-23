import { matchesDomain } from '../../data/projects';
import { projectsUsing, STACK, TOOL_COUNT, type StackCategory } from '../../data/stack';
import { cx } from '../../lib/ui';
import { useSystem } from '../../store/useSystemStore';
import { BrutalCard } from '../primitives/BrutalCard';
import { WindowChrome } from '../primitives/WindowChrome';
import { StageHeader } from './StageHeader';

/** How many tools appear in at least one listed project, counted from the data. */
const TOOLS_IN_USE = STACK.flatMap((category) => category.tools).filter((tool) => projectsUsing(tool).length > 0).length;

/**
 * The order tools are listed in inside one category card.
 * `tools` arrives in the order written in data/stack.ts (the GitHub profile's order).
 */
function orderTools(tools: readonly string[]): string[] {
  // Most-used first; ties keep the profile order because Array.sort is stable.
  return [...tools].sort((a, b) => projectsUsing(b).length - projectsUsing(a).length);
}

/**
 * 03 / STACK: the capability matrix.
 * Deliberately no proficiency bars or percentages: those would be invented.
 * The only claim per tool is checkable: which projects on this site use it.
 */
export function StackStage() {
  return (
    <div className="flex flex-col gap-6">
      <StageHeader
        stage="stack"
        title="Stack matrix"
        intro="Tools from the GitHub profile and the projects' READMEs. Each row lists the projects on this site that use it; select one to open its spec."
      />
      <p className="label text-muted">
        {TOOL_COUNT} tools / {TOOLS_IN_USE} used in listed projects / {STACK.length} categories
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STACK.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: StackCategory }) {
  const { state, inspect } = useSystem();
  const filtering = state.filter !== null;
  const titleId = `stack-${category.id}`;

  return (
    <BrutalCard as="section" aria-labelledby={titleId}>
      <WindowChrome title={`stack/${category.id}`} />
      <div className="p-4">
        <h3 id={titleId} className="display mb-3 text-xl">
          {category.title}
        </h3>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-line">
              <th scope="col" className="label pb-2 font-normal text-muted">
                Tool
              </th>
              <th scope="col" className="label pb-2 font-normal text-muted">
                Used in
              </th>
            </tr>
          </thead>
          <tbody>
            {orderTools(category.tools).map((tool) => {
              const users = projectsUsing(tool);
              // While a domain filter is on, rows used by a matching project light up; the rest fade.
              const hit = filtering && users.some((project) => matchesDomain(project, state.filter));
              return (
                <tr
                  key={tool}
                  className={cx(
                    'border-b border-line/30 align-top transition-opacity duration-(--dur-snap) last:border-b-0',
                    filtering && !hit && 'opacity-40',
                  )}
                >
                  <th scope="row" className="py-2 pr-3 font-medium">
                    <span className={cx(hit && 'bg-yellow px-1 text-on-accent')}>{tool}</span>
                  </th>
                  <td className="py-1">
                    {users.length === 0 ? (
                      <span className="label text-muted">
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">No listed project</span>
                      </span>
                    ) : (
                      <span className="flex flex-wrap gap-1.5">
                        {users.map((project) => (
                          <button
                            key={project.slug}
                            type="button"
                            data-tone={project.tone}
                            onClick={() => inspect(project.slug)}
                            aria-label={`Open ${project.title} spec`}
                            className="chip file-id min-h-11 px-2"
                          >
                            {project.slug}
                          </button>
                        ))}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </BrutalCard>
  );
}
