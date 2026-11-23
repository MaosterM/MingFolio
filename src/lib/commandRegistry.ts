/**
 * The terminal's commands. Security model: an ALLOWLIST.
 *
 *  - Input is split on whitespace into words; nothing is ever evaluated as code.
 *  - The first word must be an own key of COMMANDS (Object.hasOwn), so names like
 *    "constructor" or "__proto__" that exist on every object can't sneak through.
 *  - Output is plain strings, rendered by React as text, never as HTML.
 *  - `open` only uses the fixed links in data/profile.ts.
 */
import { LINKS, PROFILE, isSafeHref, type LinkKey } from '../data/profile';
import { PROJECTS, findProject } from '../data/projects';
import { stageByNumber, type StageId } from './stages';

/** What a command may do to the app. The terminal passes these in. */
export interface CommandContext {
  setStage: (stage: StageId) => void;
  inspect: (slug: string) => void;
  openLink: (key: LinkKey) => void;
  clear: () => void;
}

export interface CommandResult {
  lines: string[];
  /** true → lines are logged as ERR instead of OUT. */
  error?: boolean;
}

interface CommandDef {
  usage: string;
  summary: string;
  run: (args: string[], ctx: CommandContext) => CommandResult;
}

const ok = (...lines: string[]): CommandResult => ({ lines });
const fail = (...lines: string[]): CommandResult => ({ lines, error: true });

function isLinkKey(value: string): value is LinkKey {
  return Object.hasOwn(LINKS, value);
}

const COMMANDS: Record<string, CommandDef> = {
  help: {
    usage: 'help',
    summary: 'list the commands',
    run: () => ok(...Object.values(COMMANDS).map((c) => `${c.usage.padEnd(30)}${c.summary}`)),
  },

  whoami: {
    usage: 'whoami',
    summary: 'print the profile',
    run: () =>
      ok(
        `${PROFILE.name} (@${PROFILE.handle})`,
        PROFILE.roleLine.join(' / '),
        ...PROFILE.facts.map((fact) => `${fact.label.toLowerCase().padEnd(16)}${fact.value}`),
        `${'award'.padEnd(16)}${PROFILE.award.title}, ${PROFILE.award.event}`,
      ),
  },

  ls: {
    usage: 'ls',
    summary: 'list project nodes',
    run: () => ok(...PROJECTS.map((p) => `${p.slug.padEnd(22)}${p.status.padEnd(8)}${p.domains.join(', ')}`)),
  },

  inspect: {
    usage: 'inspect <slug>',
    summary: 'open a project spec',
    run: ([slug], ctx) => {
      if (!slug) return fail('usage: inspect <slug>', 'try: ls');
      if (!findProject(slug)) return fail(`no node named "${slug}"`, 'try: ls');
      ctx.inspect(slug);
      return ok(); // the store logs the INSPECT line
    },
  },

  stage: {
    usage: 'stage <1-4>',
    summary: 'switch pipeline stage',
    run: (args, ctx) => {
      const n = Number(args[0]);
      const stage = stageByNumber(n);
      if (!stage) return fail('usage: stage <1-4>');
      ctx.setStage(stage);
      return ok();
    },
   
  },

  open: {
    usage: 'open <github|linkedin|email>',
    summary: 'open an external link',
    run: ([target], ctx) => {
      if (!target || !isLinkKey(target)) return fail('usage: open <github|linkedin|email|resume>');
      const link = LINKS[target];
      if (!link.href) return fail(`${link.label.toLowerCase()} is not published yet`);
      if (!isSafeHref(link.href)) return fail(`refused unsafe link for ${target}`);
      ctx.openLink(target);
      return ok(); // the terminal logs the DISPATCH line
    },
  },

  clear: {
    usage: 'clear',
    summary: 'clear the log',
    run: (_args, ctx) => {
      ctx.clear();
      return ok();
    },
  },
};

/** Parse one line of input and run it. Never throws. */
export function runCommand(input: string, ctx: CommandContext): CommandResult {
  const [name = '', ...args] = input.trim().toLowerCase().split(/\s+/);
  const command = Object.hasOwn(COMMANDS, name) ? COMMANDS[name] : undefined;
  if (!command) return fail(`command not found: ${name}`, 'type "help" for the list');
  return command.run(args, ctx);
}
