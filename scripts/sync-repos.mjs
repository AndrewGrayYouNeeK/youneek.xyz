#!/usr/bin/env node
/**
 * Refresh src/data/repos.js from every public, non-fork repo under AndrewGrayYouNeeK.
 * A token is optional. Public repo listing works anonymously; GITHUB_TOKEN or GH_TOKEN
 * raises the rate limit when GitHub Actions runs this before deploy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isBlockedDemoUrl } from '../src/lib/live-demos.js';
import {
  OWNER,
  buildRepoRecord,
  chooseDemoUrl,
  isHostedAppDemo,
  recordMentionsHostedApp,
  skipReason,
} from './repo-sync-lib.mjs';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'youneek-xyz-sync-repos',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (token) headers.Authorization = `Bearer ${token}`;

function nextPage(linkHeader) {
  if (!linkHeader) return '';
  const part = linkHeader.split(',').find((entry) => entry.includes('rel="next"'));
  if (!part) return '';
  const match = part.match(/<([^>]+)>/);
  return match ? match[1] : '';
}

async function fetchJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status} for ${url}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  return { data, link: res.headers.get('link') };
}

async function fetchAllRepos() {
  const repos = [];
  let url = `https://api.github.com/users/${OWNER}/repos?per_page=100&sort=updated&type=owner`;
  while (url) {
    const { data, link } = await fetchJson(url);
    if (!Array.isArray(data)) {
      throw new Error(`GitHub API returned a non-list for ${url}`);
    }
    repos.push(...data);
    url = nextPage(link);
  }
  return repos;
}

async function pagesHtmlUrl(repo) {
  const { data } = await fetchJson(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(repo.name)}/pages`);
  return data.html_url || '';
}

const repos = await fetchAllRepos();
const skipped = [];
const out = [];
let index = 0;

for (const repo of repos) {
  const reason = skipReason(repo);
  if (reason) {
    skipped.push({ name: repo.name || '(unnamed)', reason });
    continue;
  }
  index += 1;
  const demoUrl = await chooseDemoUrl(repo, {
    isBlockedDemoUrl,
    pagesHtmlUrl: repo.has_pages ? pagesHtmlUrl : undefined,
  });
  const row = buildRepoRecord(repo, index, demoUrl);
  if (
    isBlockedDemoUrl(row.demoUrl) ||
    isBlockedDemoUrl(row.downloadUrl) ||
    isBlockedDemoUrl(row.link) ||
    isHostedAppDemo(row.demoUrl) ||
    isHostedAppDemo(row.downloadUrl)
  ) {
    throw new Error(`Refusing to write a blocked demo host for ${repo.name}`);
  }
  if (recordMentionsHostedApp(row)) {
    throw new Error(`Refusing to write a hosted-app brand mention for ${repo.name}`);
  }
  out.push(row);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'src/data/repos.js');
const body = `// Auto-sourced from github.com/${OWNER} — regenerate with node scripts/sync-repos.mjs
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
for (const item of skipped) {
  console.log(`skipped ${item.name}: ${item.reason}`);
}
