import { AIR_TRAFFIC_STORE_URL, storeButtonLabel } from './store';

const buttonClass =
  'inline-flex min-h-12 w-full items-center justify-center rounded-md border border-primary bg-primary px-6 font-heading text-sm font-bold tracking-wide text-primary-foreground shadow-[0_0_28px_hsl(180_100%_50%/0.35)] transition-shadow hover:shadow-[0_0_36px_hsl(180_100%_50%/0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-100 sm:w-auto';

export default function StoreButton() {
  const url = AIR_TRAFFIC_STORE_URL.trim();

  if (!url) {
    return (
      <div className="mt-8">
        <button type="button" className={buttonClass} disabled>
          Coming soon
        </button>
        <p className="mt-3 font-mono text-xs text-muted-foreground">TestFlight and the App Store</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <a href={url} className={buttonClass} target="_blank" rel="noopener noreferrer">
        {storeButtonLabel(url)}
      </a>
    </div>
  );
}
