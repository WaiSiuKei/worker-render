import { CancellationToken } from '../../base/common/cancellation';
import { NOTIMPLEMENTED } from '../../base/common/notreached';
import { Client as MessagePortClient } from '../../base/ipc/browser/ipc.mp';
import { Event } from '../../base/common/event';

const id = 'render';
let client: MessagePortClient;
onmessage = (event) => {
  console.log(id, event.data);
  if (event.data === 'connect') {
    client = new MessagePortClient(event.ports[0], id);
    client.registerChannel(id, {
      call(command: string, arg: any, cancellationToken: CancellationToken): Promise<any> {
        switch (command) {
          case 'test':
            return Promise.resolve(id);
          default:
            return Promise.reject(new Error('not implemented'));
        }
      },

      listen(event: string, arg?: any): Event<any> {
        NOTIMPLEMENTED();
      }
    });
  }
};

export {};

