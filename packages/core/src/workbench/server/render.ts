import { Emitter, Event } from '../../base/common/event';
import { NOTIMPLEMENTED } from '../../base/common/notreached';
import { IServerChannel } from '../../base/ipc/common/ipc';
import { IRenderServer } from '../../platform/render/server/render';

export class RenderService implements IRenderServer {
  private _onUpdate = new Emitter<void>();

  get onUpdate() {return this._onUpdate.event;}
  echo(): string {
    return 'hello render!';
  }
}

export class RenderChannel implements IServerChannel {
  constructor(private renderServer: IRenderServer) {
  }

  listen(context: any, event: string): Event<any> {
    switch (event) {
      case 'onUpdate':
        return this.renderServer.onUpdate;
    }
    return NOTIMPLEMENTED();
  }

  async call(context: any, command: string, arg?: any): Promise<any> {
    switch (command) {
      case 'echo':
        return this.renderServer.echo();
    }
    NOTIMPLEMENTED();
  }
}
