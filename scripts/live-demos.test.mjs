import assert from 'node:assert/strict';
import { LIVE_DEMOS, REPOS } from '../src/data/repos.js';
import { resolveUsedArtifacts } from '../src/data/used-artifacts.js';
import {
  hostLabel,
  isBlockedDemoUrl,
  isFragileDemo,
  PRODUCTION_ORIGIN,
  resolveDemoUrl,
  withLiveUrls,
} from '../src/lib/live-demos.js';

const self = { repoName: 'youneek.xyz', demoUrl: 'https://youneekxyz.vercel.app' };
const other = { repoName: 'roll10000', demoUrl: 'https://roll10000.com' };

assert.equal(resolveDemoUrl(self, 'http://127.0.0.1:4173'), 'http://127.0.0.1:4173/?embed=1');
assert.equal(resolveDemoUrl(self, PRODUCTION_ORIGIN), 'https://youneek.xyz/?embed=1');
assert.equal(resolveDemoUrl(other), 'https://roll10000.com');
assert.equal(hostLabel('https://youneek.xyz/?embed=1'), 'youneek.xyz');
assert.equal(isFragileDemo('https://foo.vercel.app'), true);
assert.equal(isFragileDemo('https://youneek.xyz'), false);

const live = withLiveUrls([self, other], 'https://youneek.xyz');
assert.equal(live[0].demoUrl, 'https://youneek.xyz/?embed=1');
assert.equal(live[1].demoUrl, 'https://roll10000.com');

const blocked = 'https://death-terminal-green.vercel.app';
assert.equal(isBlockedDemoUrl(blocked), true);
assert.equal(isBlockedDemoUrl('https://andrewgrayyouneek.github.io/Death-terminal-/'), false);
assert.equal(resolveDemoUrl({ repoName: 'Death-terminal-', demoUrl: blocked }), '');

const names = REPOS.map((repo) => repo.repoName);
const deathIndex = names.indexOf('Death-terminal-');
const death = REPOS[deathIndex];
assert.ok(death);
assert.equal(names[deathIndex - 1], 'YouNeeKTimeTheFinalBoss');
assert.equal(names[deathIndex + 1], 'Cloudripper');
assert.equal(death.title, 'YouNeeK Death Terminal');
assert.equal(death.subtitle, 'A brutalist, GPU-accelerated terminal with AI-native command workflows.');
assert.equal(
  death.description,
  'AI autocomplete with Grok/Ollama, Vulkan GPU rendering, built-in SSH, Lua themes and plugins, tabs and splits. Mac, Windows, and Linux.'
);
assert.equal(death.link, 'https://github.com/AndrewGrayYouNeeK/Death-terminal-');
assert.equal(death.downloadUrl, 'https://andrewgrayyouneek.github.io/Death-terminal-/');
assert.equal(death.demoUrl, '');
assert.equal(death.imageUrl, '/projects/death-terminal.svg');
assert.deepEqual(death.palette, { accent: '#FF0033', background: '#000000', text: '#E0E0E0' });
assert.equal(JSON.stringify({ REPOS, LIVE_DEMOS }).includes('death-terminal-green.vercel.app'), false);
assert.equal(LIVE_DEMOS.some((repo) => repo.repoName === 'Death-terminal-'), false);

const artifacts = REPOS.find((repo) => repo.repoName === 'used-artifacts');
assert.ok(artifacts);
assert.equal(artifacts.title, 'Used Artifacts');
assert.equal(artifacts.subtitle, 'Artifacts with a paper trail.');
assert.equal(
  artifacts.description,
  'Marketplace for authenticated historic artifacts. Sworn provenance, ID-verified sellers, escrow payments, and partner authentication.'
);
assert.equal(artifacts.link, 'https://github.com/AndrewGrayYouNeeK/used-artifacts');
assert.equal(artifacts.demoUrl, '');
assert.equal(artifacts.status, 'COMING SOON');
assert.equal(artifacts.imageUrl, '/projects/used-artifacts.svg');
assert.deepEqual(artifacts.palette, { accent: '#E6B15A', background: '#120E0A', text: '#F4E8D4' });
assert.equal(LIVE_DEMOS.some((repo) => repo.repoName === 'used-artifacts'), false);
assert.equal(JSON.stringify(REPOS).includes('used-artifacts.vercel.app'), false);

const hidden = resolveUsedArtifacts(
  { ...artifacts, demoUrl: 'https://used-artifacts.vercel.app' },
  ''
);
assert.equal(hidden.demoUrl, '');
assert.equal(hidden.status, 'COMING SOON');
const published = resolveUsedArtifacts(artifacts, 'https://usedartifacts.example');
assert.equal(published.demoUrl, 'https://usedartifacts.example');
assert.equal(published.status, undefined);
assert.equal(resolveUsedArtifacts(death).title, death.title);

console.log('live-demos tests passed');
