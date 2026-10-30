import MatrixRain from '../components/landing/MatrixRain';
import ReactiveGrid from '../components/landing/ReactiveGrid';
import GlitchHero from '../components/landing/GlitchHero';
import ProjectGrid from '../components/landing/ProjectGrid';
import CyberFooter from '../components/landing/CyberFooter';

export default function Landing() {
  return (
    <div className="scanline-overlay min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <ReactiveGrid />
      <MatrixRain />
      <GlitchHero />
      <ProjectGrid />
      <CyberFooter />
    </div>
  );
}