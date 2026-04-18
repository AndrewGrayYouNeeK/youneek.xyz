import { useState } from 'react';

const NEON_COLORS = {
  cyan: 'hsl(180, 100%, 50%)',
  magenta: 'hsl(300, 100%, 50%)',
  green: 'hsl(120, 100%, 50%)',
  yellow: 'hsl(50, 100%, 50%)',
  purple: 'hsl(270, 100%, 60%)',
  red: 'hsl(0, 100%, 55%)',
};

const NEON_FALLBACK = ['cyan', 'magenta', 'green', 'yellow', 'purple', 'red'];

export default function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const accent = project.accent || NEON_FALLBACK[index % NEON_FALLBACK.length];
  const neonColor = NEON_COLORS[accent] || NEON_COLORS.cyan;

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
            boxShadow: isHovered
              ? `0 0 30px ${neonColor.replace(')', ' / 0.4)')}, inset 0 0 15px ${neonColor.replace(')', ' / 0.1)')}`
              : '0 0 0px transparent',
            borderColor: isHovered ? neonColor.replace(')', ' / 0.6)') : undefined
          }}
        >
          {/* Neon gradient artwork (replaces external image) */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 20%, ${neonColor.replace(')', ' / 0.45)')} 0%, transparent 55%),
                radial-gradient(circle at 80% 70%, ${neonColor.replace(')', ' / 0.25)')} 0%, transparent 60%),
                linear-gradient(135deg, hsl(240, 10%, 8%) 0%, hsl(240, 10%, 4%) 100%)
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span
              className="font-mono text-xs tracking-widest mb-2 block"
              style={{ color: neonColor }}
            >
              {project.tag}
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {project.title}
            </h3>
            <p className="font-mono text-xs text-muted-foreground mt-1">{project.subtitle}</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="card-back absolute inset-0 rounded-lg overflow-hidden border p-6 flex flex-col justify-between"
          style={{
            backgroundColor: 'hsl(240, 10%, 6%)',
            borderColor: neonColor.replace(')', ' / 0.4)'),
            boxShadow: `0 0 30px ${neonColor.replace(')', ' / 0.3)')}, inset 0 0 20px ${neonColor.replace(')', ' / 0.05)')}`
          }}
        >
          <div>
            <h3
              className="font-heading text-lg font-bold mb-4"
              style={{ color: neonColor }}
            >
              {project.title}
            </h3>
            <p className="font-mono text-sm text-muted-foreground mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2 py-1 rounded border"
                  style={{
                    borderColor: neonColor.replace(')', ' / 0.3)'),
                    color: neonColor,
                    backgroundColor: neonColor.replace(')', ' / 0.08)')
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm mt-4 inline-flex items-center gap-2 hover-glitch transition-colors"
            style={{ color: neonColor }}
          >
            VIEW PROJECT →
          </a>
        </div>
      </div>
    </div>
  );
}
