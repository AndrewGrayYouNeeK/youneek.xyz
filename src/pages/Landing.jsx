import ProjectGrid from '../components/landing/ProjectGrid';
import CyberFooter from '../components/landing/CyberFooter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#07080c] text-[#e7f2f2]">
      <ProjectGrid />
      <CyberFooter />
    </div>
  );
}
