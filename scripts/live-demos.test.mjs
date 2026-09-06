import assert from 'node:assert/strict';
import { hostLabel, isFragileDemo, PRODUCTION_ORIGIN, resolveDemoUrl, withLiveUrls } from '../src/lib/live-demos.js';

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

console.log('live-demos tests passed');
