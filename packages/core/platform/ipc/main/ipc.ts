import { Client } from '../../../base/ipc/browser/ipc.mp';
import { IChannel } from '../../../base/ipc/common/ipc';

export class IPCService {
  clients = new Map<string, Client>;
  messageChannels = new Map<string, MessageChannel>;
  connect(id: string, worker: Worker): IChannel {
    const messageChannel = new MessageChannel();
    const client = new Client(messageChannel.port1, id);
    worker.postMessage({ command: 'connect', arg: id }, [messageChannel.port2]);
    this.clients.set(id, client);
    this.messageChannels.set(id, messageChannel);
    return client.getChannel(id);
  }
}
