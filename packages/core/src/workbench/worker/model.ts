import { Event } from '../../base/common/event';
import { Client } from '../../base/ipc/browser/ipc.mp';
import { getDelayedChannel, IChannel, IServerChannel } from '../../base/ipc/common/ipc';
import { IPCSetupCommand, Server } from '../../base/ipc/worker/ipc.mp';
import { ModelChannel, ModelService } from '../server/model';

class ModelInWorker {
  modelService = new ModelService();
  constructor() {
    const server = new Server();
    const channel = new ModelChannel(this.modelService);
    server.registerChannel('model', channel);
    server.registerChannel('model2render', channel);
  }

  async connect(worker: Worker, channelName: string): Promise<Client> {
    worker.postMessage({
      command: IPCSetupCommand.createMessageChannel,
      arg: channelName
    });
    // Wait until the window has returned the `MessagePort`
    // We need to filter by the `nonce` to ensure we listen
    // to the right response.
    const onMessageChannelResult = Event.fromDOMEventEmitter<MessageEvent>(worker, 'message');
    const e = await Event.toPromise(Event.once(Event.filter(onMessageChannelResult, e => {
      const { data } = e;
      return data.command && data.command === IPCSetupCommand.createMessageChannelResult && data.arg === channelName;
    })));

    return new Client(e.ports[0], channelName);
  }

  getChannel(connection: Promise<Client>, channelName: string): IChannel {
    return getDelayedChannel(connection.then(connection => connection.getChannel(channelName)));
  }

  registerChannel(connection: Promise<Client>, channelName: string, channel: IServerChannel<string>): void {
    connection.then(connection => connection.registerChannel(channelName, channel));
  }
}

new ModelInWorker();
