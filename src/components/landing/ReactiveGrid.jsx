import { useEffect, useRef } from 'react';

export default function ReactiveGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const mouse = { x: -4000, y: -4000, vx: 0, vy: 0 };
    let points = [];
    let cols = 0;
    let rows = 0;
    let gap = 36;
    let raf = 0;
    let running = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const rebuild = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      gap = w < 768 ? 44 : 34;
      cols = Math.ceil(w / gap) + 3;
      rows = Math.ceil(h / gap) + 3;
      points = new Array(cols * rows);
      let i = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const rx = (x - 1) * gap;
          const ry = (y - 1) * gap;
          points[i++] = { rx, ry, x: rx, y: ry, vx: 0, vy: 0 };
        }
      }
    };

    const onMove = (event) => {
      const nx = event.clientX;
      const ny = event.clientY;
      mouse.vx = nx - mouse.x;
      mouse.vy = ny - mouse.y;
      mouse.x = nx;
      mouse.y = ny;
    };

    const onLeave = () => {
      mouse.x = -4000;
      mouse.y = -4000;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    const RADIUS = 180;
    const RADIUS2 = RADIUS * RADIUS;
    const SPRING = 0.09;
    const DAMP = 0.78;

    const draw = () => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const mx = mouse.x;
      const my = mouse.y;
      const speed = Math.min(Math.hypot(mouse.vx, mouse.vy), 48);
      const force = reduced ? 0 : 0.09 + speed * 0.0035;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < RADIUS2) {
          const d = Math.sqrt(d2) || 0.001;
          const falloff = 1 - d / RADIUS;
          const f = falloff * falloff * force;
          p.vx += (dx / d) * f * 16;
          p.vy += (dy / d) * f * 16;
          p.vx += mouse.vx * f * 0.4;
          p.vy += mouse.vy * f * 0.4;
        }
        p.vx += (p.rx - p.x) * SPRING;
        p.vy += (p.ry - p.y) * SPRING;
        p.vx *= DAMP;
        p.vy *= DAMP;
        p.x += p.vx;
        p.y += p.vy;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'hsla(180, 100%, 50%, 0.07)';
      ctx.beginPath();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const p = points[i];
          if (x < cols - 1) {
            const n = points[i + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(n.x, n.y);
          }
          if (y < rows - 1) {
            const n = points[i + cols];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(n.x, n.y);
          }
        }
      }
      ctx.stroke();

      ctx.lineWidth = 1.25;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const p = points[i];
          const dist = Math.hypot(p.x - mx, p.y - my);
          if (dist > 230) continue;
          const glow = 1 - dist / 230;
          ctx.strokeStyle = `hsla(180, 100%, 65%, ${0.08 + glow * 0.45})`;
          ctx.beginPath();
          if (x < cols - 1) {
            const n = points[i + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(n.x, n.y);
          }
          if (y < rows - 1) {
            const n = points[i + cols];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(n.x, n.y);
          }
          ctx.stroke();

          ctx.fillStyle = `hsla(${180 + glow * 80}, 100%, ${60 + glow * 20}%, ${0.2 + glow * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.1 + glow * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (mx > -1000) {
        const gradient = ctx.createRadialGradient(mx, my, 8, mx, my, RADIUS);
        gradient.addColorStop(0, 'hsla(300, 100%, 55%, 0.08)');
        gradient.addColorStop(0.45, 'hsla(180, 100%, 50%, 0.04)');
        gradient.addColorStop(1, 'hsla(180, 100%, 50%, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mx, my, RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      mouse.vx *= 0.86;
      mouse.vy *= 0.86;
      raf = requestAnimationFrame(draw);
    };

    rebuild();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', rebuild);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', rebuild);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
