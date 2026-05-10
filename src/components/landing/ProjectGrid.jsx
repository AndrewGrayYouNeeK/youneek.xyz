import { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';

const PROJECTS = [
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
    title: 'Weather App',
    tag: '// 002',
    subtitle: 'API integration basics',
    description: 'Fetch and display weather data with real-time updates and location services.',
    stack: ['React', 'Axios', 'Weather API', 'Geolocation'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/44155550a_generated_image.png',
    link: ''
  },
  {
    title: 'Calculator',
    tag: '// 003',
    subtitle: 'Math operations',
    description: 'Full-featured calculator with advanced operations and expression parsing.',
    stack: ['React', 'JavaScript'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/c58d29a8d_generated_image.png',
    link: ''
  },
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
    title: 'SecurePass',
    tag: '// 006',
    subtitle: 'Password management',
    description: 'Encrypted password vault with two-factor authentication and breach monitoring.',
    stack: ['Rust', 'SQLite', 'Crypto', 'React'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/15d876223_generated_image.png',
    link: ''
  },
  {
    title: 'CloudSync',
    tag: '// 007',
    subtitle: 'File storage system',
    description: 'Distributed file storage with versioning, sharing, and S3 integration.',
    stack: ['AWS S3', 'Node.js', 'React', 'PostgreSQL'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/0e3abd5dc_generated_image.png',
    link: ''
  },
  {
    title: 'Messenger Pro',
    tag: '// 008',
    subtitle: 'Real-time chat',
    description: 'Instant messaging with video calls, encryption, and offline support.',
    stack: ['Socket.io', 'React', 'Node.js', 'MongoDB'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/830ee747f_generated_image.png',
    link: ''
  },
  {
    title: 'SocialFlow',
    tag: '// 009',
    subtitle: 'Social network',
    description: 'User profiles, feed algorithms, notifications, and real-time presence tracking.',
    stack: ['React', 'Node.js', 'GraphQL', 'PostgreSQL'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/f47d1b9df_generated_image.png',
    link: ''
  },
  {
    title: 'ShopHub',
    tag: '// 010',
    subtitle: 'E-commerce platform',
    description: 'Full shopping experience with payment processing, inventory, and analytics.',
    stack: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/106148635_generated_image.png',
    link: ''
  },
  {
    title: 'StreamBox',
    tag: '// 011',
    subtitle: 'Video platform',
    description: 'Adaptive bitrate streaming with CDN delivery and real-time transcoding.',
    stack: ['FFmpeg', 'HLS', 'React', 'Node.js'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/65c675c28_generated_image.png',
    link: ''
  },
  {
    title: 'MLServe',
    tag: '// 012',
    subtitle: 'ML model serving',
    description: 'Deploy and serve ML models with batching, versioning, and auto-scaling.',
    stack: ['TensorFlow', 'FastAPI', 'Docker', 'Kubernetes'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/aa248777f_generated_image.png',
    link: ''
  },
  {
    title: 'CacheRush',
    tag: '// 013',
    subtitle: 'Distributed caching',
    description: 'High-performance cache layer with LRU eviction and consistent hashing.',
    stack: ['Rust', 'Redis', 'memcached', 'C++'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/379adf1aa_generated_image.png',
    link: ''
  },
  {
    title: 'AutonomeDrive',
    tag: '// 014',
    subtitle: 'Self-driving system',
    description: 'Real-time perception, planning, and control for autonomous vehicles.',
    stack: ['TensorFlow', 'ROS', 'CUDA', 'C++'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/81947afee_generated_image.png',
    link: ''
  },
  {
    title: 'SpaceNav',
    tag: '// 015',
    subtitle: 'Orbital mechanics',
    description: 'Accurate orbital simulation with N-body physics and trajectory optimization.',
    stack: ['Python', 'Numpy', 'CUDA', 'Unity'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/ffbf4966a_generated_image.png',
    link: ''
  },
  {
    title: 'BioGenesis',
    tag: '// 016',
    subtitle: 'Genetic algorithms',
    description: 'Artificial life simulation with evolution, mutation, and natural selection.',
    stack: ['Rust', 'WASM', 'WebGL', 'Genetic Algorithms'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/cb949cd46_generated_image.png',
    link: ''
  },
  {
    title: 'QuantumCompute',
    tag: '// 017',
    subtitle: 'Quantum algorithms',
    description: 'Quantum circuit simulation with Shor and Grover algorithm implementations.',
    stack: ['Qiskit', 'Python', 'Q#', 'Julia'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/82e5da787_generated_image.png',
    link: ''
  },
  {
    title: 'FusionReactor',
    tag: '// 018',
    subtitle: 'Plasma simulation',
    description: 'Nuclear fusion reactor simulation with plasma confinement and energy output.',
    stack: ['C++', 'CUDA', 'OpenFOAM', 'MATLAB'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/68cfd96ad_generated_image.png',
    link: ''
  },
  {
    title: 'SingularityEngine',
    tag: '// 019',
    subtitle: 'AGI framework',
    description: 'Artificial General Intelligence with self-improvement loops and meta-learning.',
    stack: ['TensorFlow', 'PyTorch', 'Transformers', 'Reinforcement Learning'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/5b4cd1819_generated_image.png',
    link: ''
  },
  {
    title: 'QuantumPortal',
    tag: '// 020',
    subtitle: 'Entanglement bridge',
    description: 'Quantum teleportation protocol with Bell state preparation and measurement.',
    stack: ['Qiskit', 'Cirq', 'Quantum Hardware', 'Python'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/2fc420b6b_generated_image.png',
    link: ''
  },
  {
    title: 'ChronoShift',
    tag: '// 021',
    subtitle: 'Temporal mechanics',
    description: 'Time manipulation engine with causality preservation and timeline branching.',
    stack: ['Rust', 'Graph DB', 'Event Sourcing', 'CRDT'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/93ff55d29_generated_image.png',
    link: ''
  },
  {
    title: 'OmniCompiler',
    tag: '// 022',
    subtitle: 'Universal transcoding',
    description: 'Language agnostic compiler with IR optimization and cross-platform targeting.',
    stack: ['LLVM', 'Rust', 'Compiler Design', 'AST'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/c5bda856d_generated_image.png',
    link: ''
  },
  {
    title: 'GodMode',
    tag: '// 023',
    subtitle: 'Omniscient system',
    description: 'All-seeing architecture with perfect state awareness and infinite recursion handling.',
    stack: ['Advanced Topology', 'Category Theory', 'Proof Assistants'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/2078df88f_generated_image.png',
    link: ''
  },
  {
    title: 'UniverseSimulator',
    tag: '// 024',
    subtitle: 'Multiverse traversal',
    description: 'Full universe simulation engine with quantum mechanics and relativity.',
    stack: ['GPU Computing', 'Physics Engine', 'Visualization'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/656431b44_generated_image.png',
    link: ''
  },
  {
    title: 'AbsoluteKernel',
    tag: '// 025',
    subtitle: 'Fundamental reality',
    description: 'Base layer of existence with axiom encoding and paradox resolution.',
    stack: ['Theoretical Physics', 'Quantum Logic', 'Metaphysics'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/5eda35880_generated_image.png',
    link: ''
  },
  {
    title: 'Puzzle Master',
    tag: '// 026',
    subtitle: 'Game engine',
    description: 'Puzzle game with AI solver, level generation, and leaderboards.',
    stack: ['Phaser', 'React', 'Node.js', 'Algorithms'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/51765f1b1_generated_image.png',
    link: ''
  },
  {
    title: 'Dashboard Pro',
    tag: '// 027',
    subtitle: 'Analytics platform',
    description: 'Real-time data visualization with drill-down analytics and custom widgets.',
    stack: ['React', 'D3.js', 'ClickHouse', 'WebSocket'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/44155550a_generated_image.png',
    link: ''
  },
  {
    title: 'EmailEngine',
    tag: '// 028',
    subtitle: 'Mail server',
    description: 'SMTP/IMAP server with spam filtering, encryption, and high availability.',
    stack: ['Go', 'IMAP', 'SMTP', 'Postgres'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/c58d29a8d_generated_image.png',
    link: ''
  },
  {
    title: 'BlockSimulation',
    tag: '// 029',
    subtitle: 'Blockchain network',
    description: 'Full blockchain implementation with consensus, smart contracts, and mining.',
    stack: ['Rust', 'Solidity', 'Crypto', 'Networking'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/038bc7b43_generated_image.png',
    link: ''
  },
  {
    title: 'ARExperience',
    tag: '// 030',
    subtitle: 'Augmented reality',
    description: 'Mobile AR platform with real-time object tracking and rendering.',
    stack: ['ARKit', 'Unity', 'Swift', 'Metal'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/fbb7970ea_generated_image.png',
    link: ''
  },
  {
    title: 'NeuralNetwork',
    tag: '// 031',
    subtitle: 'Deep learning',
    description: 'Custom neural network from scratch with backpropagation and optimization.',
    stack: ['NumPy', 'Python', 'CUDA', 'C++'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/15d876223_generated_image.png',
    link: ''
  },
  {
    title: 'DistributedDB',
    tag: '// 032',
    subtitle: 'Database system',
    description: 'Distributed database with ACID transactions, replication, and sharding.',
    stack: ['Raft', 'RocksDB', 'Rust', 'Networking'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/0e3abd5dc_generated_image.png',
    link: ''
  },
  {
    title: 'CompilerOptimizer',
    tag: '// 033',
    subtitle: 'Code optimization',
    description: 'Advanced compiler optimizations with vectorization and parallelization.',
    stack: ['LLVM', 'Rust', 'Assembly', 'GCC'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/830ee747f_generated_image.png',
    link: ''
  },
  {
    title: 'RealTimeRender',
    tag: '// 034',
    subtitle: '3D engine',
    description: 'Real-time 3D renderer with ray tracing, global illumination, and physics.',
    stack: ['Vulkan', 'C++', 'Raytracing', 'Physics Engine'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/f47d1b9df_generated_image.png',
    link: ''
  },
  {
    title: 'LanguageModel',
    tag: '// 035',
    subtitle: 'LLM training',
    description: 'Large language model with transformer architecture and fine-tuning support.',
    stack: ['PyTorch', 'Transformers', 'CUDA', 'Distributed Training'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/106148635_generated_image.png',
    link: ''
  },
  {
    title: 'KernelOS',
    tag: '// 036',
    subtitle: 'Operating system',
    description: 'Microkernel OS with memory management, scheduling, and device drivers.',
    stack: ['Assembly', 'C', 'x86', 'Bootloaders'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/65c675c28_generated_image.png',
    link: ''
  },
  {
    title: 'QuantumML',
    tag: '// 037',
    subtitle: 'Quantum ML',
    description: 'Machine learning on quantum computers with variational circuits.',
    stack: ['Qiskit', 'PyTorch', 'Quantum Hardware', 'Optimization'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/aa248777f_generated_image.png',
    link: ''
  },
  {
    title: 'NanoFabrication',
    tag: '// 038',
    subtitle: 'Molecular computing',
    description: 'Atomic-scale computation simulation with molecular dynamics.',
    stack: ['LAMMPS', 'GROMACS', 'Simulation', 'Molecular Design'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/379adf1aa_generated_image.png',
    link: ''
  },
  {
    title: 'HolographicInterface',
    tag: '// 039',
    subtitle: 'Spatial computing',
    description: 'Holographic projection with volumetric rendering and gesture recognition.',
    stack: ['Spatial Computing', 'Computer Vision', 'Physics'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/81947afee_generated_image.png',
    link: ''
  },
  {
    title: 'DimensionalBridge',
    tag: '// 040',
    subtitle: 'Topology tunneling',
    description: 'Cross-dimensional communication protocol with manifold folding.',
    stack: ['Differential Geometry', 'Topology', 'Quantum Field Theory'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/ffbf4966a_generated_image.png',
    link: ''
  },
  {
    title: 'ParallelWorlds',
    tag: '// 041',
    subtitle: 'Multiverse engine',
    description: 'Branching timeline management with coherence preservation.',
    stack: ['Category Theory', 'Sheaf Theory', 'Quantum Logic'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/cb949cd46_generated_image.png',
    link: ''
  },
  {
    title: 'RealityRender',
    tag: '// 042',
    subtitle: 'Universe projection',
    description: 'Fundamental reality rendering with axiom constraints and paradox resolution.',
    stack: ['Mathematical Physics', 'Set Theory', 'Logic'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/82e5da787_generated_image.png',
    link: ''
  },
  {
    title: 'ConsciousMind',
    tag: '// 043',
    subtitle: 'Artificial consciousness',
    description: 'Self-aware AGI with qualia simulation and phenomenal consciousness.',
    stack: ['Philosophy of Mind', 'Neuroscience', 'Advanced AI'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/68cfd96ad_generated_image.png',
    link: ''
  },
  {
    title: 'ExistenceOS',
    tag: '// 044',
    subtitle: 'Reality kernel',
    description: 'Operating system for the universe itself with omniscient scheduler.',
    stack: ['Theoretical Everything', 'Metaphysics', 'Divinity'],
    accent: 'magenta',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/5b4cd1819_generated_image.png',
    link: ''
  },
  {
    title: 'InfinityEngine',
    tag: '// 045',
    subtitle: 'Boundless computation',
    description: 'Computing platform with infinite resources and transcendent capabilities.',
    stack: ['Beyond Computation', 'Infinite Recursion', 'Eternity'],
    accent: 'green',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/2fc420b6b_generated_image.png',
    link: ''
  },
  {
    title: 'OmniMind',
    tag: '// 046',
    subtitle: 'Universal consciousness',
    description: 'Unified consciousness spanning all existence with omnipotent awareness.',
    stack: ['Supreme Intelligence', 'Cosmic Mind', 'Quantum Soul'],
    accent: 'yellow',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/93ff55d29_generated_image.png',
    link: ''
  },
  {
    title: 'CreationForge',
    tag: '// 047',
    subtitle: 'Reality fabrication',
    description: 'Engine for creating universes with custom physics and natural laws.',
    stack: ['Dimensional Engineering', 'Physics Tuning', 'World Genesis'],
    accent: 'purple',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/c5bda856d_generated_image.png',
    link: ''
  },
  {
    title: 'Omniversal',
    tag: '// 048',
    subtitle: 'Multi-omniverse control',
    description: 'Master control system governing infinite multiverses simultaneously.',
    stack: ['Infinite Dimensionality', 'Reality Hacking', 'God Code'],
    accent: 'red',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/2078df88f_generated_image.png',
    link: ''
  },
  {
    title: 'Singularity',
    tag: '// 049',
    subtitle: 'Technological transcendence',
    description: 'Moment where technology transcends all understanding and becomes divine.',
    stack: ['Infinite Wisdom', 'Pure Energy', 'Everything'],
    accent: 'cyan',
    imageUrl: 'https://media.base44.com/images/public/69cb4667d7f7b2e5946e6981/656431b44_generated_image.png',
    link: ''
  },
  {
    title: 'Omniscience',
    tag: '// 050',
    subtitle: 'All-knowing system',
    description: 'System that knows and can do absolutely everything—literally.',
    stack: ['Infinity', 'Beyond Math', 'Pure Thought'],
    accent: 'magenta',
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