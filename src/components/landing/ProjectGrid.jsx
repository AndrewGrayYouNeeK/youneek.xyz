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
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/b6c1ccf7a_generated_9a99b9a8.png',
    link: 'https://github.com/AndrewGrayYouNeeK/We-hook-slayer'
  },
  {
    title: 'Neural Forge',
    tag: '// 003',
    subtitle: 'AI that thinks different',
    description: 'Custom ML pipeline with transformer-based models for predictive analytics at scale.',
    stack: ['Python', 'PyTorch', 'CUDA', 'FastAPI'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/2400b20af_generated_24c3bba4.png',
    link: 'https://github.com/AndrewGrayYouNeeK/Real-Neural-Forge'
  },
  {
    title: 'CryptVault',
    tag: '// 004',
    subtitle: 'Unbreakable by design',
    description: 'End-to-end encrypted storage system with zero-knowledge architecture and quantum-safe crypto.',
    stack: ['Rust', 'WebAssembly', 'libsodium', 'IPFS'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/a573e335b_generated_0733585f.png',
    link: 'https://github.com/AndrewGrayYouNeeK/CryptoVault'
  },
  {
    title: 'CloudRipper',
    tag: '// 005',
    subtitle: 'Infrastructure on steroids',
    description: 'Multi-cloud orchestration platform with auto-scaling, cost optimization, and chaos engineering baked in.',
    stack: ['Terraform', 'Pulumi', 'AWS', 'GCP'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/139d7ddcb_generated_3cc52c4c.png',
    link: 'https://github.com/AndrewGrayYouNeeK/Cloudripper'
  },
  {
    title: 'DeathTerminal',
    tag: '// 006',
    subtitle: 'The ultimate CLI',
    description: 'Brutalist terminal emulator with AI-powered autocomplete and cross-platform SSH tunneling.',
    stack: ['Zig', 'Vulkan', 'gRPC', 'Lua'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/dd96dafcd_generated_dc211d43.png',
    link: 'https://github.com/AndrewGrayYouNeeK/Death-terminal-'
  },
  {
    title: 'Neural Net',
    tag: '// 007',
    subtitle: 'Machine learning infrastructure',
    description: 'Deep learning acceleration platform with distributed training and auto-differentiation engine.',
    stack: ['TensorFlow', 'CUDA', 'Python', 'JAX'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/effcfc961_generated_image.png',
    link: ''
  },
  {
    title: 'BlockChain',
    tag: '// 008',
    subtitle: 'Distributed ledger protocol',
    description: 'Consensus mechanism with smart contract execution and Byzantine fault tolerance.',
    stack: ['Solidity', 'Rust', 'EVM', 'Cairo'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/7b4358086_generated_image.png',
    link: ''
  },
  {
    title: 'QuantumOS',
    tag: '// 009',
    subtitle: 'Quantum computing framework',
    description: 'Quantum algorithm simulator with noise modeling and quantum error correction routines.',
    stack: ['Q#', 'Qiskit', 'Python', 'C++'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/73f00fed2_generated_image.png',
    link: ''
  },
  {
    title: 'APIGateway',
    tag: '// 010',
    subtitle: 'Enterprise API management',
    description: 'Rate limiting, authentication, and request routing with sub-millisecond latency.',
    stack: ['Lua', 'NGINX', 'Go', 'Redis'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/6f255a904_generated_image.png',
    link: ''
  },
  {
    title: 'DataLake',
    tag: '// 011',
    subtitle: 'Unified data warehouse',
    description: 'Petabyte-scale analytics engine with columnar storage and vectorized execution.',
    stack: ['Apache Arrow', 'Parquet', 'SQL', 'Rust'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/488b89050_generated_image.png',
    link: ''
  },
  {
    title: 'EdgeCompute',
    tag: '// 012',
    subtitle: 'Distributed edge runtime',
    description: 'Serverless functions at network edge with automatic failover and geo-redundancy.',
    stack: ['WebAssembly', 'Rust', 'gRPC', 'Kubernetes'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/9328df08a_generated_image.png',
    link: ''
  },
  {
    title: 'CloudMesh',
    tag: '// 013',
    subtitle: 'Multi-cloud fabric',
    description: 'Service mesh for seamless cross-cloud communication with traffic management.',
    stack: ['Envoy', 'Go', 'Protobuf', 'YAML'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/5e15c703a_generated_image.png',
    link: ''
  },
  {
    title: 'DevOps Flow',
    tag: '// 014',
    subtitle: 'CI/CD automation platform',
    description: 'Unified pipeline orchestration with GitOps integration and real-time deployment tracking.',
    stack: ['Terraform', 'GitHub Actions', 'ArgoCD', 'Helm'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/03cb4132c_generated_image.png',
    link: ''
  },
  {
    title: 'StreamDB',
    tag: '// 015',
    subtitle: 'Event streaming database',
    description: 'Real-time data streaming with temporal queries and event-driven architecture support.',
    stack: ['Kafka', 'PostgreSQL', 'Rust', 'TimescaleDB'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/c67147959_generated_image.png',
    link: ''
  },
  {
    title: 'MicroCore',
    tag: '// 016',
    subtitle: 'Microservices framework',
    description: 'Lightweight service framework with built-in observability, tracing, and metrics.',
    stack: ['Rust', 'Tokio', 'OpenTelemetry', 'Prometheus'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/4aa9bb1ee_generated_image.png',
    link: ''
  },
  {
    title: 'IOTHub',
    tag: '// 017',
    subtitle: 'IoT device management',
    description: 'MQTT broker with device provisioning, OTA updates, and real-time telemetry ingestion.',
    stack: ['MQTT', 'Python', 'Postgres', 'Node-RED'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/72824fbb5_generated_image.png',
    link: ''
  },
  {
    title: 'VisionAI',
    tag: '// 018',
    subtitle: 'Computer vision platform',
    description: 'Real-time object detection and image processing with edge deployment support.',
    stack: ['PyTorch', 'OpenCV', 'ONNX', 'TensorRT'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/d4d97493c_generated_image.png',
    link: ''
  },
  {
    title: 'SpeechEngine',
    tag: '// 019',
    subtitle: 'Speech processing platform',
    description: 'Real-time STT, TTS, and speaker recognition with multilingual support.',
    stack: ['OpenAI Whisper', 'gTTS', 'PyAudio', 'TensorFlow'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/15e0a9bbe_generated_image.png',
    link: ''
  },
  {
    title: 'MonitorPro',
    tag: '// 020',
    subtitle: 'Observability stack',
    description: 'Metrics, logs, and traces aggregation with anomaly detection and alerting.',
    stack: ['Prometheus', 'Grafana', 'ELK Stack', 'Jaeger'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/09d9156e5_generated_image.png',
    link: ''
  },
  {
    title: 'SecureVault',
    tag: '// 021',
    subtitle: 'Secrets management system',
    description: 'Zero-trust secret storage with automatic rotation and audit logging.',
    stack: ['Go', 'HSM', 'Vault', 'PostgreSQL'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/d8e915925_generated_image.png',
    link: ''
  },
  {
    title: 'NetworkMesh',
    tag: '// 022',
    subtitle: 'Advanced networking layer',
    description: 'Software-defined networking with dynamic routing and traffic engineering.',
    stack: ['BIRD', 'VPP', 'eBPF', 'Go'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/12f697560_generated_image.png',
    link: ''
  },
  {
    title: 'AutoScale',
    tag: '// 023',
    subtitle: 'Intelligent scaling engine',
    description: 'ML-powered auto-scaling with predictive load balancing and cost optimization.',
    stack: ['Python', 'scikit-learn', 'Kubernetes', 'Prometheus'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/82319e0ad_generated_image.png',
    link: ''
  },
  {
    title: 'TestForge',
    tag: '// 024',
    subtitle: 'Testing automation framework',
    description: 'Distributed test execution with chaos engineering and performance profiling.',
    stack: ['Rust', 'pytest', 'k6', 'Docker'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/7b9aea00c_generated_image.png',
    link: ''
  },
  {
    title: 'Web3Stack',
    tag: '// 025',
    subtitle: 'Decentralized infrastructure',
    description: 'IPFS integration, smart contract deployment, and web3 toolkit suite.',
    stack: ['Solidity', 'Web3.js', 'IPFS', 'Hardhat'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/612c8eaa6_generated_image.png',
    link: ''
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