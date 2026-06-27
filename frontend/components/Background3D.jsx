'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, MeshDistortMaterial } from '@react-three/drei';

// Lightweight floating 3D shapes for a subtle site-wide ambient layer
function FloatingShapes() {
  const shapes = useMemo(
    () => [
      { pos: [-4, 2, -3], scale: 0.9, color: '#7E22CE' },
      { pos: [4.5, -1.5, -4], scale: 1.3, color: '#EAB308' },
      { pos: [-3.5, -2.5, -5], scale: 1.0, color: '#A855F7' },
      { pos: [3, 2.8, -6], scale: 1.6, color: '#C084FC' },
      { pos: [0, -3, -4], scale: 0.7, color: '#FDE047' },
    ],
    []
  );

  return (
    <>
      {shapes.map((s, i) => (
        <Float key={i} speed={1.5} rotationIntensity={1.2} floatIntensity={2}>
          <Icosahedron args={[s.scale, 1]} position={s.pos}>
            <MeshDistortMaterial
              color={s.color}
              roughness={0.2}
              metalness={0.8}
              distort={0.35}
              speed={1.6}
              transparent
              opacity={0.55}
            />
          </Icosahedron>
        </Float>
      ))}
    </>
  );
}

function Rotator() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });
  return (
    <group ref={ref}>
      <FloatingShapes />
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-70">
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#FDE047" />
        <pointLight position={[-5, -5, 2]} intensity={1.5} color="#7E22CE" />
        <Rotator />
      </Canvas>
    </div>
  );
}
