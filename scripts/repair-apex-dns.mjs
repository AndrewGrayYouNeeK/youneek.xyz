#!/usr/bin/env node
/**
 * Replace the broken youneek.xyz / www.youneek.xyz address records so
 * `wrangler deploy` can attach those hostnames as Worker custom domains.
 *
 * Deletes only A, AAAA, and CNAME records whose name is exactly youneek.xyz
 * or www.youneek.xyz. MX, TXT, CAA, and every other hostname — including
 * relay.youneek.xyz — are left in place.
 *
 * Without a Cloudflare token this prints the follow-up and exits 0 so a
 * later `wrangler deploy` can still run from a logged-in Wrangler session.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ZONE_NAME = 'youneek.xyz';
const REPLACE_NAMES = new Set(['youneek.xyz', 'www.youneek.xyz']);
const REPLACE_TYPES = new Set(['A', 'AAAA', 'CNAME']);
const MAX_REPLACEMENTS = 8;
const ACCOUNT_ID = 'd74b0de637f4d9d9eb3efb9e13142784';

export function selectRecordsToReplace(records) {
  return (records || []).filter(
    (record) => REPLACE_NAMES.has(record.name) && REPLACE_TYPES.has(record.type)
  );
}

function readWranglerOAuthToken() {
  const candidates = [
    path.join(os.homedir(), '.config', '.wrangler', 'config', 'default.toml'),
    path.join(os.homedir(), '.wrangler', 'config', 'default.toml'),
    path.join(os.homedir(), 'Library', 'Preferences', '.wrangler', 'config', 'default.toml'),
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    const match = text.match(/oauth_token\s*=\s*"([^"]+)"/);
    if (match) return match[1];
  }
  return '';
}

function token() {
  return process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN || readWranglerOAuthToken();
}

async function cf(pathname, auth, options = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${auth}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json();
  if (!payload.success) {
    const message = (payload.errors || []).map((error) => error.message).join('; ') || response.statusText;
    throw new Error(`${pathname} failed: ${message}`);
  }
  return payload;
}

async function listRecords(zoneId, auth) {
  const records = [];
  let page = 1;
  for (;;) {
    const payload = await cf(`/zones/${zoneId}/dns_records?per_page=100&page=${page}`, auth);
    records.push(...payload.result);
    const total = payload.result_info?.total_pages || 1;
    if (page >= total) return records;
    page += 1;
  }
}

async function main() {
  const auth = token();
  if (!auth) {
    console.log(
      'No Cloudflare token in CLOUDFLARE_API_TOKEN or a local Wrangler login. Skipping DNS repair. `wrangler deploy` still attaches youneek.xyz and www.youneek.xyz when the token can edit this zone.'
    );
    return;
  }

  const zonePayload = await cf(
    `/zones?name=${ZONE_NAME}&account.id=${ACCOUNT_ID}`,
    auth
  );
  const zone = (zonePayload.result || []).find((item) => item.name === ZONE_NAME);
  if (!zone) {
    throw new Error(`Zone ${ZONE_NAME} was not found on account ${ACCOUNT_ID}.`);
  }

  const records = await listRecords(zone.id, auth);
  const replace = selectRecordsToReplace(records);
  const kept = records.filter((record) => !replace.includes(record));
  console.log(
    `Zone ${ZONE_NAME}: ${records.length} records. Replacing ${replace.length} address record(s) on youneek.xyz and www.youneek.xyz. Leaving ${kept.length} other record(s), including mail and relay.`
  );
  for (const record of kept) {
    console.log(`  keep ${record.type} ${record.name}`);
  }
  if (replace.length > MAX_REPLACEMENTS) {
    throw new Error(`Refusing to delete ${replace.length} records; expected at most ${MAX_REPLACEMENTS}.`);
  }
  for (const record of replace) {
    console.log(`  replace ${record.type} ${record.name}`);
    await cf(`/zones/${zone.id}/dns_records/${record.id}`, auth, { method: 'DELETE' });
  }
  if (replace.length === 0) {
    console.log('No conflicting A, AAAA, or CNAME record on youneek.xyz or www.youneek.xyz.');
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
