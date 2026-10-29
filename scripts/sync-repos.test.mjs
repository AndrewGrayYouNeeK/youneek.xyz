import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isBlockedDemoUrl } from '../src/lib/live-demos.js';
import {
  chooseDemoUrl,
  descriptionFor,
  githubPagesUrl,
  hostedAppBrand,
  skipReason,
  stripHostedAppPrefix,
} from './repo-sync-lib.mjs';

const brand = hostedAppBrand();
assert.ok(brand);

assert.equal(stripHostedAppPrefix(`${brand} App: Unique Sky`), 'Unique Sky');
assert.equal(
  descriptionFor({ name: 'unique-sky', description: `${brand} App: Unique Sky` }),
  'Unique Sky'
);
assert.equal(
  descriptionFor({ name: 'youneek.xyz', description: `${brand} App: YouNeeK.xyz` }),
  'YouNeeK.xyz'
);
assert.equal(descriptionFor({ name: 'empty-repo', description: `${brand} App:` }), 'GitHub project by Andrew Gray — empty-repo');

assert.equal(skipReason({ name: 'Projectpaperclip', fork: true, private: false }), 'fork');
assert.equal(skipReason({ name: 'secret', private: true, fork: false }), 'private');
assert.equal(skipReason({ name: 'hidden', visibility: 'private', fork: false }), 'private');
assert.equal(skipReason({ name: 'youneek.xyz', fork: false, private: false }), '');

const blockedHomepage = `https://abiding-orbit-view-live.${brand}.app`;
assert.equal(
  await chooseDemoUrl(
    { name: 'youneek-satellite-tracker', homepage: blockedHomepage, has_pages: false },
    { isBlockedDemoUrl }
  ),
  ''
);
assert.equal(
  await chooseDemoUrl(
    { name: 'example-pages', homepage: null, has_pages: true },
    { isBlockedDemoUrl }
  ),
  githubPagesUrl('AndrewGrayYouNeeK', 'example-pages')
);
assert.equal(
  await chooseDemoUrl(
    { name: 'example-pages', homepage: `https://demo.${brand}.app`, has_pages: true },
    {
      isBlockedDemoUrl,
      pagesHtmlUrl: async () => 'https://andrewgrayyouneek.github.io/example-pages/',
    }
  ),
  'https://andrewgrayyouneek.github.io/example-pages/'
);
assert.equal(
  await chooseDemoUrl(
    { name: 'YouNeeKTimeTheFinalBoss', homepage: 'https://youneektime.com', has_pages: true },
    {
      isBlockedDemoUrl,
      pagesHtmlUrl: async () => {
        throw new Error('homepage should win');
      },
    }
  ),
  'https://youneektime.com'
);
assert.equal(
  await chooseDemoUrl(
    { name: 'youneek.xyz', homepage: 'https://youneekxyz.vercel.app', has_pages: false },
    { isBlockedDemoUrl }
  ),
  'https://youneek.xyz'
);
assert.equal(
  await chooseDemoUrl(
    { name: '10000TheFinalBoss', homepage: 'https:\\\\roll10000.com', has_pages: false },
    { isBlockedDemoUrl }
  ),
  'https://roll10000.com'
);
assert.equal(
  await chooseDemoUrl(
    {
      name: 'Death-terminal-',
      homepage: 'https://death-terminal-green.vercel.app',
      has_pages: false,
    },
    { isBlockedDemoUrl }
  ),
  ''
);
assert.equal(
  githubPagesUrl('AndrewGrayYouNeeK', 'andrewgrayyouneek.github.io'),
  'https://andrewgrayyouneek.github.io/'
);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allowed = new Set([path.join(root, 'scripts', 'repo-sync-lib.mjs')]);
const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(js|jsx|mjs|cjs|css|md|html|json|yml|yaml|svg|txt)$/.test(entry.name)) continue;
    if (allowed.has(full)) continue;
    const text = fs.readFileSync(full, 'utf8');
    if (text.toLowerCase().includes(brand)) hits.push(path.relative(root, full));
  }
}

walk(root);
assert.deepEqual(hits, []);

console.log('sync-repos tests passed');
