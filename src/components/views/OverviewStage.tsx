import { StageHeader } from './StageHeader';
import { AwardCard } from './overview/AwardCard';
import { IdentityBriefCard } from './overview/IdentityBriefCard';
import { SystemMapCard } from './overview/SystemMapCard';
import { CoreCubeCard } from '../accent/CoreCube';

/**
 * 01 / OVERVIEW: the homepage.
 * Three cards, each taking a `className` so this component decides where they sit:
 *   <IdentityBriefCard />  who:   the verified facts + availability
 *   <AwardCard />          proof: the RMIT hackathon win
 *   <SystemMapCard />      what:  project/tool counts + buttons into Systems and Dispatch
 */
export function OverviewStage() {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <StageHeader stage="overview" title="System overview" />
      <IdentityBriefCard 
        className="md:col-span-7"/>
      <AwardCard 
        className="md:col-span-5"/>
      <SystemMapCard 
        className="md:col-span-7"/>
      <CoreCubeCard 
        className="md:col-span-5"/>
      </div>
  );
}
