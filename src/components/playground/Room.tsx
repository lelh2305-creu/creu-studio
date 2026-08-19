'use client';

import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface RoomProps {
  isMobile?: boolean;
}

/**
 * Photorealistic Living Room Background (Optimized 319KB WebP)
 * Art-directed responsive framing for desktop and mobile viewports
 */
export default function Room({ isMobile = false }: RoomProps) {
  const texture = useTexture('/images/living-room-bg.webp');
  texture.colorSpace = THREE.SRGBColorSpace;

  // Responsive plane sizing matching 16:9 aspect ratio
  const planeWidth = isMobile ? 12.8 : 15.02;
  const planeHeight = isMobile ? 7.2 : 8.45;
  const planePosY = isMobile ? -0.2 : 0.0;

  return (
    <group>
      {/* ========== PHOTOREALISTIC RESPONSIVE LIVING ROOM BACKDROP PLANE ========== */}
      <mesh position={[0.0, planePosY, -5.0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* ========== SOFT NATURAL AMBIENT & SUNLIGHT MATCHING IMAGE ========== */}
      <ambientLight intensity={1.8} color="#fffcf5" />

      {/* Warm Golden Key Sunlight */}
      <directionalLight
        position={[12, 16, 8]}
        intensity={2.4}
        color="#fffaee"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={25}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0003}
      />

      {/* Soft Contact Shadow Catching Floor Plane for 3D Cats */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.0, isMobile ? -1.55 : -1.35, 0.5]}
        receiveShadow
      >
        <planeGeometry args={[20, 12]} />
        <shadowMaterial opacity={0.35} color="#2b1a0e" />
      </mesh>
    </group>
  );
}

useTexture.preload('/images/living-room-bg.webp');
