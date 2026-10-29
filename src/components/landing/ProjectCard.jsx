function hostname(url) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function ProjectCard({ project }) {
  const sites = project.sites || [];
  const primary = sites[0];
  const extra = sites.slice(1);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#10131a] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition duration-200 hover:border-[#7ee7ea]/50">
      {project.image ? (
        <img
          src={project.image}
          alt=""
          className="mb-4 h-28 w-full rounded-xl object-cover"
        />
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8fb4b6]">
          {project.language}
        </p>
        {primary ? (
          <span className="rounded-full border border-[#7ee7ea]/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7ee7ea]">
            Live
          </span>
        ) : null}
      </div>
      <h2 className="mt-3 font-heading text-xl leading-tight text-white">{project.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#c5d6d6]">{project.description}</p>
      <p className="mt-4 font-mono text-[11px] text-[#6f8d8f]">Updated {project.updated}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-xs text-white transition hover:border-white/40"
        >
          GitHub
        </a>
        {primary ? (
          <a
            href={primary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#7ee7ea] px-3 py-1.5 font-mono text-xs font-bold text-[#072022] transition hover:bg-white"
          >
            Visit site
          </a>
        ) : null}
      </div>
      {extra.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {extra.map((site) => (
            <li key={site.url}>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#7ee7ea] underline-offset-2 hover:underline"
              >
                Also {hostname(site.url)}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
