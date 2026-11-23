import { PROJECTS, type ProjectNode } from './projects';

/**
 * Tools from two verifiable sources:
 *   - the list on the GitHub profile
 *   - the stacks stated in the projects' READMEs (Python, pandas, Next.js, Solidity …)
 * No proficiency levels: the matrix only shows what is checkable, i.e. which projects use a tool.
 */
export interface StackCategory {
  id: string;
  title: string;
  tools: readonly string[];
}

export const STACK: readonly StackCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    tools: ['JavaScript', 'TypeScript', 'Python', 'PHP', 'Solidity', 'C++', 'HTML', 'CSS'],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & libraries',
    tools: ['React', 'Next.js', 'Express', 'Tailwind CSS', 'Three.js', 'GSAP', 'Electron'],
  },
  { id: 'data', title: 'Data', tools: ['pandas', 'MySQL', 'Jupyter'] },
  { id: 'infra', title: 'Runtime & infra', tools: ['Node.js', 'Docker', 'Ubuntu', 'Apache'] },
  { id: 'tooling', title: 'Tooling', tools: ['Vite', 'Foundry', 'VS Code', 'IntelliJ', 'Figma'] },
];

/** Projects whose stack lists this tool (case-insensitive). */
export function projectsUsing(tool: string): ProjectNode[] {
  const wanted = tool.toLowerCase();
  return PROJECTS.filter((project) => project.stack.some((item) => item.toLowerCase() === wanted));
}

export const TOOL_COUNT = STACK.reduce((total, category) => total + category.tools.length, 0);
