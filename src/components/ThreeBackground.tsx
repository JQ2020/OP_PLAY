"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

function HeroShape({ position, color, scale, speed, isDark }: { position: [number, number, number], color: string, scale: number, speed: number, isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t * speed) * 0.3;
    meshRef.current.rotation.y = Math.cos(t * speed * 0.5) * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <MeshDistortMaterial 
          color={color} 
          speed={3} 
          distort={0.4} 
          roughness={isDark ? 0.2 : 0.1}
          metalness={isDark ? 0.9 : 1}
          emissive={color}
          emissiveIntensity={isDark ? 4 : 2} // Much brighter in dark mode
        />
      </mesh>
    </Float>
  );
}

function AnimatedParticles({ isDark }: { isDark: boolean }) {
  return (
    <>
        <Sparkles 
            count={isDark ? 300 : 150} 
            scale={12} 
            size={isDark ? 3 : 4} 
            speed={0.4} 
            opacity={isDark ? 0.5 : 0.8} 
            color={isDark ? "#ffffff" : "#1a73e8"}
        />
        <Sparkles 
            count={isDark ? 200 : 150} 
            scale={15} 
            size={isDark ? 4 : 6} 
            speed={0.3} 
            opacity={isDark ? 0.4 : 0.6} 
            color={isDark ? "#01875f" : "#01875f"} 
        />
    </>
  )
}

export default function ThreeBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        
        <color attach="background" args={[isDark ? '#050505' : '#ffffff']} />
        
        <ambientLight intensity={isDark ? 0.2 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={isDark ? 1 : 1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color={isDark ? "#000000" : "#1a73e8"} />

        <group position={[0, 0, -2]}>
          <HeroShape position={[-4, 2, -5]} color="#4285f4" scale={1.5} speed={0.2} isDark={isDark} />
          <HeroShape position={[4, -3, -4]} color="#34a853" scale={1.8} speed={0.3} isDark={isDark} />
          <HeroShape position={[0, 0, -8]} color="#ea4335" scale={2.5} speed={0.1} isDark={isDark} />
          <HeroShape position={[-5, -4, -6]} color="#fbbc04" scale={1.2} speed={0.25} isDark={isDark} />
          <HeroShape position={[5, 4, -7]} color="#a142f4" scale={1.4} speed={0.15} isDark={isDark} />
          
          <AnimatedParticles isDark={isDark} />
        </group>

        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={isDark ? 0.5 : 2}
            mipmapBlur
            intensity={isDark ? 2.5 : 0.5}
            radius={isDark ? 0.8 : 0.4}
          />
          <Noise opacity={isDark ? 0.05 : 0.01} />
          <Vignette eskil={false} offset={0.1} darkness={isDark ? 0.5 : 0} />
        </EffectComposer>

        <Environment preset={isDark ? "night" : "city"} />
      </Canvas>
    </div>
  );
}
