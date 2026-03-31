import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function GlitchHero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(180 100% 50% / 0.15) 1px, transparent 1px),
            linear-gradient(90deg, hsl(180 100% 50% / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(180 100% 50% / 0.3) 0%, transparent 70%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={loaded ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center"
      >
        {/* Top tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6"
        >
          <span className="font-mono text-sm tracking-[0.3em] text-primary/60 border border-primary/20 px-4 py-2 inline-block">
            {'>'} SYSTEM.INITIALIZED_
          </span>
        </motion.div>

        {/* Main headline */}
        <h1
          className="glitch-text neon-text font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-primary leading-none"
          data-text="MY PROJECTS"
        >
          MY PROJECTS
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 font-mono text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
        >
          Unique shit I built—no excuses
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={loaded ? { scaleX: 1 } : {}}
          transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"
        />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-mono text-xs text-primary/40 tracking-widest">SCROLL</span>
            <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}