'use client';

import * as THREE from 'three';

export type CatState = 'IDLE' | 'LOOK_AROUND' | 'SIT' | 'WALK' | 'SLEEP';

export interface CatTransform {
  position: [number, number, number];
  rotationY: number;
  rotationZ: number;
  timeScale: number;
  state: CatState;
}

interface Bounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/**
 * Autonomous Cat State Machine with Weighted Transitions and Natural Decision Timing
 */
export class CatAI {
  public name: string;
  public state: CatState;
  public stateTimer: number;
  public stateDuration: number;

  public currentPos: THREE.Vector3;
  public targetPos: THREE.Vector3;
  public currentRotY: number;
  public targetRotY: number;
  public currentRotZ: number;
  public targetRotZ: number;
  public timeScale: number;

  private floorY: number;
  private bounds: Bounds;
  private walkSpeed: number = 0.28; // Slow relaxed domestic cat pace
  private loggedMissingMap: Record<string, boolean> = {};

  constructor(
    name: string,
    initialPos: [number, number, number],
    floorY: number,
    bounds: Bounds
  ) {
    this.name = name;
    this.floorY = floorY;
    this.bounds = bounds;

    this.currentPos = new THREE.Vector3(...initialPos);
    this.targetPos = this.currentPos.clone();
    this.currentRotY = Math.random() * Math.PI * 2;
    this.targetRotY = this.currentRotY;
    this.currentRotZ = 0;
    this.targetRotZ = 0;
    this.timeScale = 0.05;

    const initialStateOptions: CatState[] = ['IDLE', 'SIT', 'SLEEP', 'LOOK_AROUND', 'WALK'];
    this.state = initialStateOptions[Math.floor(Math.random() * initialStateOptions.length)];
    this.stateDuration = this.getRandomDurationForState(this.state);
    this.stateTimer = Math.random() * (this.stateDuration * 0.5);

    this.applyStatePose(this.state);
  }

  private getRandomDurationForState(s: CatState): number {
    switch (s) {
      case 'IDLE':
        return 4.0 + Math.random() * 6.0;
      case 'LOOK_AROUND':
        return 2.5 + Math.random() * 3.0;
      case 'SIT':
        return 6.0 + Math.random() * 9.0;
      case 'WALK':
        return 4.0 + Math.random() * 5.0;
      case 'SLEEP':
        return 12.0 + Math.random() * 18.0;
      default:
        return 5.0;
    }
  }

  private logMissingAnimation(animationName: string) {
    if (!this.loggedMissingMap[animationName]) {
      this.loggedMissingMap[animationName] = true;
      console.log(`[CREU CAT] ${this.name} Missing animation: ${animationName} (using procedural pose fallback)`);
    }
  }

  private pickRandomWaypoint(): THREE.Vector3 {
    const rx = this.bounds.minX + Math.random() * (this.bounds.maxX - this.bounds.minX);
    const rz = this.bounds.minZ + Math.random() * (this.bounds.maxZ - this.bounds.minZ);
    return new THREE.Vector3(rx, this.floorY, rz);
  }

  private applyStatePose(newState: CatState) {
    this.state = newState;
    this.stateDuration = this.getRandomDurationForState(newState);
    this.stateTimer = 0;

    switch (newState) {
      case 'IDLE':
        this.timeScale = 0.05;
        this.targetPos.y = this.floorY;
        this.targetRotZ = 0;
        break;

      case 'LOOK_AROUND':
        this.logMissingAnimation('LOOK_AROUND');
        this.timeScale = 0.1;
        this.targetPos.y = this.floorY;
        this.targetRotZ = 0;
        this.targetRotY = this.currentRotY + (Math.random() > 0.5 ? 0.6 : -0.6);
        break;

      case 'SIT':
        this.logMissingAnimation('SIT');
        this.timeScale = 0.02;
        this.targetPos.y = this.floorY - 0.04;
        this.targetRotZ = 0;
        break;

      case 'SLEEP':
        this.logMissingAnimation('SLEEP');
        this.timeScale = 0.0;
        this.targetPos.y = this.floorY - 0.07;
        this.targetRotZ = 0.12;
        break;

      case 'WALK':
        this.timeScale = 0.55;
        this.targetPos = this.pickRandomWaypoint();
        this.targetRotZ = 0;

        const dx = this.targetPos.x - this.currentPos.x;
        const dz = this.targetPos.z - this.currentPos.z;
        if (Math.hypot(dx, dz) > 0.1) {
          this.targetRotY = Math.atan2(dx, dz);
        }
        break;
    }

    console.log(`[CREU CAT] ${this.name} State -> ${newState} (Duration: ${this.stateDuration.toFixed(1)}s)`);
  }

  private transitionNextState() {
    let next: CatState = 'IDLE';
    const r = Math.random();

    switch (this.state) {
      case 'IDLE':
        if (r < 0.35) next = 'LOOK_AROUND';
        else if (r < 0.60) next = 'SIT';
        else if (r < 0.85) next = 'WALK';
        else next = 'SLEEP';
        break;

      case 'LOOK_AROUND':
        if (r < 0.45) next = 'IDLE';
        else if (r < 0.75) next = 'SIT';
        else next = 'WALK';
        break;

      case 'SIT':
        if (r < 0.45) next = 'IDLE';
        else if (r < 0.75) next = 'LOOK_AROUND';
        else next = 'SLEEP';
        break;

      case 'WALK':
        if (r < 0.50) next = 'IDLE';
        else if (r < 0.75) next = 'LOOK_AROUND';
        else next = 'SIT';
        break;

      case 'SLEEP':
        if (r < 0.70) next = 'IDLE';
        else next = 'SIT';
        break;
    }

    this.applyStatePose(next);
  }

  public update(delta: number): CatTransform {
    this.stateTimer += delta;

    if (this.stateTimer >= this.stateDuration) {
      this.transitionNextState();
    }

    if (this.state === 'WALK') {
      const dist = this.currentPos.distanceTo(this.targetPos);
      if (dist < 0.15) {
        this.applyStatePose('IDLE');
      } else {
        this.currentRotY = THREE.MathUtils.lerp(this.currentRotY, this.targetRotY, delta * 3.0);
        const step = Math.min(dist, this.walkSpeed * delta);
        const dir = new THREE.Vector3()
          .subVectors(this.targetPos, this.currentPos)
          .normalize();
        this.currentPos.addScaledVector(dir, step);
      }
    } else {
      this.currentPos.y = THREE.MathUtils.lerp(this.currentPos.y, this.targetPos.y, delta * 4.0);
      this.currentRotY = THREE.MathUtils.lerp(this.currentRotY, this.targetRotY, delta * 2.0);
    }

    this.currentRotZ = THREE.MathUtils.lerp(this.currentRotZ, this.targetRotZ, delta * 3.0);

    return {
      position: [this.currentPos.x, this.currentPos.y, this.currentPos.z],
      rotationY: this.currentRotY,
      rotationZ: this.currentRotZ,
      timeScale: this.timeScale,
      state: this.state,
    };
  }
}
