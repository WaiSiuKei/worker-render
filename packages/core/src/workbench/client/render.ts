import { Event } from '../../base/common/event';
import { IChannel } from '../../base/ipc/common/ipc';
import { IRenderClient } from '../../platform/render/client/render';

export class RenderService implements IRenderClient {
  onUpdate: Event<void>;
  constructor(private channel: IChannel) {
    this.onUpdate = this.channel.listen('onUpdate');
  }

  echo() {
    return this.channel.call<string>('echo');
  }
  render(size: { width: number, height: number }) {
    return this.channel.call<void>('render', size);
  }
}
