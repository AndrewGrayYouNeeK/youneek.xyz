import { Github, Twitter, Mail } from 'lucide-react';

export default function CyberFooter() {
  return (
    <footer className="relative z-10 border-t border-border/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left - Attribution */}
          <div className="text-center sm:text-left">
            <p className="font-mono text-sm text-muted-foreground">
              Built by{' '}
              <span className="text-primary font-bold neon-text">
                Andrew Gray
              </span>
              {' '}|{' '}
              <span className="text-foreground/60">
                {new Date().getFullYear()}
              </span>
            </p>
            <p className="font-mono text-xs text-muted-foreground/40 mt-1">
              {'>'} no templates. no frameworks. no excuses._
            </p>
          </div>

          {/* Right - Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AndrewGrayYouNeeK"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 border border-border/30 rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_15px_hsl(180,100%,50%,0.2)]"
            >
              <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 border border-border/30 rounded-lg hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_15px_hsl(300,100%,50%,0.2)]"
            >
              <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
            </a>
            <a
              href="mailto:you@example.com"
              className="group p-3 border border-border/30 rounded-lg hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_15px_hsl(120,100%,50%,0.2)]"
            >
              <Mail className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-6 border-t border-border/10 text-center">
          <p className="font-mono text-xs text-muted-foreground/30 tracking-widest">
            ██ SYSTEM.ONLINE ██ ALL.RIGHTS.RESERVED ██ HACK.THE.PLANET ██
          </p>
        </div>
      </div>
    </footer>
  );
}