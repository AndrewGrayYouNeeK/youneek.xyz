import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LIVE_DEMOS, REPOS } from '../src/data/repos.js';
import { classifyResponse } from './verify-url.mjs';
import { selectRecordsToReplace } from './repair-apex-dns.mjs';
import config from '../sites.config.json' with { type: 'json' };

assert.equal(
  classifyResponse({
    status: 403,
    finalUrl: 'https://lillysapp.com/',
    body: '<title>DNS points to prohibited IP | lillysapp.com | Cloudflare</title> error code: 1000',
    contentType: 'text/html',
    challenged: false,
  }),
  'dead'
);
assert.equal(
  classifyResponse({
    status: 402,
    finalUrl: 'https://youneekxyz.vercel.app/',
    body: 'Payment required DEPLOYMENT_DISABLED',
    contentType: 'text/plain',
    challenged: false,
  }),
  'dead'
);
assert.equal(
  classifyResponse({
    status: 200,
    finalUrl: 'https://youneekartifacts.cloudflareaccess.com/cdn-cgi/access/login/youneek.dev',
    body: '<title>Sign in ・ Cloudflare Access</title>',
    contentType: 'text/html',
    challenged: false,
  }),
  'dead'
);
assert.equal(
  classifyResponse({
    status: 403,
    finalUrl: 'https://roll10000.com/',
    body: '<title>Just a moment...</title>',
    contentType: 'text/html',
    challenged: true,
  }),
  'live'
);
assert.equal(
  classifyResponse({
    status: 200,
    finalUrl: 'https://3iatlasgame.xyz/',
    body: '<title>3i-Atlas — The Game</title>',
    contentType: 'text/html',
    challenged: false,
  }),
  'live'
);

const records = [
  { id: '1', type: 'A', name: 'youneek.xyz', content: '203.0.113.10' },
  { id: '2', type: 'AAAA', name: 'youneek.xyz', content: '2001:db8::1' },
  { id: '3', type: 'MX', name: 'youneek.xyz', content: 'mail.protonmail.ch' },
  { id: '4', type: 'TXT', name: 'youneek.xyz', content: 'v=spf1 include:_spf.protonmail.ch ~all' },
  { id: '5', type: 'CNAME', name: 'relay.youneek.xyz', content: 'youneek-share-relay.workers.dev' },
  { id: '6', type: 'CNAME', name: 'www.youneek.xyz', content: 'example.com' },
  { id: '7', type: 'A', name: 'calendar.youneek.dev', content: '192.0.2.1' },
];
assert.deepEqual(
  selectRecordsToReplace(records).map((record) => record.id),
  ['1', '2', '6']
);

const names = new Set(REPOS.map((repo) => repo.repoName));
for (const skipped of [
  'Projectpaperclip',
  'workflows-starter-template',
  'containers-template',
  'nextjs-with-supabase',
  'fastapi',
  'Original-YouNeeK-Time',
  'We-hook-slayer',
]) {
  assert.equal(names.has(skipped), false, `${skipped} should be omitted`);
}

const byName = Object.fromEntries(REPOS.map((repo) => [repo.repoName, repo]));

function siteUrls(name) {
  return (byName[name]?.sites || []).map((site) => site.url);
}

assert.deepEqual(siteUrls('10000TheFinalBoss'), [
  'https://roll10000.com',
  'https://online.roll10000.com',
]);
assert.deepEqual(siteUrls('3i-atlas-the-gameYNK'), ['https://3iatlasgame.xyz']);
assert.deepEqual(siteUrls('vibesdk-production2'), ['https://usedartifacts.com']);
assert.deepEqual(siteUrls('YouNeeKTimeTheFinalBoss'), ['https://youneektime.com']);
assert.deepEqual(siteUrls('youneekproradarBABY'), ['https://youneekproradar.com']);
assert.deepEqual(siteUrls('Real-Neural-Forge'), [
  'https://real-neural-forge-api.youneekartifacts.workers.dev',
]);
assert.deepEqual(siteUrls('used-artifacts'), []);
assert.deepEqual(siteUrls('lilly-s-appYNK222'), []);
assert.deepEqual(siteUrls('youneek'), []);
assert.deepEqual(siteUrls('youneek-time'), []);
assert.deepEqual(siteUrls('youneek-pro-radar'), []);
assert.deepEqual(siteUrls('Death-terminal-'), []);
assert.equal(byName['Death-terminal-'].title, 'YouNeeK Death Terminal');
assert.match(byName['Death-terminal-'].description, /Vulkan/);

const blob = JSON.stringify({ REPOS, LIVE_DEMOS });
for (const forbidden of [
  'vercel.app',
  'base44.app',
  'lillysapp.com',
  'youneekcare.com',
  'forge.youneek.xyz',
  'forge.youneek.dev',
  'death-terminal-green.vercel.app',
  'calendar.youneek.dev',
  'relay.youneek.xyz',
]) {
  assert.equal(blob.includes(forbidden), false, forbidden);
}

for (const repo of REPOS) {
  assert.ok(repo.title, repo.repoName);
  assert.ok(repo.description, repo.repoName);
  assert.equal(repo.link, `https://github.com/${config.owner}/${repo.repoName}`);
  const allowed = new Set(config.repos?.[repo.repoName]?.sites || []);
  for (const site of repo.sites) {
    assert.ok(allowed.has(site.url), `${repo.repoName} site ${site.url} is not in sites.config.json`);
    assert.ok(site.url.startsWith('https://'));
  }
}

assert.ok(LIVE_DEMOS.length >= 6);
assert.ok(LIVE_DEMOS.every((repo) => repo.sites.length > 0));

const wrangler = fs.readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
assert.equal(wrangler.includes('"pattern": "relay.youneek.xyz"'), false);
assert.equal(wrangler.includes('"pattern": "youneek.xyz"'), true);
assert.equal(wrangler.includes('"pattern": "www.youneek.xyz"'), true);
assert.equal(wrangler.includes('"account_id": "d74b0de637f4d9d9eb3efb9e13142784"'), true);

console.log(`portfolio tests passed (${REPOS.length} slots, ${LIVE_DEMOS.length} live)`);
