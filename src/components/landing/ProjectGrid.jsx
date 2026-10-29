import { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';
import { REPOS } from '@/data/repos';

const FILTERS = [
  { id: 'all', label: 'All work' },
  { id: 'live', label: 'Live sites' },
];

export default function ProjectGrid() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const liveCount = REPOS.filter((repo) => repo.sites.length > 0).length;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return REPOS.filter((repo) => {
      if (filter === 'live' && repo.sites.length === 0) return false;
      if (!needle) return true;
      const haystack = [repo.title, repo.description, repo.repoName, repo.language]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [filter, query]);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-8 pt-8 sm:px-8">
      <header className="border-b border-white/10 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#7ee7ea]">Andrew Gray</p>
          <a
            href="https://github.com/AndrewGrayYouNeeK"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[#c5d6d6] underline-offset-4 hover:text-white hover:underline"
          >
            github.com/AndrewGrayYouNeeK
          </a>
        </div>
        <h1 className="mt-6 font-heading text-5xl leading-none text-white sm:text-7xl">YouNeeK</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#c5d6d6] sm:text-lg">
          Public repositories, each with its own slot. Visit site shows up only when that
          URL answered as a live site.
        </p>
        <dl className="mt-8 flex gap-10">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6f8d8f]">Repositories</dt>
            <dd className="mt-1 font-heading text-3xl text-white">{REPOS.length}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6f8d8f]">Live sites</dt>
            <dd className="mt-1 font-heading text-3xl text-white">{liveCount}</dd>
          </div>
        </dl>
      </header>

      <div className="sticky top-0 z-10 -mx-5 flex flex-col gap-3 bg-[#07080c]/90 px-5 py-4 backdrop-blur sm:-mx-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex gap-2" role="tablist" aria-label="Filter projects">
          {FILTERS.map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(item.id)}
                className={`rounded-full px-3 py-1.5 font-mono text-xs ${
                  selected ? 'bg-white text-[#072022]' : 'border border-white/15 text-[#c5d6d6]'
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
            placeholder="Search projects"
            className="w-full rounded-full border border-white/15 bg-transparent px-4 py-2 font-mono text-sm text-white outline-none placeholder:text-[#6f8d8f] focus:border-[#7ee7ea]"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center font-mono text-sm text-[#8fb4b6]">No projects match that search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard key={project.repoName} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}
