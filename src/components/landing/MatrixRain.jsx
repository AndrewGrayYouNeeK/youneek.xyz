import { useEffect, useRef } from 'react';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

export default function MatrixRain() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cols = Math.floor(window.innerWidth / 20);
    const chars = [];

    for (let i = 0; i < cols; i++) {
      const span = document.createElement('span');
      span.className = 'matrix-char';
      span.style.left = `${i * 20}px`;
      span.style.animationDuration = `${3 + Math.random() * 7}s`;
      span.style.animationDelay = `${Math.random() * 5}s`;
      span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
      container.appendChild(span);
      chars.push(span);
    }

    const interval = setInterval(() => {
      chars.forEach(span => {
        span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
      });
    }, 200);

    return () => {
      clearInterval(interval);
      chars.forEach(c => c.remove());
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0" />;
}