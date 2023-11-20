import { CancellationToken } from '../../../base/common/cancellation';
import { NOTIMPLEMENTED } from '../../../base/common/notreached';
import { IServerChannel } from '../../../base/ipc/common/ipc';
import { Event } from '../../../base/common/event';

export class IPCChannel implements IServerChannel {
  call(_: unknown, command: string, arg: any, cancellationToken: CancellationToken): Promise<any> {
    switch (command) {
      case 'marco':
        return this.service.marco();
      case 'error':
        return this.service.error(arg);
      case 'neverComplete':
        return this.service.neverComplete();
      case 'neverCompleteCT':
        return this.service.neverCompleteCT(cancellationToken);
      case 'buffersLength':
        return this.service.buffersLength(arg);
      default:
        return Promise.reject(new Error('not implemented'));
    }
  }

  listen(_: unknown, event: string, arg?: any): Event<any> {
    return NOTIMPLEMENTED();
  }
}
