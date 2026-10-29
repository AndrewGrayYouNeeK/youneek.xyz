#!/usr/bin/env node
/**
 * Build src/data/repos.js from the public GitHub API plus sites.config.json.
 * Forks, template repositories, and empty repositories are omitted.
 * A Visit site link is written only after scripts/verify-url.mjs marks it live.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkUrl } from './verify-url.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'sites.config.json');
const target = path.join(root, 'src/data/repos.js');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const owner = config.owner;
const skipRepos = new Set(config.skipRepos || []);
const denyHosts = new Set((config.denyHosts || []).map((host) => host.toLowerCase()));
const HOSTED_APP_DESCRIPTION_PREFIX = /^Base44 App:\s*/i;

function titleize(name) {
  return name
    .replace(/YNK\d+$/i, '')
    .replace(/[-_]+$/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

function isTemplate(repo) {
  if (repo.is_template) return true;
  if (/template/i.test(repo.name)) return true;
  if (skipRepos.has(repo.name)) return true;
  return false;
}

function isEmpty(repo) {
  return !repo.size || repo.size < 2;
}

function stripHostedAppPrefix(text) {
  return String(text || '').replace(HOSTED_APP_DESCRIPTION_PREFIX, '').trim();
}

function cleanDescription(text) {
  const cleaned = stripHostedAppPrefix(text).replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 220) return cleaned;
  const sliced = cleaned.slice(0, 220);
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > 160 ? sliced.slice(0, lastSpace) : sliced).replace(/[.,;:]+$/, '');
}

function readmeBlurb(markdown) {
  const lines = String(markdown || '').split('\n');
  const parts = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (parts.length) break;
      continue;
    }
    if (
      trimmed.startsWith('#') ||
      trimmed.startsWith('![') ||
      trimmed.startsWith('<') ||
      trimmed.startsWith('|') ||
      trimmed.startsWith('```') ||
      trimmed.startsWith('[![') ||
      trimmed.startsWith('---')
    ) {
      continue;
    }
    const prose = trimmed.replace(/^>\s?/, '').replace(/\[(.*?)\]\([^)]*\)/g, '$1');
    if (!prose) continue;
    parts.push(prose);
    if (parts.join(' ').length > 180) break;
  }
  return cleanDescription(parts.join(' '));
}

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return '';
  }
}

async function fetchRepos() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'youneek-xyz-sync-repos',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const repos = [];
  for (let page = 1; page <= 10; page += 1) {
    const response = await fetch(
      `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}&sort=updated&type=owner`,
      { headers }
    );
    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`);
    }
    const batch = await response.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

async function fetchReadme(name) {
  const response = await fetch(`https://raw.githubusercontent.com/${owner}/${name}/HEAD/README.md`, {
    headers: { 'User-Agent': 'youneek-xyz-sync-repos' },
  });
  if (!response.ok) return '';
  return response.text();
}

function descriptionFor(repo, override, readme) {
  if (override) return cleanDescription(override);
  const fromGitHub = cleanDescription(repo.description || '');
  const title = titleize(repo.name);
  if (fromGitHub.length >= 24 && fromGitHub.toLowerCase() !== title.toLowerCase()) {
    return fromGitHub;
  }
  const fromReadme = readmeBlurb(readme);
  if (fromReadme.length >= 24) return fromReadme;
  if (fromGitHub) return fromGitHub;
  return `Public repository ${repo.name}.`;
}

async function verifiedSites(urls) {
  const sites = [];
  for (const candidate of urls || []) {
    let parsed;
    try {
      parsed = new URL(candidate);
    } catch {
      console.log(`  skip ${candidate} (not a URL)`);
      continue;
    }
    if (parsed.protocol !== 'https:') {
      console.log(`  skip ${candidate} (https only)`);
      continue;
    }
    if (denyHosts.has(parsed.hostname.toLowerCase())) {
      console.log(`  skip ${candidate} (denied host)`);
      continue;
    }
    let result = await checkUrl(candidate);
    if (result.verdict === 'inconclusive') {
      result = await checkUrl(candidate);
    }
    console.log(`  ${result.verdict} ${result.status || '-'} ${candidate}`);
    if (result.verdict === 'live') {
      sites.push({ url: candidate, label: parsed.host });
    }
  }
  return sites;
}

async function main() {
  let repos;
  try {
    repos = await fetchRepos();
  } catch (error) {
    if (fs.existsSync(target)) {
      console.warn(`GitHub fetch failed (${error instanceof Error ? error.message : error}). Keeping ${target}.`);
      return;
    }
    throw error;
  }

  const kept = [];
  for (const repo of repos) {
    if (repo.fork) {
      console.log(`skip fork ${repo.name}`);
      continue;
    }
    if (isTemplate(repo)) {
      console.log(`skip template ${repo.name}`);
      continue;
    }
    if (isEmpty(repo)) {
      console.log(`skip empty ${repo.name}`);
      continue;
    }
    kept.push(repo);
  }

  const out = [];
  for (const repo of kept) {
    const entry = config.repos?.[repo.name] || {};
    const githubDescription = cleanDescription(repo.description || '');
    const title = entry.title || titleize(repo.name);
    let readme = '';
    if (!entry.description && githubDescription.length < 24) {
      readme = await fetchReadme(repo.name);
    }
    console.log(`check ${repo.name}`);
    const sites = await verifiedSites(entry.sites);
    out.push({
      title,
      repoName: repo.name,
      description: descriptionFor(repo, entry.description, readme),
      language: repo.language || 'Code',
      link: repo.html_url,
      sites,
      image: entry.image || '',
      stars: repo.stargazers_count || 0,
      updated: (repo.pushed_at || repo.updated_at || '').slice(0, 10),
    });
  }

  out.sort((a, b) => {
    const live = Number(b.sites.length > 0) - Number(a.sites.length > 0);
    if (live !== 0) return live;
    return b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title);
  });

  const body = `// Generated by scripts/sync-repos.mjs from sites.config.json and the GitHub API.
// Edit sites.config.json to add a repository site, then run npm run sync:repos.
export const REPOS = ${JSON.stringify(out, null, 2)};

export const LIVE_DEMOS = REPOS.filter((repo) => repo.sites.length > 0);
`;
  fs.writeFileSync(target, body);
  const linked = out.filter((repo) => repo.sites.length > 0);
  console.log(`Wrote ${out.length} repos (${linked.length} with a live site) to ${target}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
