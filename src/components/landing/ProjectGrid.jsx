import { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';

const PROJECTS = [
  // BEGINNER - Simple fundamentals
  {
    title: 'Todo List',
    tag: '// 001',
    subtitle: 'Task management basics',
    description: 'Simple task tracker with add, delete, and mark complete functionality. Great starter project.',
    stack: ['React', 'Local Storage'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/51765f1b1_generated_image.png',
    link: ''
  },
  {
    title: 'Calculator',
    tag: '// 002',
    subtitle: 'Math operations',
    description: 'Full-featured calculator with advanced operations and expression parsing.',
    stack: ['React', 'JavaScript'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/c58d29a8d_generated_image.png',
    link: ''
  },
  {
    title: 'Weather App',
    tag: '// 003',
    subtitle: 'API integration basics',
    description: 'Fetch and display weather data with real-time updates and location services.',
    stack: ['React', 'Axios', 'Weather API', 'Geolocation'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/44155550a_generated_image.png',
    link: ''
  },

  // INTERMEDIATE - Core skills
  {
    title: 'Note Keeper',
    tag: '// 004',
    subtitle: 'Document management',
    description: 'Rich text note taking with search, categories, and cloud synchronization.',
    stack: ['React', 'Firebase', 'Quill', 'Node.js'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/038bc7b43_generated_image.png',
    link: ''
  },
  {
    title: 'Habit Tracker',
    tag: '// 005',
    subtitle: 'Analytics dashboard',
    description: 'Track daily habits with streaks, analytics, and motivational insights.',
    stack: ['React', 'Chart.js', 'MongoDB', 'Express'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/fbb7970ea_generated_image.png',
    link: ''
  },
  {
    title: 'Puzzle Master',
    tag: '// 006',
    subtitle: 'Game engine',
    description: 'Puzzle game with AI solver, level generation, and leaderboards.',
    stack: ['Phaser', 'React', 'Node.js', 'Algorithms'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/51765f1b1_generated_image.png',
    link: ''
  },

  // INTERMEDIATE-ADVANCED - Backend & databases
  {
    title: 'SecurePass',
    tag: '// 007',
    subtitle: 'Password management',
    description: 'Encrypted password vault with two-factor authentication and breach monitoring.',
    stack: ['Rust', 'SQLite', 'Crypto', 'React'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/15d876223_generated_image.png',
    link: ''
  },
  {
    title: 'CloudSync',
    tag: '// 008',
    subtitle: 'File storage system',
    description: 'Distributed file storage with versioning, sharing, and S3 integration.',
    stack: ['AWS S3', 'Node.js', 'React', 'PostgreSQL'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/0e3abd5dc_generated_image.png',
    link: ''
  },
  {
    title: 'Messenger Pro',
    tag: '// 009',
    subtitle: 'Real-time chat',
    description: 'Instant messaging with video calls, encryption, and offline support.',
    stack: ['Socket.io', 'React', 'Node.js', 'MongoDB'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/830ee747f_generated_image.png',
    link: ''
  },
  {
    title: 'Dashboard Pro',
    tag: '// 010',
    subtitle: 'Analytics platform',
    description: 'Real-time data visualization with drill-down analytics and custom widgets.',
    stack: ['React', 'D3.js', 'ClickHouse', 'WebSocket'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/44155550a_generated_image.png',
    link: ''
  },

  // ADVANCED - Complex systems
  {
    title: 'SocialFlow',
    tag: '// 011',
    subtitle: 'Social network',
    description: 'User profiles, feed algorithms, notifications, and real-time presence tracking.',
    stack: ['React', 'Node.js', 'GraphQL', 'PostgreSQL'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/f47d1b9df_generated_image.png',
    link: ''
  },
  {
    title: 'ShopHub',
    tag: '// 012',
    subtitle: 'E-commerce platform',
    description: 'Full shopping experience with payment processing, inventory, and analytics.',
    stack: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/106148635_generated_image.png',
    link: ''
  },
  {
    title: 'StreamBox',
    tag: '// 013',
    subtitle: 'Video platform',
    description: 'Adaptive bitrate streaming with CDN delivery and real-time transcoding.',
    stack: ['FFmpeg', 'HLS', 'React', 'Node.js'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/65c675c28_generated_image.png',
    link: ''
  },
  {
    title: 'EmailEngine',
    tag: '// 014',
    subtitle: 'Mail server',
    description: 'SMTP/IMAP server with spam filtering, encryption, and high availability.',
    stack: ['Go', 'IMAP', 'SMTP', 'Postgres'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/c58d29a8d_generated_image.png',
    link: ''
  },
  {
    title: 'BlockSimulation',
    tag: '// 015',
    subtitle: 'Blockchain network',
    description: 'Full blockchain implementation with consensus, smart contracts, and mining.',
    stack: ['Rust', 'Solidity', 'Crypto', 'Networking'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/038bc7b43_generated_image.png',
    link: ''
  },

  // EXPERT - Infrastructure & systems
  {
    title: 'Webhook Slayer',
    tag: '// 016',
    subtitle: 'Automating the impossible',
    description: 'High-throughput webhook processing engine designed to chew through millions of events without flinching.',
    stack: ['Go', 'Kafka', 'PostgreSQL', 'K8s'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/b6c1ccf7a_generated_9a99b9a8.png',
    link: 'https://github.com/AndrewGrayYouNeeK/We-hook-slayer'
  },
  {
    title: 'MLServe',
    tag: '// 017',
    subtitle: 'ML model serving',
    description: 'Deploy and serve ML models with batching, versioning, and auto-scaling.',
    stack: ['TensorFlow', 'FastAPI', 'Docker', 'Kubernetes'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/aa248777f_generated_image.png',
    link: ''
  },
  {
    title: 'CacheRush',
    tag: '// 018',
    subtitle: 'Distributed caching',
    description: 'High-performance cache layer with LRU eviction and consistent hashing.',
    stack: ['Rust', 'Redis', 'memcached', 'C++'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/379adf1aa_generated_image.png',
    link: ''
  },
  {
    title: 'DistributedDB',
    tag: '// 019',
    subtitle: 'Database system',
    description: 'Distributed database with ACID transactions, replication, and sharding.',
    stack: ['Raft', 'RocksDB', 'Rust', 'Networking'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/0e3abd5dc_generated_image.png',
    link: ''
  },
  {
    title: 'CompilerOptimizer',
    tag: '// 020',
    subtitle: 'Code optimization',
    description: 'Advanced compiler optimizations with vectorization and parallelization.',
    stack: ['LLVM', 'Rust', 'Assembly', 'GCC'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/830ee747f_generated_image.png',
    link: ''
  },
  {
    title: 'KernelOS',
    tag: '// 021',
    subtitle: 'Operating system',
    description: 'Microkernel OS with memory management, scheduling, and device drivers.',
    stack: ['Assembly', 'C', 'x86', 'Bootloaders'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/65c675c28_generated_image.png',
    link: ''
  },

  // CUTTING-EDGE - Advanced AI/ML
  {
    title: 'Neural Forge',
    tag: '// 022',
    subtitle: 'AI that thinks different',
    description: 'Custom ML pipeline with transformer-based models for predictive analytics at scale.',
    stack: ['Python', 'PyTorch', 'CUDA', 'FastAPI'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/2400b20af_generated_24c3bba4.png',
    link: 'https://github.com/AndrewGrayYouNeeK/Real-Neural-Forge'
  },
  {
    title: 'LanguageModel',
    tag: '// 023',
    subtitle: 'LLM training',
    description: 'Large language model with transformer architecture and fine-tuning support.',
    stack: ['PyTorch', 'Transformers', 'CUDA', 'Distributed Training'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/106148635_generated_image.png',
    link: ''
  },
  {
    title: 'AutonomeDrive',
    tag: '// 024',
    subtitle: 'Self-driving system',
    description: 'Real-time perception, planning, and control for autonomous vehicles.',
    stack: ['TensorFlow', 'ROS', 'CUDA', 'C++'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/81947afee_generated_image.png',
    link: ''
  },
  {
    title: 'RealTimeRender',
    tag: '// 025',
    subtitle: '3D engine',
    description: 'Real-time 3D renderer with ray tracing, global illumination, and physics.',
    stack: ['Vulkan', 'C++', 'Raytracing', 'Physics Engine'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/f47d1b9df_generated_image.png',
    link: ''
  },
  {
    title: 'ARExperience',
    tag: '// 026',
    subtitle: 'Augmented reality',
    description: 'Mobile AR platform with real-time object tracking and rendering.',
    stack: ['ARKit', 'Unity', 'Swift', 'Metal'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/fbb7970ea_generated_image.png',
    link: ''
  },

  // THEORETICAL - Physics & quantum
  {
    title: 'CryptVault',
    tag: '// 027',
    subtitle: 'Unbreakable by design',
    description: 'End-to-end encrypted storage system with zero-knowledge architecture and quantum-safe crypto.',
    stack: ['Rust', 'WebAssembly', 'libsodium', 'IPFS'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/a573e335b_generated_0733585f.png',
    link: 'https://github.com/AndrewGrayYouNeeK/CryptoVault'
  },
  {
    title: 'QuantumCompute',
    tag: '// 028',
    subtitle: 'Quantum algorithms',
    description: 'Quantum circuit simulation with Shor and Grover algorithm implementations.',
    stack: ['Qiskit', 'Python', 'Q#', 'Julia'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/82e5da787_generated_image.png',
    link: ''
  },
  {
    title: 'QuantumML',
    tag: '// 029',
    subtitle: 'Quantum ML',
    description: 'Machine learning on quantum computers with variational circuits.',
    stack: ['Qiskit', 'PyTorch', 'Quantum Hardware', 'Optimization'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/aa248777f_generated_image.png',
    link: ''
  },
  {
    title: 'SpaceNav',
    tag: '// 030',
    subtitle: 'Orbital mechanics',
    description: 'Accurate orbital simulation with N-body physics and trajectory optimization.',
    stack: ['Python', 'Numpy', 'CUDA', 'Unity'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/ffbf4966a_generated_image.png',
    link: ''
  },
  {
    title: 'FusionReactor',
    tag: '// 031',
    subtitle: 'Plasma simulation',
    description: 'Nuclear fusion reactor simulation with plasma confinement and energy output.',
    stack: ['C++', 'CUDA', 'OpenFOAM', 'MATLAB'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/68cfd96ad_generated_image.png',
    link: ''
  },
  {
    title: 'BioGenesis',
    tag: '// 032',
    subtitle: 'Genetic algorithms',
    description: 'Artificial life simulation with evolution, mutation, and natural selection.',
    stack: ['Rust', 'WASM', 'WebGL', 'Genetic Algorithms'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/cb949cd46_generated_image.png',
    link: ''
  },

  // REALITY-BREAKING - Beyond physics
  {
    title: 'CloudRipper',
    tag: '// 033',
    subtitle: 'Infrastructure on steroids',
    description: 'Multi-cloud orchestration platform with auto-scaling, cost optimization, and chaos engineering baked in.',
    stack: ['Terraform', 'Pulumi', 'AWS', 'GCP'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/139d7ddcb_generated_3cc52c4c.png',
    link: 'https://github.com/AndrewGrayYouNeeK/Cloudripper'
  },
  {
    title: 'DeathTerminal',
    tag: '// 034',
    subtitle: 'The ultimate CLI',
    description: 'Brutalist terminal emulator with AI-powered autocomplete and cross-platform SSH tunneling.',
    stack: ['Zig', 'Vulkan', 'gRPC', 'Lua'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/dd96dafcd_generated_dc211d43.png',
    link: 'https://github.com/AndrewGrayYouNeeK/Death-terminal-'
  },
  {
    title: 'OmniCompiler',
    tag: '// 035',
    subtitle: 'Universal transcoding',
    description: 'Language agnostic compiler with IR optimization and cross-platform targeting.',
    stack: ['LLVM', 'Rust', 'Compiler Design', 'AST'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/c5bda856d_generated_image.png',
    link: ''
  },
  {
    title: 'SingularityEngine',
    tag: '// 036',
    subtitle: 'AGI framework',
    description: 'Artificial General Intelligence with self-improvement loops and meta-learning.',
    stack: ['TensorFlow', 'PyTorch', 'Transformers', 'Reinforcement Learning'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/5b4cd1819_generated_image.png',
    link: ''
  },
  {
    title: 'ChronoShift',
    tag: '// 037',
    subtitle: 'Temporal mechanics',
    description: 'Time manipulation engine with causality preservation and timeline branching.',
    stack: ['Rust', 'Graph DB', 'Event Sourcing', 'CRDT'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/93ff55d29_generated_image.png',
    link: ''
  },
  {
    title: 'GodMode',
    tag: '// 038',
    subtitle: 'Omniscient system',
    description: 'All-seeing architecture with perfect state awareness and infinite recursion handling.',
    stack: ['Advanced Topology', 'Category Theory', 'Proof Assistants'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/2078df88f_generated_image.png',
    link: ''
  },
  {
    title: 'UniverseSimulator',
    tag: '// 039',
    subtitle: 'Multiverse traversal',
    description: 'Full universe simulation engine with quantum mechanics and relativity.',
    stack: ['GPU Computing', 'Physics Engine', 'Visualization'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/656431b44_generated_image.png',
    link: ''
  },
  {
    title: 'AbsoluteKernel',
    tag: '// 040',
    subtitle: 'Fundamental reality',
    description: 'Base layer of existence with axiom encoding and paradox resolution.',
    stack: ['Theoretical Physics', 'Quantum Logic', 'Metaphysics'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/5eda35880_generated_image.png',
    link: ''
  },
  {
    title: 'QuantumPortal',
    tag: '// 041',
    subtitle: 'Entanglement bridge',
    description: 'Quantum teleportation protocol with Bell state preparation and measurement.',
    stack: ['Qiskit', 'Cirq', 'Quantum Hardware', 'Python'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/2fc420b6b_generated_image.png',
    link: ''
  },
  {
    title: 'NanoFabrication',
    tag: '// 042',
    subtitle: 'Molecular computing',
    description: 'Atomic-scale computation simulation with molecular dynamics.',
    stack: ['LAMMPS', 'GROMACS', 'Simulation', 'Molecular Design'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/379adf1aa_generated_image.png',
    link: ''
  },
  {
    title: 'HolographicInterface',
    tag: '// 043',
    subtitle: 'Spatial computing',
    description: 'Holographic projection with volumetric rendering and gesture recognition.',
    stack: ['Spatial Computing', 'Computer Vision', 'Physics'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/81947afee_generated_image.png',
    link: ''
  },
  {
    title: 'DimensionalBridge',
    tag: '// 044',
    subtitle: 'Topology tunneling',
    description: 'Cross-dimensional communication protocol with manifold folding.',
    stack: ['Differential Geometry', 'Topology', 'Quantum Field Theory'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/ffbf4966a_generated_image.png',
    link: ''
  },
  {
    title: 'RealityRender',
    tag: '// 045',
    subtitle: 'Universe projection',
    description: 'Fundamental reality rendering with axiom constraints and paradox resolution.',
    stack: ['Mathematical Physics', 'Set Theory', 'Logic'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/82e5da787_generated_image.png',
    link: ''
  },
  {
    title: 'ParallelWorlds',
    tag: '// 046',
    subtitle: 'Multiverse engine',
    description: 'Branching timeline management with coherence preservation.',
    stack: ['Category Theory', 'Sheaf Theory', 'Quantum Logic'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/cb949cd46_generated_image.png',
    link: ''
  },
  {
    title: 'ConsciousMind',
    tag: '// 047',
    subtitle: 'Artificial consciousness',
    description: 'Self-aware AGI with qualia simulation and phenomenal consciousness.',
    stack: ['Philosophy of Mind', 'Neuroscience', 'Advanced AI'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/68cfd96ad_generated_image.png',
    link: ''
  },
  {
    title: 'ExistenceOS',
    tag: '// 048',
    subtitle: 'Reality kernel',
    description: 'Operating system for the universe itself with omniscient scheduler.',
    stack: ['Theoretical Everything', 'Metaphysics', 'Divinity'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/5b4cd1819_generated_image.png',
    link: ''
  },
  {
    title: 'InfinityEngine',
    tag: '// 049',
    subtitle: 'Boundless computation',
    description: 'Computing platform with infinite resources and transcendent capabilities.',
    stack: ['Beyond Computation', 'Infinite Recursion', 'Eternity'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/2fc420b6b_generated_image.png',
    link: ''
  },
  {
    title: 'Omniscience',
    tag: '// 050',
    subtitle: 'All-knowing system',
    description: 'System that knows and can do absolutely everything—literally.',
    stack: ['Infinity', 'Beyond Math', 'Pure Thought'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/5eda35880_generated_image.png',
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