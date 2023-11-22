import { Event } from '../../base/common/event';
import { NOTIMPLEMENTED } from '../../base/common/notreached';
import { IServerChannel } from '../../base/ipc/common/ipc';
import { Server } from '../../base/ipc/worker/ipc.mp';

class ModelChannel implements IServerChannel {
  listen(context: any, event: string): Event<any> {
    return NOTIMPLEMENTED();
  }

  async call(context: any, command: string, arg?: any): Promise<any> {
    switch (command) {
      case 'test':
        return '123';
    }
    NOTIMPLEMENTED();
  }
}

const server = new Server();
server.registerChannel('m', new ModelChannel());
export {};
