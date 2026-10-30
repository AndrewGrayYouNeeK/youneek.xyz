import { useEffect, useRef, useState } from 'react';

const FRAME_MS = 1000 / 24;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Analog TV white noise for cards that have no live or connected site.
 * Draws only while on screen. With prefers-reduced-motion it paints one
 * still frame of snow and never animates.
 */
export default function TvStatic({ label = 'NO SIGNAL', sublabel = 'NO LIVE SITE' }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: '80px', threshold: 0.01 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    const snow = document.createElement('canvas');
    const snowCtx = snow.getContext('2d', { alpha: false });
    let raf = 0;
    let last = 0;
    let roll = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      width = Math.max(1, parent?.clientWidth || 320);
      height = Math.max(1, parent?.clientHeight || 200);
      canvas.width = width;
      canvas.height = height;
      // Half-resolution noise keeps the grain fine without 1:1 pixel work.
      snow.width = Math.max(1, Math.floor(width / 2));
      snow.height = Math.max(1, Math.floor(height / 2));
    };

    const paint = (withRoll) => {
      const image = snowCtx.createImageData(snow.width, snow.height);
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.random();
        const v = r > 0.42 ? 255 : r > 0.22 ? 140 + ((r * 100) | 0) : (r * 70) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      snowCtx.putImageData(image, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(snow, 0, 0, width, height);

      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      for (let y = 0; y < height; y += 2) ctx.fillRect(0, y, width, 1);

      if (withRoll) {
        roll = (roll + 2) % (height + 120);
        const band = Math.max(40, height * 0.22);
        const g = ctx.createLinearGradient(0, roll - band, 0, roll + band * 0.35);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.8, 'rgba(255,255,255,0.35)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, roll - band, width, band * 1.35);
      }
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      paint(true);
    };

    resize();
    paint(false);
    let observer;
    if (!reduced) {
      raf = requestAnimationFrame(tick);
    }
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      observer = new ResizeObserver(() => {
        resize();
        paint(false);
      });
      observer.observe(canvas.parentElement);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [visible, reduced]);

  return (
    <div
      ref={rootRef}
      className="tv-static absolute inset-0 overflow-hidden bg-black"
      role="img"
      aria-label={`${label}: ${sublabel}`}
      data-tv-static={reduced ? 'still' : 'animated'}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="tv-static-vignette absolute inset-0 pointer-events-none" />
      <div className="absolute inset-x-0 top-[26%] z-20 flex flex-col items-center pointer-events-none" aria-hidden="true">
        <span className="bg-black/70 px-3 py-1 font-mono text-xs tracking-[0.45em] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
          {label}
        </span>
        <span className="mt-1 bg-black/60 px-2 font-mono text-[10px] tracking-[0.3em] text-white/70">
          {sublabel}
        </span>
      </div>
    </div>
  );
}
