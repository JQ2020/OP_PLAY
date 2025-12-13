"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { useRef, useState, useEffect, memo } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

// 检测移动端设备
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// 检测用户是否偏好减少动画
function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
}

interface HeroShapeProps {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  isDark: boolean;
  segments?: number;
}

const HeroShape = memo(function HeroShape({ position, color, scale, speed, isDark, segments = 128 }: HeroShapeProps) {
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
        <torusKnotGeometry args={[1, 0.3, segments, 16]} />
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.4}
          roughness={isDark ? 0.2 : 0.1}
          metalness={isDark ? 0.9 : 1}
          emissive={color}
          emissiveIntensity={isDark ? 4 : 2}
        />
      </mesh>
    </Float>
  );
});

interface AnimatedParticlesProps {
  isDark: boolean;
  isMobile: boolean;
}

const AnimatedParticles = memo(function AnimatedParticles({ isDark, isMobile }: AnimatedParticlesProps) {
  // 移动端大幅减少粒子数量
  const count1 = isMobile ? 40 : (isDark ? 300 : 150);
  const count2 = isMobile ? 40 : (isDark ? 200 : 150);

  return (
    <>
        <Sparkles
            count={count1}
            scale={12}
            size={isDark ? 3 : 4}
            speed={0.4}
            opacity={isDark ? 0.5 : 0.8}
            color={isDark ? "#ffffff" : "#1a73e8"}
        />
        <Sparkles
            count={count2}
            scale={15}
            size={isDark ? 4 : 6}
            speed={0.3}
            opacity={isDark ? 0.4 : 0.6}
            color={isDark ? "#01875f" : "#01875f"}
        />
    </>
  );
});

export default function ThreeBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  // 移动端或用户偏好减少动画时降级
  const shouldReduceEffects = isMobile || prefersReducedMotion;

  // 移动端减少几何体复杂度
  const segments = shouldReduceEffects ? 64 : 128;

  // 移动端减少形状数量（只显示3个）
  const shapes = shouldReduceEffects
    ? [
        { position: [-3, 1, -5] as [number, number, number], color: "#4285f4", scale: 1.5, speed: 0.2 },
        { position: [3, -2, -4] as [number, number, number], color: "#34a853", scale: 1.8, speed: 0.3 },
        { position: [0, 0, -8] as [number, number, number], color: "#ea4335", scale: 2.5, speed: 0.1 },
      ]
    : [
        { position: [-4, 2, -5] as [number, number, number], color: "#4285f4", scale: 1.5, speed: 0.2 },
        { position: [4, -3, -4] as [number, number, number], color: "#34a853", scale: 1.8, speed: 0.3 },
        { position: [0, 0, -8] as [number, number, number], color: "#ea4335", scale: 2.5, speed: 0.1 },
        { position: [-5, -4, -6] as [number, number, number], color: "#fbbc04", scale: 1.2, speed: 0.25 },
        { position: [5, 4, -7] as [number, number, number], color: "#a142f4", scale: 1.4, speed: 0.15 },
      ];

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000">
      <Canvas dpr={shouldReduceEffects ? [1, 1.5] : [1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />

        <color attach="background" args={[isDark ? '#050505' : '#ffffff']} />

        <ambientLight intensity={isDark ? 0.2 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={isDark ? 1 : 1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color={isDark ? "#000000" : "#1a73e8"} />

        <group position={[0, 0, -2]}>
          {shapes.map((shape, index) => (
            <HeroShape
              key={index}
              position={shape.position}
              color={shape.color}
              scale={shape.scale}
              speed={shape.speed}
              isDark={isDark}
              segments={segments}
            />
          ))}

          <AnimatedParticles isDark={isDark} isMobile={shouldReduceEffects} />
        </group>

        {/* 移动端禁用后处理效果以提升性能 */}
        {!shouldReduceEffects && (
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
        )}

        <Environment preset={isDark ? "night" : "city"} />
      </Canvas>
    </div>
  );
}
