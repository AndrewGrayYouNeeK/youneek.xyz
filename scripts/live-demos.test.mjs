import assert from 'node:assert/strict';
import { LIVE_DEMOS, REPOS } from '../src/data/repos.js';
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
assert.equal(names[deathIndex + 1], 'youneek-satellite-tracker');
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

const cloud = REPOS[0];
assert.equal(cloud.repoName, 'Cloudripper');
assert.equal(cloud.title, 'CloudRipper');
assert.equal(
  cloud.subtitle,
  'One CLI for cloud waste, real spend, and safe chaos tests, across AWS, GCP, and Azure.'
);
assert.equal(
  cloud.description,
  'Open-source CLI that finds idle cloud resources and pulls real spend from billing APIs. It applies fixes only after confirmation and runs blast-radius-limited chaos tests.'
);
assert.deepEqual(cloud.stack, ['Go', 'AWS', 'GCP', 'Azure', 'FinOps', 'Chaos Engineering']);
assert.equal(cloud.link, 'https://github.com/AndrewGrayYouNeeK/Cloudripper');
assert.equal(cloud.websiteUrl, 'https://cloudripper.youneek.dev');
assert.equal(cloud.demoUrl, '');
assert.equal(isBlockedDemoUrl('https://cloudripper.vercel.app'), true);
assert.equal(isBlockedDemoUrl('https://cloudripper.youneek.dev'), false);
assert.equal(JSON.stringify({ REPOS, LIVE_DEMOS }).includes('cloudripper.vercel.app'), false);
assert.equal(LIVE_DEMOS.some((repo) => repo.repoName === 'Cloudripper'), false);
assert.equal(names.filter((name) => name === 'Cloudripper').length, 1);

console.log('live-demos tests passed');
