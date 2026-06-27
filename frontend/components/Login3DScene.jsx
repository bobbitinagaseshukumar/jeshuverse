'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Sparkles,
  Stars,
  Environment,
  Torus,
  Icosahedron,
  Sphere,
} from '@react-three/drei';

// A morphing, gooey central orb (the "hero" 3D object)
function MorphOrb() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.25;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.4} floatIntensity={2.2}>
      <Sphere ref={ref} args={[1.25, 96, 96]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#7E22CE"
          emissive="#3B0764"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.85}
          distort={0.45}
          speed={2.4}
        />
      </Sphere>
    </Float>
  );
}

// Spinning golden ring orbiting the orb
function GoldRing() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = t * 0.6;
      ref.current.rotation.y = t * 0.4;
    }
  });
  return (
    <Torus ref={ref} args={[2.1, 0.07, 24, 160]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#EAB308"
        emissive="#A16207"
        emissiveIntensity={0.6}
        metalness={1}
        roughness={0.15}
      />
    </Torus>
  );
}

// Floating wobbling crystals scattered around
function Crystals() {
  const items = useMemo(
    () => [
      { pos: [-2.6, 1.4, -1], scale: 0.45, color: '#FDE047' },
      { pos: [2.7, -1.2, -0.5], scale: 0.55, color: '#C084FC' },
      { pos: [2.2, 1.7, -2], scale: 0.35, color: '#EAB308' },
      { pos: [-2.4, -1.6, -1.5], scale: 0.4, color: '#A855F7' },
      { pos: [0, 2.4, -2.5], scale: 0.3, color: '#FDE047' },
    ],
    []
  );

  return (
    <>
      {items.map((it, i) => (
        <Float key={i} speed={3} rotationIntensity={2} floatIntensity={3}>
          <Icosahedron args={[it.scale, 0]} position={it.pos}>
            <MeshWobbleMaterial
              color={it.color}
              factor={0.6}
              speed={2}
              metalness={0.7}
              roughness={0.2}
              emissive={it.color}
              emissiveIntensity={0.3}
            />
          </Icosahedron>
        </Float>
      ))}
    </>
  );
}

export default function Login3DScene() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#FDE047" />
      <pointLight position={[-5, -3, 2]} intensity={2} color="#7E22CE" />
      <pointLight position={[5, 3, -2]} intensity={1.5} color="#EAB308" />

      <MorphOrb />
      <GoldRing />
      <Crystals />

      <Sparkles count={120} scale={10} size={3} speed={0.6} color="#FDE047" />
      <Stars radius={50} depth={30} count={1500} factor={4} saturation={0} fade speed={1.5} />

      <Environment preset="night" />
    </Canvas>
  );
}
