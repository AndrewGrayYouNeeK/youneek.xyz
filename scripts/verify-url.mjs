/**
 * Decide whether a URL is safe to show as Visit site.
 * Live means a browser can open an application, including a Cloudflare bot
 * challenge in front of one. Dead means the host is gone, parked, or serving
 * an error page we already recognized.
 */

const DEAD_MARKERS = [
  'error code: 1000',
  'dns points to prohibited ip',
  'deployment_disabled',
  'payment required',
  'deployment_not_found',
  'app not found',
  'sign in ・ cloudflare access',
  'sign in · cloudflare access',
];

// This Worker serves these hostnames. CI is often challenged on them, and a
// challenge hides whether a new path on our own site is up.
export const FIRST_PARTY_HOSTS = new Set(['youneek.xyz', 'www.youneek.xyz']);

/**
 * classifyResponse treats a Cloudflare challenge as live. The sync then keeps
 * that verdict only for URLs already on the card list, so a brand-new link
 * would be dropped. Paths on this site stay linked: the pages ship in the build.
 */
export function applyChallengePolicy({
  candidate,
  challenged,
  verdict,
  hasPreviousRecord,
  previouslyLinked,
}) {
  if (!challenged || !hasPreviousRecord) return verdict;
  if (previouslyLinked) return 'live';
  let host = '';
  try {
    host = new URL(candidate).hostname.toLowerCase();
  } catch {
    return 'dead';
  }
  if (FIRST_PARTY_HOSTS.has(host)) return 'live';
  return 'dead';
}

export function classifyResponse({ status, finalUrl, body, contentType, challenged }) {
  const text = String(body || '').slice(0, 8000);
  const lower = text.toLowerCase();
  const final = String(finalUrl || '').toLowerCase();

  if (final.includes('cloudflareaccess.com') || final.includes('/cdn-cgi/access/login')) {
    return 'dead';
  }
  if (DEAD_MARKERS.some((marker) => lower.includes(marker))) {
    return 'dead';
  }
  if (challenged || lower.includes('<title>just a moment...</title>')) {
    return 'live';
  }
  if (status >= 200 && status < 400) {
    const type = String(contentType || '').toLowerCase();
    if (
      type.includes('text/html') ||
      type.includes('application/json') ||
      type.includes('text/plain') ||
      type.includes('application/javascript') ||
      text.trim().length > 0
    ) {
      return 'live';
    }
  }
  return 'dead';
}

export async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
        'User-Agent': 'youneek-portfolio-verify',
      },
    });
    const chunks = [];
    let received = 0;
    if (response.body) {
      const reader = response.body.getReader();
      while (received < 8000) {
        const step = await reader.read();
        if (step.done) break;
        chunks.push(step.value);
        received += step.value.byteLength;
      }
      await reader.cancel().catch(() => {});
    }
    const body = new TextDecoder().decode(
      chunks.length === 1 ? chunks[0] : concatBytes(chunks)
    );
    const challenged =
      response.headers.get('cf-mitigated') === 'challenge' ||
      body.toLowerCase().includes('<title>just a moment...</title>');
    const verdict = classifyResponse({
      status: response.status,
      finalUrl: response.url,
      body,
      contentType: response.headers.get('content-type') || '',
      challenged,
    });
    return { url, verdict, challenged, status: response.status, finalUrl: response.url };
  } catch (error) {
    return { url, verdict: 'inconclusive', error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

function concatBytes(chunks) {
  const size = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const out = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}
