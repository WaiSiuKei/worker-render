import { Event } from '../../../base/common/event';

export interface Particle {
  x: number,
  y: number,
  rad: number,
  rgba: string,
  vx: number,
  vy: number
}

export interface IModelServer {
  onUpdate: Event<void>;
  onTick: Event<Particle[]>;
  echo(): string;
  load(size: { w: number, h: number }): void;
  getParticles(): Particle[];
}
