import { Client } from '../../base/ipc/browser/ipc.mp';
import { getDelayedChannel, IChannel, IServerChannel } from '../../base/ipc/common/ipc';
import ModelInWorker from '../worker/model?worker';
import { Event } from '../../base/common/event';

export class MainThreadModel {
  model: Worker;
  private readonly withModelConnection: Promise<Client>;

  constructor() {
    this.model = new ModelInWorker();
    this.withModelConnection = this.connect('model');
    const modelService = new ModelService(this.getChannel('m'));
  }

  async connect(channelName: string): Promise<Client> {
    this.model.postMessage(JSON.stringify({
      command: 'mte:createMessageChannel',
      arg: channelName
    }));
    // Wait until the window has returned the `MessagePort`
    // We need to filter by the `nonce` to ensure we listen
    // to the right response.
    const onMessageChannelResult = Event.fromDOMEventEmitter<MessageEvent>(this.model, 'message');
    const e = await Event.toPromise(Event.once(Event.filter(onMessageChannelResult, e => {
      const data = JSON.parse(e.data);
      return data.command === 'mte:createMessageChannelResult' && data.arg === channelName;
    })));

    return new Client(e.ports[0], channelName);
  }

  getChannel(channelName: string): IChannel {
    return getDelayedChannel(this.withModelConnection.then(connection => connection.getChannel(channelName)));
  }

  registerChannel(channelName: string, channel: IServerChannel<string>): void {
    this.withModelConnection.then(connection => connection.registerChannel(channelName, channel));
  }
}

class ModelService {
  constructor(private channel: IChannel) {
    channel.call('test', 1).then(console.log);
  }
}
