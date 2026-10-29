/**
 * Pure helpers for turning GitHub repo payloads into portfolio cards.
 * The sync script performs the HTTP calls; this module stays free of I/O
 * so the card rules can be tested without a token.
 */
import { isBlockedDemoUrl as defaultIsBlockedDemoUrl } from '../src/lib/live-demos.js';

export const OWNER = 'AndrewGrayYouNeeK';

const LANG_ACCENT = {
  JavaScript: 'cyan',
  TypeScript: 'magenta',
  Python: 'green',
  Go: 'yellow',
  Zig: 'red',
  HTML: 'purple',
  Rust: 'yellow',
};
const ACCENTS = ['cyan', 'magenta', 'green', 'yellow', 'purple', 'red'];

/** Hand-written cards. Applied after the GitHub pull so a sync cannot restore a blocked homepage. */
export const CURATED = {
  'Death-terminal-': {
    title: 'YouNeeK Death Terminal',
    subtitle: 'A brutalist, GPU-accelerated terminal with AI-native command workflows.',
    description:
      'AI autocomplete with Grok/Ollama, Vulkan GPU rendering, built-in SSH, Lua themes and plugins, tabs and splits. Mac, Windows, and Linux.',
    stack: ['Zig', 'Vulkan', 'Lua', 'SSH'],
    accent: 'red',
    demoUrl: '',
    downloadUrl: 'https://andrewgrayyouneek.github.io/Death-terminal-/',
    imageUrl: '/projects/death-terminal.svg',
    palette: {
      accent: '#FF0033',
      background: '#000000',
      text: '#E0E0E0',
    },
  },
};

export function titleize(name) {
  return String(name || '').trim().replace(/^[-_]+|[-_]+$/g, '').replace(/[-_]+/g, ' ');
}

export function fixUrl(u) {
  if (!u) return '';
  let cleaned = String(u).replace(/\\+/g, '/').trim();
  cleaned = cleaned.replace(/^https?:\/+(https?:\/+)*/i, (m) => {
    return m.toLowerCase().includes('https') ? 'https://' : 'http://';
  });
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned.replace(/^\/+/, '')}`;
  }
  return cleaned.replace(/^(https?:\/)\/+/i, '$1/');
}

// GitHub still labels some descriptions with the retired hosted-app exporter.
// The same label identifies that product's *.app demo hosts, which are not stored.
const HOSTED_APP_DESCRIPTION_PREFIX = /^Base44 App:\s*/i;

export function hostedAppBrand() {
  const match = HOSTED_APP_DESCRIPTION_PREFIX.source.match(/[A-Za-z]+\d+/);
  return match ? match[0].toLowerCase() : '';
}

export function stripHostedAppPrefix(text) {
  const brand = hostedAppBrand();
  let cleaned = String(text || '').replace(HOSTED_APP_DESCRIPTION_PREFIX, '').trim();
  if (brand) {
    cleaned = cleaned.replace(new RegExp(brand, 'ig'), ' ').replace(/\s{2,}/g, ' ').trim();
  }
  return cleaned;
}

export function descriptionFor(repo) {
  const fallback = `GitHub project by Andrew Gray — ${repo.name}`;
  const stripped = stripHostedAppPrefix(repo.description || fallback);
  return (stripped || fallback).slice(0, 220);
}

export function isHostedAppDemo(url) {
  const brand = hostedAppBrand();
  if (!brand || !url) return false;
  let host = '';
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    host = String(url).toLowerCase();
  }
  return host === `${brand}.app` || host.endsWith(`.${brand}.app`);
}

export function githubPagesUrl(owner, repoName) {
  const host = `${String(owner).toLowerCase()}.github.io`;
  if (String(repoName).toLowerCase() === host) return `https://${host}/`;
  return `https://${host}/${repoName}/`;
}

function sanitizeDemoUrl(url, isBlockedDemoUrl) {
  if (!url) return '';
  if (isHostedAppDemo(url)) return '';
  if (isBlockedDemoUrl(url)) return '';
  return url;
}

/**
 * Live demo is the repo homepage when it is a real site.
 * GitHub Pages is the fallback when Pages is enabled and the homepage is missing or blocked.
 */
export async function chooseDemoUrl(repo, options = {}) {
  const isBlockedDemoUrl = options.isBlockedDemoUrl || defaultIsBlockedDemoUrl;
  if (repo.name === 'youneek.xyz') return 'https://youneek.xyz';
  const homepage = sanitizeDemoUrl(fixUrl(repo.homepage), isBlockedDemoUrl);
  if (homepage) return homepage;
  if (!repo.has_pages) return '';
  let pages = githubPagesUrl(OWNER, repo.name);
  if (options.pagesHtmlUrl) {
    try {
      const fetched = await options.pagesHtmlUrl(repo);
      if (fetched) pages = fetched;
    } catch {
      // The constructed project-pages URL still points at the site if the API blips.
    }
  }
  return sanitizeDemoUrl(fixUrl(pages), isBlockedDemoUrl);
}

export function skipReason(repo) {
  if (!repo || !repo.name) return 'missing name';
  if (repo.private || repo.visibility === 'private') return 'private';
  if (repo.fork) return 'fork';
  return '';
}

export function buildRepoRecord(repo, index, demoUrl) {
  const lang = repo.language || 'Code';
  const accent = LANG_ACCENT[lang] || ACCENTS[(index - 1) % ACCENTS.length];
  const stack = [lang];
  for (const topic of repo.topics || []) {
    if (!stack.includes(topic) && stack.length < 4) stack.push(topic);
  }
  const row = {
    title: titleize(repo.name),
    repoName: repo.name,
    tag: `// ${String(index).padStart(3, '0')}`,
    subtitle: lang === 'Code' ? 'Repository' : lang,
    description: descriptionFor(repo),
    stack,
    accent,
    link: repo.html_url || `https://github.com/${OWNER}/${repo.name}`,
    demoUrl,
    stars: repo.stargazers_count || 0,
    updated: (repo.pushed_at || repo.updated_at || '').slice(0, 10),
  };
  const curated = CURATED[repo.name];
  if (curated) Object.assign(row, curated);
  return row;
}

export function recordMentionsHostedApp(row) {
  const brand = hostedAppBrand();
  if (!brand) return false;
  return JSON.stringify(row).toLowerCase().includes(brand);
}
