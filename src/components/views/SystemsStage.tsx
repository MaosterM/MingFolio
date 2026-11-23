import { Fragment } from 'react';
import { BRANCHES, PROJECTS, matchesDomain, type Domain, type ProjectNode } from '../../data/projects';
import { cx } from '../../lib/ui';
import { useSystem } from '../../store/useSystemStore';
import { StageHeader } from './StageHeader';
import { BusConnector, DropConnector, type WireTone } from './systems/Connectors';
import { BranchNode, ProjectLeaf, RouterNode } from './systems/GraphNodes';

/**
 * Does this branch have at least one project in the filtered domain?
 * `filter === null` means "All", so every branch matches.
 */
function branchMatches(projects: readonly ProjectNode[], filter: Domain | null): boolean {
  return projects.some((project) => matchesDomain(project, filter));
}

/**
 * 02 / SYSTEMS: the projects as an architecture graph.
 *
 * One DOM, two layouts:
 *   ≥768px  router → bus → three columns side by side (branch ↓ project in each)
 *   <768px  the same columns stacked into one vertical pipeline with ↓ between every node
 * Each column is [↓, branch, ↓, project(s)], so on a phone the arrows simply chain top to bottom.
 */
export function SystemsStage() {
  const { state } = useSystem();
  const filtering = state.filter !== null;

  const columns = BRANCHES.map((branch) => {
    const projects = PROJECTS.filter((project) => project.branch === branch.id);
    return { branch, projects, matches: branchMatches(projects, state.filter) };
  });

  const wireFor = (matches: boolean): WireTone => (filtering && matches ? 'cobalt' : 'line');
  const anyMatch = columns.some((column) => column.matches);

  return (
    <div className="flex flex-col gap-6">
      <StageHeader
        stage="systems"
        title="Project graph"
        intro="Each branch routes to a project window. Inspect a node to open its spec; filter by domain in the header."
      />

      <div>
        <RouterNode />
        <BusConnector tone={wireFor(anyMatch)} />

        <div className="grid grid-cols-1 md:grid-cols-3">
          {columns.map(({ branch, projects, matches }) => (
            <div
              key={branch.id}
              className={cx(
                'flex flex-col transition-opacity duration-(--dur-snap) md:px-3',
                filtering && !matches && 'opacity-35',
              )}
            >
              <DropConnector tone={wireFor(matches)} />
              <BranchNode branch={branch} count={projects.length} />
              {projects.map((project) => (
                <Fragment key={project.slug}>
                  <DropConnector tone={wireFor(matches)} />
                  <ProjectLeaf project={project} className="flex-1" />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
