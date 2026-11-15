import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV = [
  { to: '/air-traffic', label: 'Game', end: true },
  { to: '/air-traffic/privacy', label: 'Privacy', end: false },
  { to: '/air-traffic/support', label: 'Support', end: false },
];

function usePageMeta({ title, description, path }) {
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') ?? '';
    const canonical = document.querySelector('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute('href') ?? '';
    document.title = title;
    if (meta) meta.setAttribute('content', description);
    if (canonical) canonical.setAttribute('href', `https://youneek.xyz${path}`);
    return () => {
      document.title = previousTitle;
      if (meta) meta.setAttribute('content', previousDescription);
      if (canonical) canonical.setAttribute('href', previousCanonical);
    };
  }, [title, description, path]);
}

function navClass({ isActive }) {
  return isActive
    ? 'font-mono text-xs tracking-wide text-primary'
    : 'font-mono text-xs tracking-wide text-muted-foreground hover:text-primary';
}

export default function AirTrafficFrame({ title, description, path, children }) {
  usePageMeta({ title, description, path });

  return (
    <div className="scanline-overlay min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(180 100% 50% / 0.2) 1px, transparent 1px),
            linear-gradient(90deg, hsl(180 100% 50% / 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <header className="sticky top-0 z-20 border-b border-border/40 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
          <Link to="/air-traffic" className="font-heading text-sm font-bold tracking-[0.2em] text-primary">
            YNK
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="YNK Air Traffic">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="relative z-10">{children}</main>
      <footer className="relative z-10 border-t border-border/30">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            YouNeeK · Andrew Gray · {new Date().getFullYear()}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs">
            <Link to="/" className="text-primary hover:underline">
              Portfolio
            </Link>
            <a
              href="https://github.com/AndrewGrayYouNeeK/YNKAIRTRAFFICGAME"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
