#!/usr/bin/env node
/**
 * Refresh src/data/repos.js from the GitHub API.
 * Requires GITHUB_TOKEN (or GH_TOKEN) with public_repo / Contents read.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isBlockedDemoUrl } from '../src/lib/live-demos.js';
import { USED_ARTIFACTS_LIVE_URL } from '../src/data/used-artifacts.js';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token) {
  console.error('Set GITHUB_TOKEN (or GH_TOKEN) before running sync-repos.');
  process.exit(1);
}

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
const CURATED = {
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
  'used-artifacts': {
    title: 'Used Artifacts',
    subtitle: 'Artifacts with a paper trail.',
    description:
      'Marketplace for authenticated historic artifacts. Sworn provenance, ID-verified sellers, escrow payments, and partner authentication.',
    stack: ['TypeScript', 'Next.js', 'Stripe', 'Postgres'],
    accent: 'yellow',
    imageUrl: '/projects/used-artifacts.svg',
    palette: {
      accent: '#E6B15A',
      background: '#120E0A',
      text: '#F4E8D4',
    },
  },
};

function curatedOverride(repoName) {
  const curated = CURATED[repoName];
  if (!curated) return null;
  if (repoName !== 'used-artifacts') return curated;
  const demoUrl = String(USED_ARTIFACTS_LIVE_URL || '').trim();
  return {
    ...curated,
    demoUrl,
    status: demoUrl ? undefined : 'COMING SOON',
  };
}

function titleize(name) {
  return name.trim().replace(/^[-_]+|[-_]+$/g, '').replace(/[-_]+/g, ' ');
}

function fixUrl(u) {
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

function hostedAppBrand() {
  const match = HOSTED_APP_DESCRIPTION_PREFIX.source.match(/[A-Za-z]+\d+/);
  return match ? match[0].toLowerCase() : '';
}

function stripHostedAppPrefix(text) {
  return String(text || '').replace(HOSTED_APP_DESCRIPTION_PREFIX, '').trim();
}

function descriptionFor(repo) {
  const fallback = `GitHub project by Andrew Gray — ${repo.name}`;
  const stripped = stripHostedAppPrefix(repo.description || fallback);
  return (stripped || fallback).slice(0, 220);
}

function isHostedAppDemo(url) {
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

function demoUrlFor(repo) {
  if (repo.name === 'youneek.xyz') return 'https://youneek.xyz';
  const url = fixUrl(repo.homepage);
  return isHostedAppDemo(url) ? '' : url;
}

const res = await fetch(
  'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner',
  {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'youneek-xyz-sync-repos',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  }
);
if (!res.ok) {
  console.error('GitHub API error', res.status, await res.text());
  process.exit(1);
}

const repos = await res.json();
let i = 0;
const out = [];
for (const repo of repos) {
  if (repo.fork || repo.private) continue;
  i += 1;
  const lang = repo.language || 'Code';
  const accent = LANG_ACCENT[lang] || ACCENTS[(i - 1) % ACCENTS.length];
  const stack = [lang];
  for (const t of repo.topics || []) {
    if (!stack.includes(t) && stack.length < 4) stack.push(t);
  }
  let demoUrl = demoUrlFor(repo);
  if (isBlockedDemoUrl(demoUrl)) demoUrl = '';
  const row = {
    title: titleize(repo.name),
    repoName: repo.name,
    tag: `// ${String(i).padStart(3, '0')}`,
    subtitle: lang === 'Code' ? 'Repository' : lang,
    description: descriptionFor(repo),
    stack,
    accent,
    link: repo.html_url,
    demoUrl,
    stars: repo.stargazers_count || 0,
    updated: (repo.pushed_at || repo.updated_at || '').slice(0, 10),
  };
  const curated = curatedOverride(repo.name);
  if (curated) Object.assign(row, curated);
  if (isBlockedDemoUrl(row.demoUrl) || isBlockedDemoUrl(row.downloadUrl) || isBlockedDemoUrl(row.link)) {
    throw new Error(`Refusing to write a blocked demo host for ${repo.name}`);
  }
  out.push(row);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'src/data/repos.js');
const body = `// Auto-sourced from github.com/AndrewGrayYouNeeK — regenerate with node scripts/sync-repos.mjs
export const REPOS = ${JSON.stringify(out, null, 2)};

function demoScore(r) {
  const u = r.demoUrl || '';
  if (!u) return -1;
  let s = u.includes('vercel.app') ? 1 : 10;
  if (r.repoName === 'youneek.xyz') s += 8;
  if (r.stars) s += Math.min(r.stars, 3);
  return s;
}

export const LIVE_DEMOS = REPOS
  .filter((r) => {
    const u = r.demoUrl || '';
    if (!u) return false;
    if (u.includes('death-terminal-green.vercel.app')) return false;
    return true;
  })
  .slice()
  .sort((a, b) => demoScore(b) - demoScore(a));
`;
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, body);
console.log(`Wrote ${out.length} repos to ${target}`);
