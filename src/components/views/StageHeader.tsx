import { stageLabel, type StageId } from '../../lib/stages';

interface StageHeaderProps {
  stage: StageId;
  /** The stage's <h2>, e.g. "System overview". Rendered ALL CAPS by the .display class. */
  title: string;
  /** One optional line under the title. */
  intro?: string;
}

/** The eyebrow + heading every stage starts with: "01 / OVERVIEW" over a display <h2>. */
export function StageHeader({ stage, title, intro }: StageHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="label text-muted">{stageLabel(stage)}</p>
      <h2 className="display text-3xl md:text-5xl">{title}</h2>
      {intro && <p className="max-w-prose text-muted">{intro}</p>}
    </div>
  );
}
