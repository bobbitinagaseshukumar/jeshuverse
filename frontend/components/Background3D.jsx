'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Light-theme friendly ambient layer: soft, slowly drifting brand-colored
// orbs + faint sparkles that add depth WITHOUT hurting text readability.
function SoftOrbs() {
  const ref = useRef();
  const orbs = useMemo(
    () => [
      { pos: [-5, 2.5, -3], scale: 1.6, color: '#C084FC' },
      { pos: [5.5, -1.5, -4], scale: 2.0, color: '#FDE047' },
      { pos: [-4, -2.8, -5], scale: 1.7, color: '#A855F7' },
      { pos: [4.2, 3, -6], scale: 2.4, color: '#7E22CE' },
      { pos: [0, -3.5, -4], scale: 1.3, color: '#EAB308' },
    ],
    []
  );

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.12, 0.03);
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, state.pointer.x * 0.08, 0.03);
    }
  });

  return (
    <group ref={ref}>
      {orbs.map((o, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.9} floatIntensity={1.6}>
          <Icosahedron args={[o.scale, 4]} position={o.pos}>
            <MeshDistortMaterial
              color={o.color}
              roughness={0.35}
              metalness={0.6}
              distort={0.4}
              speed={1.3}
              transparent
              opacity={0.16}
            />
          </Icosahedron>
        </Float>
      ))}
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 9], fov: 60 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#FDE047" />
        <pointLight position={[-6, -4, 2]} intensity={1.2} color="#7E22CE" />
        <SoftOrbs />
        <Sparkles count={60} scale={16} size={2.5} speed={0.3} color="#C084FC" opacity={0.5} />
      </Canvas>
    </div>
  );
}
