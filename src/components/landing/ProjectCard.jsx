import { useState } from 'react';
import { isBlockedDemoUrl } from '@/lib/live-demos';

const NEON_COLORS = {
  cyan: 'hsl(180, 100%, 50%)',
  magenta: 'hsl(300, 100%, 50%)',
  green: 'hsl(120, 100%, 50%)',
  yellow: 'hsl(50, 100%, 50%)',
  purple: 'hsl(270, 100%, 60%)',
  red: 'hsl(0, 100%, 55%)',
};

const NEON_FALLBACK = ['cyan', 'magenta', 'green', 'yellow', 'purple', 'red'];

function withAlpha(color, alpha) {
  if (typeof color === 'string' && color.startsWith('#')) {
    const hex = color.slice(1);
    const full = hex.length === 3 ? hex.split('').map((channel) => channel + channel).join('') : hex;
    const value = Number.parseInt(full, 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
  return color.replace(')', ` / ${alpha})`);
}

export default function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const palette = project.palette;
  const accent = project.accent || NEON_FALLBACK[index % NEON_FALLBACK.length];
  const neonColor = palette?.accent || NEON_COLORS[accent] || NEON_COLORS.cyan;
  const textColor = palette?.text;
  const surface = palette?.background;
  const demoHref = project.demoUrl && !isBlockedDemoUrl(project.demoUrl) ? project.demoUrl : '';
  const downloadHref = project.downloadUrl && !isBlockedDemoUrl(project.downloadUrl) ? project.downloadUrl : '';
  const websiteHref = project.websiteUrl && !isBlockedDemoUrl(project.websiteUrl) ? project.websiteUrl : '';

  return (
    <div
      className="card-flip-trigger group perspective-[1000px] h-72 sm:h-80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-flip-inner relative w-full h-full">
        {/* Front */}
        <div
          className="card-front absolute inset-0 rounded-lg overflow-hidden border border-border/50 transition-shadow duration-300"
          style={{
            backgroundColor: surface,
            boxShadow: isHovered
              ? `0 0 30px ${withAlpha(neonColor, 0.4)}, inset 0 0 15px ${withAlpha(neonColor, 0.1)}`
              : '0 0 0px transparent',
            borderColor: isHovered ? withAlpha(neonColor, 0.6) : undefined
          }}
        >
          {/* Image or neon gradient artwork */}
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 20% 20%, ${withAlpha(neonColor, 0.45)} 0%, transparent 55%),
                  radial-gradient(circle at 80% 70%, ${withAlpha(neonColor, 0.25)} 0%, transparent 60%),
                  linear-gradient(135deg, ${surface || 'hsl(240, 10%, 8%)'} 0%, ${surface || 'hsl(240, 10%, 4%)'} 100%)
                `,
              }}
            />
          )}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)'
            }}
          />
          {surface ? (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${surface} 0%, ${withAlpha(surface, 0.72)} 46%, transparent 100%)`,
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span
              className="font-mono text-xs tracking-widest mb-2 block"
              style={{ color: neonColor }}
            >
              {project.tag}
            </span>
            <h3
              className="font-heading text-xl sm:text-2xl font-bold text-foreground leading-tight"
              style={textColor ? { color: textColor } : undefined}
            >
              {project.title}
            </h3>
            <p
              className={`font-mono text-xs mt-1 line-clamp-3 ${textColor ? '' : 'text-muted-foreground'}`}
              style={textColor ? { color: textColor } : undefined}
            >
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          className="card-back absolute inset-0 rounded-lg overflow-hidden border p-6 flex flex-col justify-between"
          style={{
            backgroundColor: surface || 'hsl(240, 10%, 6%)',
            borderColor: withAlpha(neonColor, 0.4),
            boxShadow: `0 0 30px ${withAlpha(neonColor, 0.3)}, inset 0 0 20px ${withAlpha(neonColor, 0.05)}`
          }}
        >
          <div>
            <h3
              className="font-heading text-lg font-bold mb-4 leading-tight"
              style={{ color: neonColor }}
            >
              {project.title}
            </h3>
            <p
              className={`font-mono text-sm mb-4 line-clamp-5 ${textColor ? '' : 'text-muted-foreground'}`}
              style={textColor ? { color: textColor } : undefined}
            >
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {(project.stack || []).map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2 py-1 rounded border"
                  style={{
                    borderColor: withAlpha(neonColor, 0.3),
                    color: neonColor,
                    backgroundColor: withAlpha(neonColor, 0.08)
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm inline-flex items-center gap-2 hover-glitch transition-colors"
              style={{ color: neonColor }}
            >
              GITHUB →
            </a>
            {demoHref ? (
              <a
                href={demoHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-mono text-sm inline-flex items-center gap-2 hover-glitch transition-colors ${palette ? '' : 'text-accent'}`}
                style={palette ? { color: neonColor } : undefined}
              >
                LIVE DEMO →
              </a>
            ) : null}
            {downloadHref ? (
              <a
                href={downloadHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm inline-flex items-center gap-2 hover-glitch transition-colors"
                style={{ color: neonColor }}
              >
                DOWNLOAD →
              </a>
            ) : null}
            {websiteHref ? (
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm inline-flex items-center gap-2 hover-glitch transition-colors"
                style={{ color: neonColor }}
              >
                WEBSITE →
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
