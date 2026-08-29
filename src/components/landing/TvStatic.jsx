import { useEffect, useRef, useState } from 'react';

/**
 * Analog NTSC snow: fine grain, scanlines, and a slow V-hold roll.
 * Matches the classic CRT "NO SIGNAL" preview look.
 */
export default function TvStatic({ label = 'NO SIGNAL' }) {
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: '80px', threshold: 0.05 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return undefined;

    const ctx = canvas.getContext('2d', { alpha: false });
    const snow = document.createElement('canvas');
    const sctx = snow.getContext('2d', { alpha: false });
    let raf = 0;
    let running = true;
    let roll = 0;
    let flicker = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || 640;
      const h = parent?.clientHeight || 360;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Half-res snow keeps the grain analog-fine without filling every CSS pixel.
      snow.width = Math.max(1, Math.floor(w / 2));
      snow.height = Math.max(1, Math.floor(h / 2));
    };

    const fillSnow = () => {
      const w = snow.width;
      const h = snow.height;
      const img = sctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        // High-contrast analog snow (mostly black/white with some mid gray)
        const r = Math.random();
        const v = r > 0.55 ? 255 : r > 0.12 ? ((r * 180) | 0) : 0;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v + (r > 0.97 ? 18 : 0);
        d[i + 3] = 255;
      }
      sctx.putImageData(img, 0, 0);
    };

    const draw = () => {
      if (!running) return;
      const w = canvas.clientWidth || 640;
      const h = canvas.clientHeight || 360;

      fillSnow();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(snow, 0, 0, w, h);

      // Horizontal tear / tracking jitter
      if (Math.random() > 0.65) {
        const gy = (Math.random() * h) | 0;
        const gh = 2 + ((Math.random() * 10) | 0);
        const shift = (Math.random() * 28 - 14) | 0;
        try {
          const slice = ctx.getImageData(0, gy, w, gh);
          ctx.putImageData(slice, shift, gy);
        } catch {
          /* ignore */
        }
      }

      // Fine CRT scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      for (let y = 0; y < h; y += 2) {
        ctx.fillRect(0, y, w, 1);
      }

      // Slow analog V-hold roll (bright band + trailing wash)
      roll = (roll + 1.15) % (h + 120);
      const bandH = Math.max(48, h * 0.22);
      const g = ctx.createLinearGradient(0, roll - bandH, 0, roll + bandH * 0.35);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.55, 'rgba(255,255,255,0.12)');
      g.addColorStop(0.78, 'rgba(255,255,255,0.38)');
      g.addColorStop(0.88, 'rgba(255,255,255,0.55)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, roll - bandH, w, bandH + bandH * 0.35);

      // Bright tracking line
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillRect(0, roll, w, 1.5);

      flicker = 0.88 + Math.random() * 0.14;
      ctx.fillStyle = `rgba(0,0,0,${1 - flicker})`;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener('resize', resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [visible]);

  return (
    <div ref={rootRef} className="absolute inset-0 bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="font-mono text-xs sm:text-sm tracking-[0.45em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.55)]">
          {label}
        </div>
        <div className="mt-2 font-mono text-[10px] tracking-[0.35em] text-white/70">
          — NO INPUT —
        </div>
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.62) 100%)',
        }}
      />
    </div>
  );
}
