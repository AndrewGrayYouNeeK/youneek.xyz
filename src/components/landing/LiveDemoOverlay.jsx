import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Pause, Play, Rocket, X, Terminal, Gamepad2 } from 'lucide-react';
import { LIVE_DEMOS, REPOS } from '@/data/repos';
import { hostLabel, isFragileDemo, resolveDemoUrl } from '@/lib/live-demos';

const BOOT_LINES = [
  'boot> mount /youneek/core ... OK',
  'boot> load neural.mesh ... OK',
  'boot> sync github://AndrewGrayYouNeeK ... OK',
  `boot> indexed ${REPOS.length} repositories`,
  `boot> live endpoints online: ${LIVE_DEMOS.length}`,
  'boot> linking mission control ...',
  'boot> stick is yours — TAKE CONTROL anytime',
  'boot> LAUNCH SEQUENCE COMPLETE',
];

function fireLaunchFX() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#00ffff', '#ff00ff', '#39ff14', '#ffff00'];
  const parts = Array.from({ length: 140 }, () => {
    const side = Math.random() < 0.5;
    return {
      x: side ? 0 : window.innerWidth,
      y: window.innerHeight * (0.45 + Math.random() * 0.25),
      vx: (side ? 1 : -1) * (4 + Math.random() * 10),
      vy: -6 - Math.random() * 10,
      g: 0.22 + Math.random() * 0.12,
      size: 2 + Math.random() * 3.5,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });

  let frames = 0;
  const tick = () => {
    frames += 1;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of parts) {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.life *= 0.985;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size * 1.4);
    }
    ctx.globalAlpha = 1;
    if (frames < 90) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}

export default function LiveDemoOverlay({ open, onClose }) {
  const [phase, setPhase] = useState('boot');
  const [lineCount, setLineCount] = useState(0);
  const [activeDemo, setActiveDemo] = useState(0);
  const [scan, setScan] = useState(true);
  const [controlling, setControlling] = useState(false);
  const [feedState, setFeedState] = useState('linking');
  const iframeRef = useRef(null);

  const demos = useMemo(
    () => LIVE_DEMOS.map((repo) => ({ ...repo, demoUrl: resolveDemoUrl(repo) })),
    []
  );
  const featured = demos[activeDemo] || demos[0];
  const fragile = isFragileDemo(featured?.demoUrl);

  useEffect(() => {
    if (!open) {
      setPhase('boot');
      setLineCount(0);
      setScan(true);
      setControlling(false);
      setFeedState('linking');
      return undefined;
    }

    fireLaunchFX();
    setPhase('boot');
    setLineCount(0);
    setScan(true);
    setControlling(false);

    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setLineCount(i);
      if (i >= BOOT_LINES.length) {
        clearInterval(timer);
        setTimeout(() => setPhase('ready'), 350);
      }
    }, 200);

    return () => clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (controlling) {
          setControlling(false);
          return;
        }
        onClose();
        return;
      }
      if (phase !== 'ready') return;
      if (e.key === ' ') {
        e.preventDefault();
        setScan((s) => !s);
        setControlling(false);
      }
      if (e.key === 'c' || e.key === 'C') {
        setControlling(true);
        setScan(false);
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setScan(false);
        setActiveDemo((n) => (n + 1) % demos.length);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setScan(false);
        setActiveDemo((n) => (n - 1 + demos.length) % demos.length);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose, controlling, phase, demos.length]);

  useEffect(() => {
    if (!open || phase !== 'ready' || demos.length < 2 || !scan || controlling) return undefined;
    const cycle = setInterval(() => {
      setActiveDemo((n) => (n + 1) % demos.length);
    }, 8000);
    return () => clearInterval(cycle);
  }, [open, phase, demos.length, scan, controlling]);

  useEffect(() => {
    setFeedState('linking');
  }, [featured?.demoUrl]);

  const takeControl = () => {
    setControlling(true);
    setScan(false);
    setFeedState('connected');
  };

  const releaseControl = () => {
    setControlling(false);
  };

  const selectDemo = (idx) => {
    setActiveDemo(idx);
    setScan(false);
    setControlling(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Live demo mission control"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className={`relative w-full overflow-hidden rounded-xl border border-primary/40 bg-[hsl(240,12%,5%)] shadow-[0_0_60px_hsl(180,100%,50%,0.25)] ${
            controlling ? 'max-w-6xl max-h-[96vh]' : 'max-w-5xl max-h-[92vh]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-primary/20 px-4 py-3">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-primary">
              <Rocket className="w-4 h-4" />
              <span className="tracking-widest">MISSION.CONTROL // LIVE.DEMO</span>
            </div>
            <div className="flex items-center gap-2">
              {phase === 'ready' && (
                <span
                  className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest px-2 py-1 rounded border"
                  style={{
                    borderColor: controlling
                      ? 'hsl(120 100% 50% / 0.55)'
                      : 'hsl(180 100% 50% / 0.35)',
                    color: controlling ? 'hsl(120 100% 50%)' : 'hsl(180 100% 50%)',
                  }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: controlling ? 'hsl(120 100% 50%)' : 'hsl(180 100% 50%)' }}
                  />
                  {controlling ? 'YOU HAVE CONTROL' : scan ? 'SCANNING' : 'HOLD'}
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-primary/70 hover:text-primary transition-colors"
                aria-label="Close live demo"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {phase === 'boot' ? (
            <div className="p-6 sm:p-10 min-h-[360px] font-mono text-sm sm:text-base">
              <div className="flex items-center gap-2 text-accent mb-6">
                <Terminal className="w-4 h-4" />
                <span className="tracking-widest text-xs">BOOT.SEQUENCE</span>
              </div>
              <div className="space-y-2">
                {BOOT_LINES.slice(0, lineCount).map((line) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={line.includes('COMPLETE') ? 'text-primary neon-text' : 'text-muted-foreground'}
                  >
                    {line}
                  </motion.p>
                ))}
                <span className="inline-block w-2 h-4 bg-primary animate-pulse align-middle" />
              </div>
            </div>
          ) : (
            <div
              className={`grid gap-0 max-h-[calc(92vh-52px)] overflow-y-auto ${
                controlling ? 'lg:grid-cols-1' : 'lg:grid-cols-[1.2fr_1fr]'
              }`}
            >
              <div className={`p-4 sm:p-6 ${controlling ? '' : 'border-b lg:border-b-0 lg:border-r border-primary/15'}`}>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="font-mono text-[10px] tracking-[0.35em] text-primary/50">
                    {controlling ? 'ACTIVE.CONTROL' : 'ACTIVE.ENDPOINT'}
                  </p>
                  <span className="font-mono text-[10px] tracking-widest text-accent">
                    {feedState === 'linking' ? '● LINKING' : '● CONNECTED'}
                    {fragile ? ' / FRAGILE.HOST' : ''}
                  </span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary neon-text mb-2">
                  {featured?.title}
                </h3>
                <p className="font-mono text-sm text-muted-foreground mb-4">
                  {featured?.description}
                </p>

                <div
                  className={`relative rounded-lg overflow-hidden border border-primary/30 bg-black/60 mb-4 shadow-[0_0_30px_hsl(180,100%,50%,0.12)] ${
                    controlling ? 'aspect-[16/10] min-h-[52vh]' : 'aspect-video'
                  }`}
                >
                  <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(hsl(180 100% 50% / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(180 100% 50% / 0.12) 1px, transparent 1px)',
                      backgroundSize: '28px 28px',
                    }}
                  />
                  <iframe
                    ref={iframeRef}
                    key={featured?.demoUrl}
                    title={featured?.title}
                    src={featured?.demoUrl}
                    className="absolute inset-0 w-full h-full bg-black"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    allow="fullscreen; clipboard-read; clipboard-write"
                    loading="lazy"
                    onLoad={() => {
                      setFeedState('connected');
                      try {
                        const doc = iframeRef.current?.contentWindow?.document;
                        if (!doc) return;
                        doc.addEventListener('keydown', (e) => {
                          if (e.key === 'Escape') setControlling(false);
                        });
                      } catch {
                        /* cross-origin feed — use RELEASE CONTROL in the chrome */
                      }
                    }}
                  />
                  <div className="absolute top-2 left-2 z-10 font-mono text-[10px] px-2 py-1 rounded bg-black/70 text-accent border border-accent/30 pointer-events-none">
                    {controlling ? 'YOUR STICK' : 'LIVE FEED'}
                  </div>
                  {!controlling && (
                    <button
                      type="button"
                      onClick={takeControl}
                      className="absolute inset-x-0 bottom-0 z-10 py-2 font-mono text-[10px] tracking-[0.25em] text-primary/80 bg-black/55 hover:bg-black/75 hover:text-primary transition-colors"
                    >
                      CLICK TO TAKE CONTROL OF THIS ENDPOINT
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={controlling ? releaseControl : takeControl}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-accent/50 text-accent font-mono text-xs hover:shadow-[0_0_20px_hsl(120,100%,50%,0.35)] transition-all"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    {controlling ? 'RELEASE CONTROL' : 'TAKE CONTROL'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScan((s) => !s);
                      if (scan) setControlling(false);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 text-primary font-mono text-xs hover:shadow-[0_0_20px_hsl(180,100%,50%,0.25)] transition-all"
                    aria-pressed={!scan}
                  >
                    {scan ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {scan ? 'HOLD SCAN' : 'RESUME SCAN'}
                  </button>
                  <a
                    href={featured?.demoUrl?.replace(/\?embed=1$/, '') || featured?.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-primary/50 text-primary font-mono text-xs hover:shadow-[0_0_20px_hsl(180,100%,50%,0.35)] transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    OPEN LIVE SITE
                  </a>
                  <a
                    href={featured?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-secondary/40 text-secondary font-mono text-xs hover:shadow-[0_0_20px_hsl(300,100%,50%,0.25)] transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    SOURCE
                  </a>
                </div>
                <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                  {controlling
                    ? 'You have the stick. Click inside the feed to drive the live site. RELEASE CONTROL or Esc hands it back.'
                    : 'Pick a live build, then TAKE CONTROL — scan will hold so the feed stays on what you chose.'}
                </p>
              </div>

              {!controlling && (
                <div className="p-4 sm:p-6">
                  <p className="font-mono text-[10px] tracking-[0.35em] text-primary/50 mb-3">
                    ALL.LIVE.BUILDS ({demos.length})
                  </p>
                  <div className="space-y-2">
                    {demos.map((demo, idx) => {
                      const active = idx === activeDemo;
                      return (
                        <button
                          key={demo.repoName}
                          type="button"
                          onClick={() => selectDemo(idx)}
                          className="w-full text-left rounded-lg border px-3 py-3 transition-all"
                          style={{
                            borderColor: active ? 'hsl(180 100% 50% / 0.55)' : 'hsl(180 100% 50% / 0.15)',
                            background: active ? 'hsl(180 100% 50% / 0.08)' : 'transparent',
                            boxShadow: active ? '0 0 18px hsl(180 100% 50% / 0.15)' : 'none',
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-heading text-sm text-foreground">{demo.title}</span>
                            <span className="font-mono text-[10px] text-primary/60">{demo.subtitle}</span>
                          </div>
                          <p className="font-mono text-[11px] text-muted-foreground mt-1 line-clamp-2">
                            {hostLabel(demo.demoUrl)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-5 w-full font-mono text-xs tracking-widest text-primary/70 border border-primary/20 rounded-lg py-3 hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    {'>'} DROP TO FULL REPO GRID_
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
