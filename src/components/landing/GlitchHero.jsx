import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function GlitchHero() {
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
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
          YouNeeK shit I built—no excuses
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={loaded ? { scaleX: 1 } : {}}
          transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"
        />

        {/* Launch Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          onClick={() => setShowModal(true)}
          className="mt-10 px-8 py-3 border border-primary/50 text-primary font-mono text-sm hover:border-primary hover:shadow-[0_0_20px_hsl(180,100%,50%,0.3)] transition-all duration-300"
        >
          {'>'} LAUNCH LIVE DEMO
        </motion.button>

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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-primary hover:text-primary/50 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="w-full aspect-video rounded-lg border border-primary/30 bg-background shadow-[0_0_30px_hsl(180,100%,50%,0.2)] flex flex-col items-center justify-center gap-4 p-8">
              <p className="glitch-text neon-text font-heading text-4xl sm:text-6xl font-black tracking-tight text-primary">
                YouNeeK.xyz
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Live site preview — this page, running locally
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}