import { Event } from '../../../base/common/event';

export interface IRenderServer {
  onUpdate: Event<void>;
  echo(): string;
  render(size: { width: number, height: number }): void;
  toggleLongTask(): void;
}
