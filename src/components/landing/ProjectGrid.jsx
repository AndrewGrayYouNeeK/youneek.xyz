import { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';

const PROJECTS = [
  {
    title: 'Project Alpha',
    tag: '// 001',
    subtitle: 'The one that started it all',
    description: 'Full-stack autonomous system with real-time data pipelines and zero-downtime deployments.',
    stack: ['React', 'Node.js', 'Redis', 'Docker'],
    image: '/__generating__/img_82894ce4a0fe.png',
    link: '#'
  },
  {
    title: 'Webhook Slayer',
    tag: '// 002',
    subtitle: 'Automating the impossible',
    description: 'High-throughput webhook processing engine handling 10M+ events/day without breaking a sweat.',
    stack: ['Go', 'Kafka', 'PostgreSQL', 'K8s'],
    image: '/__generating__/img_117be98e47ba.png',
    link: '#'
  },
  {
    title: 'Neural Forge',
    tag: '// 003',
    subtitle: 'AI that thinks different',
    description: 'Custom ML pipeline with transformer-based models for predictive analytics at scale.',
    stack: ['Python', 'PyTorch', 'CUDA', 'FastAPI'],
    image: '/__generating__/img_b2b81b65bbf2.png',
    link: '#'
  },
  {
    title: 'CryptVault',
    tag: '// 004',
    subtitle: 'Unbreakable by design',
    description: 'End-to-end encrypted storage system with zero-knowledge architecture and quantum-safe crypto.',
    stack: ['Rust', 'WebAssembly', 'libsodium', 'IPFS'],
    image: '/__generating__/img_a3b8dc168387.png',
    link: '#'
  },
  {
    title: 'CloudRipper',
    tag: '// 005',
    subtitle: 'Infrastructure on steroids',
    description: 'Multi-cloud orchestration platform with auto-scaling, cost optimization, and chaos engineering.',
    stack: ['Terraform', 'AWS', 'GCP', 'Pulumi'],
    image: '/__generating__/img_2ed9de396c34.png',
    link: '#'
  },
  {
    title: 'DeathTerminal',
    tag: '// 006',
    subtitle: 'The ultimate CLI',
    description: 'Brutalist terminal emulator with AI-powered autocomplete and cross-platform SSH tunneling.',
    stack: ['Zig', 'Vulkan', 'gRPC', 'Lua'],
    image: '/__generating__/img_a49ec3b9cd73.png',
    link: '#'
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