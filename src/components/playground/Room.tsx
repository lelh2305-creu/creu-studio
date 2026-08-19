'use client';

import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * High-Res 12.6MB Living Room Background Loader (16:9 Aspect Ratio Alignment)
 * Matches reference framing exactly with zero over-scaling
 */
export default function Room() {
  const texture = useTexture('/images/living-room-bg.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      {/* ========== PHOTOREALISTIC 16:9 LIVING ROOM BACKDROP PLANE ========== */}
      <mesh position={[0.0, 0.0, -5.0]}>
        <planeGeometry args={[15.02, 8.45]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* ========== AMBIENT & SUNLIGHT LIGHTING MATCHING HIGH-RES IMAGE ========== */}
      <ambientLight intensity={1.8} color="#fffcf5" />

      {/* Warm Golden Key Sunlight */}
      <directionalLight
        position={[12, 16, 8]}
        intensity={2.4}
        color="#fffaee"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
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
        position={[0.0, -1.35, 0.5]}
        receiveShadow
      >
        <planeGeometry args={[20, 12]} />
        <shadowMaterial opacity={0.35} color="#2b1a0e" />
      </mesh>
    </group>
  );
}

useTexture.preload('/images/living-room-bg.jpg');
