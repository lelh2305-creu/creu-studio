'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface CatProps {
  name: 'ORANGE' | 'TUXEDO';
  modelPath: string;
  position: [number, number, number];
  rotationY?: number;
  rotationZ?: number;
  timeScale?: number;
  scale?: [number, number, number];
}

/**
 * Animated Cat Loader (Orange Cat & Tuxedo Cat)
 * Handles smooth state updates, animation speed (timeScale), and frustum culling bypass
 */
export default function Cat({
  name,
  modelPath,
  position,
  rotationY = 0,
  rotationZ = 0,
  timeScale = 0.5,
  scale = [160, 160, 160],
}: CatProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (scene && !loggedRef.current) {
      loggedRef.current = true;

      // Traversal: disable frustum culling and ensure visibility
      scene.traverse((child) => {
        child.visible = true;
        child.frustumCulled = false;
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      console.log(`[CREU CAT] ${name} LOAD OK`);
      console.log(`[CREU CAT] ${name} RAW SIZE:`, size.toArray());
      console.log(`[CREU CAT] ${name} SCALE:`, scale);
      console.log(`[CREU CAT] ${name} INITIAL POSITION:`, position);
    }
  }, [scene, name, scale, position]);

  // Animation Playback & Speed Control
  useEffect(() => {
    if (!actions) return;

    try {
      const actionNames = Object.keys(actions);
      if (actionNames.length > 0) {
        const walkAction = actions['Armature|Unreal Take|baselayer'] || actions[actionNames[0]];
        if (walkAction) {
          walkAction.timeScale = timeScale;
          if (!walkAction.isRunning()) {
            walkAction.reset().fadeIn(0.3).play();
          }
        }
      }
    } catch (err) {
      console.warn(`[CREU CAT] ${name} Animation error (non-fatal):`, err);
    }
  }, [actions, name, timeScale]);

  useFrame(() => {
    if (group.current) {
      group.current.position.set(...position);
      group.current.rotation.y = rotationY;
      group.current.rotation.z = rotationZ;
    }
    if (actions) {
      const walkAction = actions['Armature|Unreal Take|baselayer'] || actions[Object.keys(actions)[0]];
      if (walkAction) {
        walkAction.timeScale = timeScale;
      }
    }
  });

  return (
    <primitive
      ref={group}
      object={scene}
      scale={scale}
      position={position}
      rotation={[0, rotationY, rotationZ]}
    />
  );
}

useGLTF.preload('/models/orange-cat-walk.glb');
useGLTF.preload('/models/tuxedo-cat-walk.glb');
