import { Event } from '../../../base/common/event';

export interface IRenderServer {
  onUpdate: Event<void>;
  echo(): string;
}
