import { PROJECTS, type ProjectNode } from './projects';

/**
 * Tools from the GitHub profile, plus Three.js and GSAP (used in Zone-Ming).
 * No proficiency levels: the matrix only shows what is verifiable, i.e. which projects use a tool.
 */
export interface StackCategory {
  id: string;
  title: string;
  tools: readonly string[];
}

export const STACK: readonly StackCategory[] = [
  { id: 'languages', title: 'Languages', tools: ['JavaScript', 'TypeScript', 'C++', 'PHP', 'HTML', 'CSS'] },
  { id: 'frameworks', title: 'Frameworks & libraries', tools: ['React', 'Electron', 'Three.js', 'GSAP'] },
  { id: 'data', title: 'Data', tools: ['MySQL', 'Jupyter'] },
  { id: 'infra', title: 'Infra & OS', tools: ['Docker', 'Ubuntu', 'Apache'] },
  { id: 'tooling', title: 'Tooling', tools: ['VS Code', 'IntelliJ', 'Figma'] },
];

/** Projects whose stack lists this tool (case-insensitive). */
export function projectsUsing(tool: string): ProjectNode[] {
  const wanted = tool.toLowerCase();
  return PROJECTS.filter((project) => project.stack.some((item) => item.toLowerCase() === wanted));
}

export const TOOL_COUNT = STACK.reduce((total, category) => total + category.tools.length, 0);
