// Set this to the TestFlight or App Store https URL when the listing is live.
// Leave it as an empty string until then. The landing page shows Coming soon.
export const AIR_TRAFFIC_STORE_URL = '';

export function storeButtonLabel(url) {
  if (url.includes('testflight.apple.com')) return 'Join the TestFlight';
  return 'Download on the App Store';
}
