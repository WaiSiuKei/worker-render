import { Event } from '../../base/common/event';
import { IChannel } from '../../base/ipc/common/ipc';
import { IModelClient } from '../../platform/model/client/model';
import { Particle } from '../../platform/model/server/model';

export class ModelService implements IModelClient {
  onUpdate: Event<void>;
  onTick: Event<void>;
  constructor(private channel: IChannel) {
    this.onUpdate = this.channel.listen('onUpdate');
    this.onTick = this.channel.listen('onTick');
  }
  echo() {
    return this.channel.call<string>('echo');
  }
  getParticles() {
    return this.channel.call<Particle[]>('getParticles');
  }
  load(size: { w: number, h: number }) {
    return this.channel.call<void>('load', size);
  }
}
