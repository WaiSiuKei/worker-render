import { CancellationToken } from '../../base/common/cancellation';
import { Emitter, Event } from '../../base/common/event';
import { NOTIMPLEMENTED, NOTREACHED } from '../../base/common/notreached';
import { Client as MessagePortClient } from '../../base/ipc/browser/ipc.mp';
import { IServerChannel } from '../../base/ipc/common/ipc';
import { Server } from '../../base/ipc/worker/ipc.mp';

let ipcClient: MessagePortClient;
let modelClient: MessagePortClient;
let mainPort: MessagePort;
const server = new Server()

onmessage = (event) => {
  const { command, arg } = event.data;
  if (command === 'connect') {
    mainPort = event.ports[0];
    ipcClient = new MessagePortClient(mainPort, arg);
    ipcClient.registerChannel(arg, new IPCChannel());

    const modelChannel = new MessageChannel();
  }
};

export {};

class IPCChannel implements IServerChannel {
  _onChange = new Emitter<MessagePort>();
  constructor(private channel: MessageChannel) {
    this._onChange.fire(channel.port2)
  }
  call(_: unknown, command: string, arg: any, cancellationToken: CancellationToken): Promise<any> {
    return NOTIMPLEMENTED()
  }

  listen(_: unknown, event: string, arg?: any): Event<any> {
    switch (event) {
      case 'onChange' :
        return this._onChange.event;
      default:
        NOTREACHED();
    }
  }
}

