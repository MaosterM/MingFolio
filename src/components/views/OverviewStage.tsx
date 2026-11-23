import { StageHeader } from './StageHeader';
import { AwardCard } from './overview/AwardCard';
import { IdentityBriefCard } from './overview/IdentityBriefCard';
import { SystemMapCard } from './overview/SystemMapCard';
import { CoreCubeCard } from '../accent/CoreCube';

/**
 * 01 / OVERVIEW: the homepage.
 * A heading, then four cards in a 12-column grid (7 + 5 per row):
 *   <IdentityBriefCard />  who:   the verified facts + availability
 *   <AwardCard />          proof: the RMIT hackathon win
 *   <SystemMapCard />      what:  project/tool counts + buttons into Systems and Dispatch
 *   <CoreCubeCard />       the 3D domain cube (trial accent)
 */
export function OverviewStage() {
  return (
    <div className="flex flex-col gap-6">
      <StageHeader stage="overview" title="System overview" />

      <div className="grid gap-6 md:grid-cols-12">
        <IdentityBriefCard className="md:col-span-7" />
        <AwardCard className="md:col-span-5" />
        <SystemMapCard className="md:col-span-7" />
        <CoreCubeCard className="md:col-span-5" />
      </div>
    </div>
  );
}