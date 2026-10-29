/** Repo name for the Used Artifacts marketplace card. */
export const USED_ARTIFACTS_REPO = 'used-artifacts';

/**
 * Public URL for Used Artifacts.
 * Leave this empty until the marketplace is deployed. The card then shows
 * COMING SOON and does not link a live demo. Set it to the live origin
 * when the site ships — this is the only place that URL should change.
 */
export const USED_ARTIFACTS_LIVE_URL = '';

/**
 * Apply USED_ARTIFACTS_LIVE_URL to the marketplace card.
 * Other projects are returned unchanged.
 */
export function resolveUsedArtifacts(project, liveUrl = USED_ARTIFACTS_LIVE_URL) {
  if (!project || project.repoName !== USED_ARTIFACTS_REPO) return project;
  const demoUrl = String(liveUrl || '').trim();
  if (!demoUrl) {
    return { ...project, demoUrl: '', status: 'COMING SOON' };
  }
  const next = { ...project, demoUrl };
  delete next.status;
  return next;
}
