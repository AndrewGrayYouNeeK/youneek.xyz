import { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import { REPOS } from '@/data/repos';

export default function ProjectGrid() {
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const items = gridRef.current?.querySelectorAll('.fade-in-up');
    items?.forEach((item, i) => {
      item.style.animationDelay = `${Math.min(i, 12) * 0.08}s`;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="font-mono text-xs tracking-[0.4em] text-primary/50 uppercase">
          {'<'} Real GitHub Work {'/>'}
        </span>
        <p className="mt-4 font-mono text-sm text-muted-foreground max-w-2xl mx-auto">
          {REPOS.length} public repos from{' '}
          <a
            href="https://github.com/AndrewGrayYouNeeK"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @AndrewGrayYouNeeK
          </a>
          — actual code, not filler cards.
        </p>
        <div className="mt-4 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPOS.map((project, i) => (
          <div key={project.repoName} className="fade-in-up">
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
