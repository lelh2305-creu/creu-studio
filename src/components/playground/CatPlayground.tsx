'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import Room from './Room';
import Cat from './Cat';
import { CatAI, CatTransform } from './CatAI';

function AnimatedCatsController({
  mouse,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const sceneGroupRef = useRef<THREE.Group>(null);
  const floorY = -1.35;

  // Independent Cat AI State Machines
  const orangeAIRef = useRef<CatAI | null>(null);
  const tuxedoAIRef = useRef<CatAI | null>(null);

  if (!orangeAIRef.current) {
    orangeAIRef.current = new CatAI(
      'ORANGE',
      [2.4, floorY, 1.4],
      floorY,
      { minX: 1.2, maxX: 3.6, minZ: 0.6, maxZ: 2.4 }
    );
  }

  if (!tuxedoAIRef.current) {
    tuxedoAIRef.current = new CatAI(
      'TUXEDO',
      [-0.6, floorY, 1.8],
      floorY,
      { minX: -1.6, maxX: 0.4, minZ: 0.8, maxZ: 2.4 }
    );
  }

  const [orangeTransform, setOrangeTransform] = useState<CatTransform>({
    position: [2.4, floorY, 1.4],
    rotationY: Math.PI / 2,
    rotationZ: 0,
    timeScale: 0.05,
    state: 'IDLE',
  });

  const [tuxedoTransform, setTuxedoTransform] = useState<CatTransform>({
    position: [-0.6, floorY, 1.8],
    rotationY: -Math.PI / 2,
    rotationZ: 0,
    timeScale: 0.05,
    state: 'IDLE',
  });

  useFrame((_, delta) => {
    // Subtle mouse parallax for elevated architectural perspective
    if (sceneGroupRef.current) {
      sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.y,
        mouse.current.x * 0.02,
        0.04
      );
      sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.x,
        -mouse.current.y * 0.01,
        0.04
      );
    }

    // Update Orange Cat AI
    if (orangeAIRef.current) {
      const ot = orangeAIRef.current.update(delta);
      setOrangeTransform(ot);
    }

    // Update Tuxedo Cat AI
    if (tuxedoAIRef.current) {
      const tt = tuxedoAIRef.current.update(delta);
      setTuxedoTransform(tt);
    }
  });

  return (
    <group ref={sceneGroupRef}>
      {/* High-Res AIComplex Living Room Backdrop Image Plane */}
      <Room />

      {/* Real Orange Cat GLB Model with Independent AI State Machine */}
      <Cat
        name="ORANGE"
        modelPath="/models/orange-cat-walk.glb"
        position={orangeTransform.position}
        rotationY={orangeTransform.rotationY}
        rotationZ={orangeTransform.rotationZ}
        timeScale={orangeTransform.timeScale}
        scale={[140, 140, 140]}
      />

      {/* Real Tuxedo Cat GLB Model with Independent AI State Machine */}
      <Cat
        name="TUXEDO"
        modelPath="/models/tuxedo-cat-walk.glb"
        position={tuxedoTransform.position}
        rotationY={tuxedoTransform.rotationY}
        rotationZ={tuxedoTransform.rotationZ}
        timeScale={tuxedoTransform.timeScale}
        scale={[140, 140, 140]}
      />

      {/* Soft Contact Shadows on Natural Oak Floor */}
      <ContactShadows
        position={[0.0, floorY + 0.01, 1.2]}
        opacity={0.4}
        scale={22}
        blur={2.0}
        far={6}
        resolution={1024}
        color="#2b1a0e"
      />
    </group>
  );
}

export default function CatPlayground() {
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        {/* Camera perspective matching reference photo framing */}
        <PerspectiveCamera makeDefault position={[0.0, 0.0, 5.2]} fov={45} />

        <Suspense fallback={null}>
          <AnimatedCatsController mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}
