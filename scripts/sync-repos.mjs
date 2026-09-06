#!/usr/bin/env node
/**
 * Refresh src/data/repos.js from the GitHub API.
 * Requires GITHUB_TOKEN (or GH_TOKEN) with public_repo / Contents read.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  out.push({
    title: titleize(repo.name),
    repoName: repo.name,
    tag: `// ${String(i).padStart(3, '0')}`,
    subtitle: lang === 'Code' ? 'Repository' : lang,
    description: (repo.description || `GitHub project by Andrew Gray — ${repo.name}`).slice(0, 220),
    stack,
    accent,
    link: repo.html_url,
    demoUrl:
      repo.name === 'youneek.xyz'
        ? 'https://youneek.xyz'
        : fixUrl(repo.homepage),
    stars: repo.stargazers_count || 0,
    updated: (repo.pushed_at || repo.updated_at || '').slice(0, 10),
  });
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'src/data/repos.js');
const body = `// Auto-sourced from github.com/AndrewGrayYouNeeK — regenerate with node scripts/sync-repos.mjs
export const REPOS = ${JSON.stringify(out, null, 2)};

function demoScore(r) {
  const u = r.demoUrl || '';
  if (!u || u.includes('base44.app')) return -1;
  let s = u.includes('vercel.app') ? 1 : 10;
  if (r.repoName === 'youneek.xyz') s += 8;
  if (r.stars) s += Math.min(r.stars, 3);
  return s;
}

export const LIVE_DEMOS = REPOS
  .filter((r) => r.demoUrl && !r.demoUrl.includes('base44.app'))
  .slice()
  .sort((a, b) => demoScore(b) - demoScore(a));
`;
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, body);
console.log(`Wrote ${out.length} repos to ${target}`);
