import { useRef, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { STAGE_PANEL_ID, STAGES, tabId } from '../../lib/stages';
import { SNAP } from '../../lib/motion';
import { cx } from '../../lib/ui';
import { useSystem } from '../../store/useSystemStore';

/**
 * The 01–04 stage selector, built as an ARIA tablist:
 *  - only the active tab is in the Tab order (roving tabindex)
 *  - ←/→ move between stages, Home/End jump to the first/last
 *  - a yellow block slides to the active tab (Motion layoutId)
 */
export function PipelineNav() {
  const { state, setStage } = useSystem();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusStage(index: number) {
    const stage = STAGES[index];
    if (!stage) return;
    setStage(stage.id);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const count = STAGES.length;
    const current = STAGES.findIndex((stage) => stage.id === state.stage);

    let next: number | null = null;
    if (event.key === 'ArrowRight') next = (current + 1) % count;
    else if (event.key === 'ArrowLeft') next = (current - 1 + count) % count;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count - 1;

    if (next === null) return;
    event.preventDefault(); // stop Home/End from scrolling the page
    focusStage(next);
  }

  return (
    <nav aria-label="Pipeline stages">
      {/* gap-[2px] over a bg-line container draws the 2px grid lines between cells */}
      <div role="tablist" aria-label="Stages" data-tone="ink" className="frame grid grid-cols-2 gap-[2px] bg-line sm:grid-cols-4">
        {STAGES.map((stage, index) => {
          const active = stage.id === state.stage;
          return (
            <button
              key={stage.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={tabId(stage.id)}
              aria-selected={active}
              aria-controls={STAGE_PANEL_ID}
              tabIndex={active ? 0 : -1}
              onClick={() => setStage(stage.id)}
              onKeyDown={handleKeyDown}
              className={cx(
                'tab relative flex min-h-14 items-center bg-surface px-4 py-3 text-left',
                active ? 'text-on-accent' : 'text-ink',
              )}
            >
              {active && (
                <motion.span layoutId="stage-fill" transition={SNAP} aria-hidden="true" className="absolute inset-0 bg-yellow" />
              )}
              <span className="label relative">
                <span className="text-current opacity-70">{stage.index} /</span> {stage.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
