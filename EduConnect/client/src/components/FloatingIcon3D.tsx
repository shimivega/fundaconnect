import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

interface FloatingIcon3DProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  tags: string[];
  href: string;
  delay?: number;
}

function FloatingMesh({ color, delay = 0 }: { color: string; delay?: number }) {
  const ref = useRef<Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + delay;
    ref.current.position.y = Math.sin(t * 0.5) * 0.3;
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.2;
    ref.current.rotation.x = Math.cos(t * 0.2) * 0.1;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function FloatingIcon3D({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  tags, 
  href, 
  delay = 0 
}: FloatingIcon3DProps) {
  return (
    <Link href={href}>
      <div 
        className="card-3d themed-bg rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 text-center cursor-pointer group"
        style={{ 
          animationDelay: `${delay}s`,
          animationName: delay % 3 === 0 ? 'float' : delay % 3 === 1 ? 'float-delayed' : 'float-slow'
        }}
        data-testid={`dashboard-icon-${href.replace('/', '')}`}
      >
        {/* 3D Canvas */}
        <div className="h-32 w-full mb-4 group-hover:scale-110 transition-transform duration-300">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 2, 2]} intensity={0.8} />
            <FloatingMesh color={color.split(' ')[1]} delay={delay} />
          </Canvas>
        </div>

        {/* Icon Overlay */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold themed-text mb-2 mt-4">{title}</h3>
        <p className="themed-text-secondary text-sm mb-4">{description}</p>
        
        <div className="flex items-center justify-center space-x-2 text-xs themed-text-secondary">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className={`px-2 py-1 rounded-full ${
                index === 0 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
