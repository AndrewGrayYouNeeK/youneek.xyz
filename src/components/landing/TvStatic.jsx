import { useEffect, useRef, useState } from 'react';

/**
 * CRT-style white noise with a rolling scan band for empty previews.
 * Animation only runs while the element is on-screen.
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
    let raf = 0;
    let running = true;
    let roll = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || 640;
      const h = parent?.clientHeight || 360;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!running) return;
      const w = canvas.clientWidth || 640;
      const h = canvas.clientHeight || 360;

      // Sparse noise for performance (blocky CRT look)
      const block = 4;
      for (let y = 0; y < h; y += block) {
        for (let x = 0; x < w; x += block) {
          const v = (Math.random() * 255) | 0;
          const tint = Math.random() > 0.92 ? 40 : 0;
          ctx.fillStyle = `rgb(${v},${v + tint},${v + tint})`;
          ctx.fillRect(x, y, block, block);
        }
      }

      // Soft scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }

      // Rolling bright band (V-hold / scan roll)
      roll = (roll + 2.4) % (h + 80);
      const band = ctx.createLinearGradient(0, roll - 40, 0, roll + 40);
      band.addColorStop(0, 'rgba(255,255,255,0)');
      band.addColorStop(0.45, 'rgba(220,255,255,0.22)');
      band.addColorStop(0.55, 'rgba(255,255,255,0.35)');
      band.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = band;
      ctx.fillRect(0, roll - 40, w, 80);

      // Occasional glitch tear
      if (Math.random() > 0.9) {
        const gy = (Math.random() * h) | 0;
        const gh = 4 + ((Math.random() * 18) | 0);
        const shift = (Math.random() * 40 - 20) | 0;
        try {
          const slice = ctx.getImageData(0, gy, w, gh);
          ctx.putImageData(slice, shift, gy);
        } catch {
          /* ignore */
        }
      }

      // Cyan/magenta fringe
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(0,255,255,0.04)';
      ctx.fillRect(1, 0, w, h);
      ctx.fillStyle = 'rgba(255,0,255,0.03)';
      ctx.fillRect(-1, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

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
        <div className="font-mono text-xs sm:text-sm tracking-[0.35em] text-white/80 drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
          {label}
        </div>
        <div className="mt-2 font-mono text-[10px] tracking-widest text-white/45">
          CH — · · ·  NO INPUT
        </div>
      </div>
      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
