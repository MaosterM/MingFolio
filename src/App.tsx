import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { PROFILE } from './data/profile';
import { SNAP } from './lib/motion';
import { STAGE_PANEL_ID, tabId, type StageId } from './lib/stages';
import { SystemProvider, useSystem } from './store/useSystemStore';
import { IdentityHeader } from './components/layout/IdentityHeader';
import { PipelineNav } from './components/layout/PipelineNav';
import { OverviewStage } from './components/views/OverviewStage';
import { SystemsStage } from './components/views/SystemsStage';
import { StagePlaceholder } from './components/views/StagePlaceholder';
import { TelemetryTerminal } from './components/terminal/TelemetryTerminal';
import { ProjectInspector } from './components/inspector/ProjectInspector';
import { cx } from './lib/ui';

/** Which view each stage shows. Real views replace the placeholders checkpoint by checkpoint. */
function StageView({ stage }: { stage: StageId }) {
  switch (stage) {
    case 'overview':
      return <OverviewStage />;
    case 'systems':
      return <SystemsStage />;
    case 'stack':
      return <StagePlaceholder stage="stack" title="Stack matrix" arrivesIn="a later checkpoint" />;
    case 'dispatch':
      return <StagePlaceholder stage="dispatch" title="Open a channel" arrivesIn="a later checkpoint" />;
  }
}

function Shell() {
  const { state } = useSystem();

  return (
    <>
      <a href="#main" className="skip-link frame press label inline-flex min-h-11 items-center px-4">
        Skip to content
      </a>

      {/* Bottom padding = terminal height + breathing room, so the docked terminal never covers content. */}
      <div
        className={cx(
          'mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 px-4 pt-6 md:px-6 md:pt-8',
          state.terminalOpen ? 'pb-[calc(min(40dvh,16rem)+8rem)]' : 'pb-20',
        )}
      >
        <IdentityHeader />
        <PipelineNav />

        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          <section
            id={STAGE_PANEL_ID}
            role="tabpanel"
            aria-labelledby={tabId(state.stage)}
            tabIndex={0}
            className="focus-visible:outline-offset-8"
          >
            {/* mode="wait": the old stage fades out before the new one comes in, so they never overlap */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state.stage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={SNAP}
              >
                <StageView stage={state.stage} />
              </motion.div>
            </AnimatePresence>
          </section>
        </main>

        <footer className="label flex flex-wrap justify-between gap-2 border-t-2 border-line pt-4 text-muted">
          <span>
            © {new Date().getFullYear()} {PROFILE.name}
          </span>
          <span>Vite / React / Tailwind</span>
        </footer>
      </div>

      <TelemetryTerminal />
      <ProjectInspector />
    </>
  );
}

export default function App() {
  return (
    // reducedMotion="user": Motion skips transform animations when the OS asks for reduced motion
    <MotionConfig reducedMotion="user">
      <SystemProvider>
        <Shell />
      </SystemProvider>
    </MotionConfig>
  );
}
