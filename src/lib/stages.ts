/** The four pipeline stages, in order. Everything else derives from this list. */

export type StageId = 'overview' | 'systems' | 'stack' | 'dispatch';

export interface StageDef {
  id: StageId;
  /** "01" … "04" */
  index: string;
  label: string;
}

export const STAGES: readonly StageDef[] = [
  { id: 'overview', index: '01', label: 'Overview' },
  { id: 'systems', index: '02', label: 'Systems' },
  { id: 'stack', index: '03', label: 'Stack' },
  { id: 'dispatch', index: '04', label: 'Dispatch' },
];

/** Narrows any value (a URL param, a terminal argument) to a real StageId. */
export function isStageId(value: unknown): value is StageId {
  return STAGES.some((stage) => stage.id === value);
}

/** "02 / SYSTEMS", the label used in the nav and the telemetry log. */
export function stageLabel(id: StageId): string {
  const stage = STAGES.find((s) => s.id === id);
  return stage ? `${stage.index} / ${stage.label.toUpperCase()}` : id;
}

/** stage 2 → 'systems'; out of range → null. */
export function stageByNumber(n: number): StageId | null {
  return STAGES[n - 1]?.id ?? null;
}
