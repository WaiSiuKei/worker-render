import { Event } from '../../../base/common/event';

export interface IModelServer {
  onUpdate: Event<void>;
  echo(): string;
  move(point: { x: number, y: number }): void;
}
