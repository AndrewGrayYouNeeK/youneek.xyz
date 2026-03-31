import MatrixRain from '../components/landing/MatrixRain';
import GlitchHero from '../components/landing/GlitchHero';
import ProjectGrid from '../components/landing/ProjectGrid';
import CyberFooter from '../components/landing/CyberFooter';

export default function Landing() {
  return (
    <div className="scanline-overlay min-h-screen bg-background text-foreground overflow-x-hidden">
      <MatrixRain />
      <GlitchHero />
      <ProjectGrid />
      <CyberFooter />
    </div>
  );
}