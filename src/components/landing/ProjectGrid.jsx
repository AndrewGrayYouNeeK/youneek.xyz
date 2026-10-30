import { useEffect, useMemo, useRef, useState } from 'react';
import ProjectCard from './ProjectCard';
import { REPOS } from '@/data/repos';

const FILTERS = [
  { id: 'all', label: 'ALL WORK' },
  { id: 'live', label: 'LIVE SITES' },
  { id: 'offline', label: 'NO SIGNAL' },
];

export default function ProjectGrid() {
  const gridRef = useRef(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const repoCount = REPOS.filter((repo) => !repo.extra).length;
  const extraCount = REPOS.length - repoCount;
  const liveCount = REPOS.filter((repo) => repo.sites.length > 0).length;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return REPOS.map((repo, index) => ({ repo, index })).filter(({ repo }) => {
      if (filter === 'live' && repo.sites.length === 0) return false;
      if (filter === 'offline' && repo.sites.length > 0) return false;
      if (!needle) return true;
      return [repo.title, repo.description, repo.repoName, repo.language]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [filter, query]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const items = gridRef.current?.querySelectorAll('.fade-in-up:not(.visible)');
    items?.forEach((item, i) => {
      item.style.animationDelay = `${Math.min(i, 12) * 0.08}s`;
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, [visible]);

  return (
    <section id="portfolio" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-primary/50">
          {'<'} Real GitHub Work {'/>'}
        </span>
        <p className="mx-auto mt-4 max-w-2xl font-mono text-sm text-muted-foreground">
          {repoCount} public repos{extraCount ? ` plus ${extraCount} more projects` : ''} from{' '}
          <a
            href="https://github.com/AndrewGrayYouNeeK"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @AndrewGrayYouNeeK
          </a>
          , {liveCount} with a checked live site. Cards with no picture yet show TV static.
        </p>
        <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
          {FILTERS.map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(item.id)}
                className={`rounded border px-3 py-1.5 font-mono text-xs tracking-widest transition-all ${
                  selected
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_hsl(180,100%,50%,0.3)]'
                    : 'border-border/50 text-muted-foreground hover:border-primary/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <label className="block sm:w-72">
          <span className="sr-only">Search projects</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="> search projects_"
            className="w-full rounded border border-border/50 bg-background/60 px-4 py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[0_0_15px_hsl(180,100%,50%,0.25)]"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center font-mono text-sm text-muted-foreground">No projects match that search.</p>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ repo, index }) => (
            <div key={repo.repoName} className="fade-in-up">
              <ProjectCard project={repo} index={index} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
