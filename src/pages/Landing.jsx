import MatrixRain from '../components/landing/MatrixRain';
import GlitchHero from '../components/landing/GlitchHero';
import ProjectGrid from '../components/landing/ProjectGrid';
import CyberFooter from '../components/landing/CyberFooter';

export default function Landing() {
  return (
    <div className="scanline-overlay min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Corrupted motherboard background */}
      <div
        className="fixed inset-0 z-0 opacity-60"
        style={{
          backgroundImage: 'url(https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/6caa1428f_generated_image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/40 via-background/30 to-background/40" />
      
      <MatrixRain />
      <GlitchHero />
      <ProjectGrid />
      <CyberFooter />
    </div>
  );
}