/**
 * Deep links without a router: the URL query holds the stage and the inspected project.
 *
 *   /                                → overview, nothing inspected
 *   ?stage=systems                   → systems stage
 *   ?stage=systems&node=zone-ming    → systems stage, Zone-Ming inspector open
 *
 * Anything else in the URL is untrusted input, so it is validated against the
 * known stages and project slugs. Unknown values fall back to the defaults.
 */
import { findProject } from '../data/projects';
import { isStageId, type StageId } from './stages';

export interface UrlState {
  stage: StageId;
  slug: string | null;
}

export function readUrlState(search: string): UrlState {
  const params = new URLSearchParams(search);
  const stage = params.get('stage');
  const node = params.get('node');

  return {
    stage: isStageId(stage) ? stage : 'overview',
    slug: node !== null && findProject(node) ? node : null,
  };
}

/** The canonical query string for a state. Overview is the default, so it is left out. */
export function buildSearch(state: UrlState): string {
  const params = new URLSearchParams();
  if (state.stage !== 'overview') params.set('stage', state.stage);
  if (state.slug) params.set('node', state.slug);
  const query = params.toString();
  return query ? `?${query}` : '';
}

/**
 * Write the state into the address bar.
 * 'push' adds a history entry (Back returns to the previous stage); 'replace' doesn't.
 * Does nothing when the URL already matches, so it is safe to call after every render.
 */
export function writeUrlState(state: UrlState, mode: 'push' | 'replace'): void {
  const search = buildSearch(state);
  if (search === window.location.search) return;

  const url = `${window.location.pathname}${search}${window.location.hash}`;
  if (mode === 'push') window.history.pushState(null, '', url);
  else window.history.replaceState(null, '', url);
}
