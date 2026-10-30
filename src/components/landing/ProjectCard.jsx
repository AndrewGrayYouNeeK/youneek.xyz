import { useState } from 'react';
import TvStatic from './TvStatic';
import CardArt from './CardArt';
import { hostLabel } from '@/lib/live-demos';

const NEON_COLORS = {
  cyan: 'hsl(180 100% 50%)',
  magenta: 'hsl(300 100% 50%)',
  green: 'hsl(120 100% 50%)',
  yellow: 'hsl(50 100% 50%)',
  purple: 'hsl(270 100% 60%)',
  red: 'hsl(0 100% 55%)',
};

const NEON_ORDER = ['cyan', 'magenta', 'green', 'yellow', 'purple', 'red'];

function withAlpha(color, alpha) {
  return color.replace(')', ` / ${alpha})`);
}

export default function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const accent = project.accent || NEON_ORDER[index % NEON_ORDER.length];
  const neon = NEON_COLORS[accent] || NEON_COLORS.cyan;
  const sites = project.sites || [];
  const primary = sites[0];
  const extra = sites.slice(1);
  const live = Boolean(primary);
  const tag = `// ${String(index + 1).padStart(3, '0')}`;

  return (
    <div
      className="card-flip-trigger group perspective-[1000px] h-72 sm:h-80"
      data-live={live ? 'true' : 'false'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-flip-inner relative h-full w-full">
        {/* Front: the card's own picture; TV static only when there is no picture */}
        <div
          className="card-front absolute inset-0 overflow-hidden rounded-lg border border-border/50 transition-shadow duration-300"
          style={{
            boxShadow: isHovered
              ? `0 0 30px ${withAlpha(neon, 0.4)}, inset 0 0 15px ${withAlpha(neon, 0.1)}`
              : '0 0 0px transparent',
            borderColor: isHovered ? withAlpha(neon, 0.6) : undefined,
          }}
        >
          {project.image ? (
            <>
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(circle at 20% 20%, ${withAlpha(neon, 0.45)} 0%, transparent 55%),
                    linear-gradient(135deg, hsl(240 10% 8%) 0%, hsl(240 10% 4%) 100%)
                  `,
                }}
              />
              <img
                src={project.image}
                alt=""
                data-card-front-image=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
                }}
              />
              {live ? (
                <span
                  className="absolute right-3 top-3 rounded border px-2 py-0.5 font-mono text-[10px] tracking-widest"
                  style={{ color: NEON_COLORS.green, borderColor: withAlpha(NEON_COLORS.green, 0.5) }}
                >
                  ● LIVE
                </span>
              ) : null}
            </>
          ) : (
            <TvStatic />
          )}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${
              project.image ? 'from-background via-background/60' : 'from-background/95 via-background/30'
            } to-transparent`}
          />
          <div className={`absolute bottom-0 left-0 right-0 p-5 ${project.image ? '' : 'bg-black/75'}`}>
            <span className="mb-2 block font-mono text-xs tracking-widest" style={{ color: neon }}>
              {tag}
            </span>
            <h3 className="font-heading text-xl font-bold leading-tight text-foreground sm:text-2xl">
              {project.title}
            </h3>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{project.language}</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="card-back absolute inset-0 flex flex-col justify-between overflow-hidden rounded-lg border p-6"
          style={{
            backgroundColor: 'hsl(240 10% 6%)',
            borderColor: withAlpha(neon, 0.4),
            boxShadow: `0 0 30px ${withAlpha(neon, 0.3)}, inset 0 0 20px ${withAlpha(neon, 0.05)}`,
          }}
        >
          {project.backImage ? (
            <img
              src={project.backImage}
              alt=""
              data-card-back-image=""
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover opacity-25 ${String(project.backImage).includes('/original/') ? 'object-center' : 'object-top'}`}
            />
          ) : (
            <CardArt seed={project.repoName} color={neon} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/60" />
          <div className="relative">
            <h3 className="card-back-title mb-4 font-heading text-lg font-bold leading-tight" style={{ color: neon }}>
              {project.title}
            </h3>
            <p className="mb-4 line-clamp-5 font-mono text-sm text-muted-foreground">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded border px-2 py-1 font-mono text-xs"
                style={{
                  borderColor: withAlpha(neon, 0.3),
                  color: neon,
                  backgroundColor: withAlpha(neon, 0.08),
                }}
              >
                {project.language}
              </span>
              {project.updated ? (
                <span className="rounded border border-border/50 px-2 py-1 font-mono text-xs text-muted-foreground">
                  updated {project.updated}
                </span>
              ) : null}
            </div>
          </div>
          <div className="card-actions relative mt-4 flex flex-wrap gap-3">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-link hover-glitch inline-flex items-center gap-2 font-mono text-sm transition-colors"
                style={{ color: neon }}
              >
                GITHUB →
              </a>
            ) : null}
            {primary ? (
              <a
                href={primary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-link hover-glitch inline-flex items-center gap-2 font-mono text-sm text-accent transition-colors"
              >
                {primary.label && !primary.label.includes('.') ? `${primary.label.toUpperCase()} →` : 'VISIT SITE →'}
              </a>
            ) : (
              <span className="font-mono text-xs tracking-widest text-muted-foreground/60">NO LIVE SITE</span>
            )}
            {extra.map((site) => (
              <a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-link hover-glitch inline-flex items-center gap-2 font-mono text-xs text-accent/80 transition-colors"
              >
                {site.label || hostLabel(site.url)} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
