import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { PROFILE } from './data/profile';
import { SNAP } from './lib/motion';
import { STAGE_PANEL_ID, tabId, type StageId } from './lib/stages';
import { SystemProvider, useSystem } from './store/useSystemStore';
import { IdentityHeader } from './components/layout/IdentityHeader';
import { PipelineNav } from './components/layout/PipelineNav';
import { OverviewStage } from './components/views/OverviewStage';
import { StagePlaceholder } from './components/views/StagePlaceholder';

/** Which view each stage shows. Real views replace the placeholders checkpoint by checkpoint. */
function StageView({ stage }: { stage: StageId }) {
  switch (stage) {
    case 'overview':
      return <OverviewStage />;
    case 'systems':
      return <StagePlaceholder stage="systems" title="Project graph" arrivesIn="a later checkpoint" />;
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

      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
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
