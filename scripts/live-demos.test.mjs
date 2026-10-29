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
const death = REPOS.find((repo) => repo.repoName === 'Death-terminal-');
assert.ok(death);
assert.equal(names.includes('Projectpaperclip'), false);
for (const repoName of [
  'youneekproradarBABY',
  '3i-atlas-the-gameYNK',
  'lilly-s-appYNK222',
  'youneek-pro-radarYNK222',
  'YouNeeK-Dashboard',
  'remnant',
  'bison-earth-plum-bird',
  'nextjs-with-supabase',
  'fastapi',
  'apex-controlYNK222',
]) {
  assert.ok(names.includes(repoName), `missing ${repoName}`);
}
assert.equal(new Set(names).size, names.length);
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

for (const repo of REPOS) {
  assert.equal(repo.link, `https://github.com/AndrewGrayYouNeeK/${repo.repoName}`);
  assert.equal(isBlockedDemoUrl(repo.demoUrl), false);
  assert.equal(isBlockedDemoUrl(repo.downloadUrl), false);
}
const byName = Object.fromEntries(REPOS.map((repo) => [repo.repoName, repo]));
assert.equal(byName['youneek.xyz'].demoUrl, 'https://youneek.xyz');
assert.equal(byName['youneek.xyz'].description, 'YouNeeK.xyz');
assert.equal(byName['youneek-satellite-tracker'].demoUrl, '');
assert.equal(byName['unique-sky'].description, 'Unique Sky');
assert.equal(byName['unique-sky'].demoUrl, 'https://unique-sky.vercel.app');
assert.equal(byName['YouNeeKTimeTheFinalBoss'].demoUrl, 'https://youneektime.com');
assert.equal(byName['10000TheFinalBoss'].demoUrl, 'https://roll10000.com');
assert.equal(byName['YNKAIRTRAFFICGAME'].description, 'Air Traffic Controller (The Game)');

console.log('live-demos tests passed');
