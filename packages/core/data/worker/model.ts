import { CancellationToken } from '../../base/common/cancellation';
import { Emitter, Event } from '../../base/common/event';
import { NOTIMPLEMENTED, NOTREACHED } from '../../base/common/notreached';
import { Client as MessagePortClient } from '../../base/ipc/browser/ipc.mp';
import { IServerChannel } from '../../base/ipc/common/ipc';
import { IPCChannel } from '../../platform/ipc/worker/ipc';

let client: MessagePortClient;
onmessage = (event) => {
  const { command, arg } = event.data;
  if (command === 'connect') {
    client = new MessagePortClient(event.ports[0], arg);
    client.registerChannel(arg, new IPCChannel());
  }
};

export {};

export class IPCChannel implements IServerChannel {
  _onChange = new Emitter<string>();
  call(_: unknown, command: string, arg: any, cancellationToken: CancellationToken): Promise<any> {
    console.log('call', _, command, arg);
    switch (command) {
      case
    }
    return NOTIMPLEMENTED();
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

