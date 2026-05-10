import { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';

const PROJECTS = [
  {
    title: 'Project Alpha',
    tag: '// 001',
    subtitle: 'The one that started it all',
    description: 'Full-stack autonomous system with real-time data pipelines and zero-downtime deployments.',
    stack: ['React', 'Node.js', 'Redis', 'Docker'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/7220020bc_generated_62ef8eda.png',
    link: 'https://github.com/AndrewGrayYouNeeK/project-alpha'
  },
  {
    title: 'Webhook Slayer',
    tag: '// 002',
    subtitle: 'Automating the impossible',
    description: 'High-throughput webhook processing engine designed to chew through millions of events without flinching.',
    stack: ['Go', 'Kafka', 'PostgreSQL', 'K8s'],
    accent: 'magenta',
    link: 'https://github.com/AndrewGrayYouNeeK/We-hook-slayer'
  },
  {
    title: 'Neural Forge',
    tag: '// 003',
    subtitle: 'AI that thinks different',
    description: 'Custom ML pipeline with transformer-based models for predictive analytics at scale.',
    stack: ['Python', 'PyTorch', 'CUDA', 'FastAPI'],
    accent: 'green',
    link: 'https://github.com/AndrewGrayYouNeeK/Real-Neural-Forge'
  },
  {
    title: 'CryptVault',
    tag: '// 004',
    subtitle: 'Unbreakable by design',
    description: 'End-to-end encrypted storage system with zero-knowledge architecture and quantum-safe crypto.',
    stack: ['Rust', 'WebAssembly', 'libsodium', 'IPFS'],
    accent: 'yellow',
    link: 'https://github.com/AndrewGrayYouNeeK/CryptoVault'
  },
  {
    title: 'CloudRipper',
    tag: '// 005',
    subtitle: 'Infrastructure on steroids',
    description: 'Multi-cloud orchestration platform with auto-scaling, cost optimization, and chaos engineering baked in.',
    stack: ['Terraform', 'Pulumi', 'AWS', 'GCP'],
    accent: 'purple',
    link: 'https://github.com/AndrewGrayYouNeeK/Cloudripper'
  },
  {
    title: 'DeathTerminal',
    tag: '// 006',
    subtitle: 'The ultimate CLI',
    description: 'Brutalist terminal emulator with AI-powered autocomplete and cross-platform SSH tunneling.',
    stack: ['Zig', 'Vulkan', 'gRPC', 'Lua'],
    accent: 'red',
    link: 'https://github.com/AndrewGrayYouNeeK/Death-terminal-'
  }
];

export default function ProjectGrid() {
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const items = gridRef.current?.querySelectorAll('.fade-in-up');
    items?.forEach((item, i) => {
      item.style.animationDelay = `${i * 0.12}s`;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-16">
        <span className="font-mono text-xs tracking-[0.4em] text-primary/50 uppercase">
          {'<'} Portfolio {'/>'} 
        </span>
        <div className="mt-4 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((project, i) => (
          <div key={project.title} className="fade-in-up">
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}