import { Event } from '../../base/common/event';
import { IChannel } from '../../base/ipc/common/ipc';
import { IPCService } from '../../platform/ipc/main/ipc';
import ModelInWorker from '../worker/model?worker';
// import RenderInWorker from '../worker/render?worker';

export class MainThreadModel {
  model: Worker;
  ipcService = new IPCService();
  constructor() {
    this.model = new ModelInWorker();
    const channel = this.ipcService.connect('model', this.model);
    const modelService = new ModelService(channel);

    setTimeout(async () => {
      modelService.onChange(console.log);
      console.log(await modelService.getValue());
    });
  }
}

class ModelService {
  constructor(private channel: IChannel) {
  }

  get onChange(): Event<any> {
    return this.channel.listen('onChange');
  }

  getValue() {
    return this.channel.call('getValue');
  }
}
