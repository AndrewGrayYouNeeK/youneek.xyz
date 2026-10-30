const SELF_REPO = 'youneek.xyz';
export const PRODUCTION_ORIGIN = 'https://youneek.xyz';

export function isEmbedded() {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function currentOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return PRODUCTION_ORIGIN;
}

const BLOCKED_DEMO_HOSTS = new Set(['death-terminal-green.vercel.app']);

export function isBlockedDemoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    return BLOCKED_DEMO_HOSTS.has(new URL(url).hostname);
  } catch {
    return url.includes('death-terminal-green.vercel.app');
  }
}

/** Point this site at the origin you are actually on, not a dead Vercel URL. */
export function resolveDemoUrl(repo, origin = currentOrigin()) {
  if (!repo) return '';
  if (isBlockedDemoUrl(repo.demoUrl)) return '';
  if (repo.repoName === SELF_REPO) {
    const base = origin || PRODUCTION_ORIGIN;
    return `${base.replace(/\/$/, '')}/?embed=1`;
  }
  return repo.demoUrl || repo.sites?.[0]?.url || '';
}

export function hostLabel(url) {
  if (!url) return '';
  try {
    return new URL(url).host;
  } catch {
    return String(url).replace(/^https?:\/\//, '');
  }
}

export function isFragileDemo(url) {
  return typeof url === 'string' && url.includes('vercel.app');
}

export function withLiveUrls(repos, origin) {
  return (repos || []).map((repo) => ({
    ...repo,
    demoUrl: resolveDemoUrl(repo, origin),
  }));
}
