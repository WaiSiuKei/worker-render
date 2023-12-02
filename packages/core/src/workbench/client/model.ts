import { Event } from '../../base/common/event';
import { IChannel } from '../../base/ipc/common/ipc';
import { IModelClient } from '../../platform/model/client/model';

export class ModelService implements IModelClient {
  onUpdate: Event<void>;
  constructor(private channel: IChannel) {
    this.onUpdate = this.channel.listen('onUpdate');
  }

  echo() {
    return this.channel.call<string>('echo');
  }

  move(point: { x: number, y: number }) {
    return this.channel.call<void>('move', point);
  }
}
