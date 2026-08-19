'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import Room from './Room';
import Cat from './Cat';
import { CatAI, CatTransform } from './CatAI';

interface AnimatedCatsProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  isMobile: boolean;
  onReady?: () => void;
}

function AnimatedCatsController({ mouse, isMobile, onReady }: AnimatedCatsProps) {
  const sceneGroupRef = useRef<THREE.Group>(null);
  const floorY = isMobile ? -1.55 : -1.35;
  const catScale: [number, number, number] = isMobile ? [115, 115, 115] : [140, 140, 140];

  // Independent Cat AI State Machines
  const orangeAIRef = useRef<CatAI | null>(null);
  const tuxedoAIRef = useRef<CatAI | null>(null);

  if (!orangeAIRef.current) {
    orangeAIRef.current = new CatAI(
      'ORANGE',
      isMobile ? [0.8, floorY, 1.2] : [2.4, floorY, 1.4],
      floorY,
      isMobile
        ? { minX: 0.2, maxX: 1.4, minZ: 0.6, maxZ: 2.0 }
        : { minX: 1.2, maxX: 3.6, minZ: 0.6, maxZ: 2.4 }
    );
  }

  if (!tuxedoAIRef.current) {
    tuxedoAIRef.current = new CatAI(
      'TUXEDO',
      isMobile ? [-0.8, floorY, 1.6] : [-0.6, floorY, 1.8],
      floorY,
      isMobile
        ? { minX: -1.4, maxX: -0.2, minZ: 0.8, maxZ: 2.0 }
        : { minX: -1.6, maxX: 0.4, minZ: 0.8, maxZ: 2.4 }
    );
  }

  const [orangeTransform, setOrangeTransform] = useState<CatTransform>({
    position: isMobile ? [0.8, floorY, 1.2] : [2.4, floorY, 1.4],
    rotationY: Math.PI / 2,
    rotationZ: 0,
    timeScale: 0.05,
    state: 'IDLE',
  });

  const [tuxedoTransform, setTuxedoTransform] = useState<CatTransform>({
    position: isMobile ? [-0.8, floorY, 1.6] : [-0.6, floorY, 1.8],
    rotationY: -Math.PI / 2,
    rotationZ: 0,
    timeScale: 0.05,
    state: 'IDLE',
  });

  useEffect(() => {
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  useFrame((_, delta) => {
    // Mouse parallax
    if (sceneGroupRef.current) {
      sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.y,
        mouse.current.x * (isMobile ? 0.01 : 0.02),
        0.04
      );
      sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.x,
        -mouse.current.y * (isMobile ? 0.005 : 0.01),
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
      {/* Photorealistic Living Room Backdrop Image Plane */}
      <Room isMobile={isMobile} />

      {/* Real Orange Cat GLB Model with Independent AI State Machine */}
      <Cat
        name="ORANGE"
        modelPath="/models/orange-cat-walk.glb"
        position={orangeTransform.position}
        rotationY={orangeTransform.rotationY}
        rotationZ={orangeTransform.rotationZ}
        timeScale={orangeTransform.timeScale}
        scale={catScale}
      />

      {/* Real Tuxedo Cat GLB Model with Independent AI State Machine */}
      <Cat
        name="TUXEDO"
        modelPath="/models/tuxedo-cat-walk.glb"
        position={tuxedoTransform.position}
        rotationY={tuxedoTransform.rotationY}
        rotationZ={tuxedoTransform.rotationZ}
        timeScale={tuxedoTransform.timeScale}
        scale={catScale}
      />

      {/* Soft Contact Shadows on Floor */}
      <ContactShadows
        position={[0.0, floorY + 0.01, 1.2]}
        opacity={0.4}
        scale={isMobile ? 18 : 22}
        blur={2.0}
        far={6}
        resolution={isMobile ? 512 : 1024}
        color="#2b1a0e"
      />
    </group>
  );
}

interface CatPlaygroundProps {
  onReady?: () => void;
}

export default function CatPlayground({ onReady }: CatPlaygroundProps) {
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows={!isMobile}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={isMobile ? [1, 1.2] : [1, 1.5]}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        {/* Responsive Art-Directed Camera Perspective */}
        <PerspectiveCamera
          makeDefault
          position={isMobile ? [0.0, -0.1, 5.5] : [0.0, 0.0, 5.2]}
          fov={isMobile ? 54 : 45}
        />

        <Suspense fallback={null}>
          <AnimatedCatsController mouse={mouse} isMobile={isMobile} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
