import { Emitter, Event } from '../../base/common/event';
import { NOTIMPLEMENTED } from '../../base/common/notreached';
import { IServerChannel } from '../../base/ipc/common/ipc';
import { IModelServer } from '../../platform/model/server/model';

export class ModelService implements IModelServer {
  private _onUpdate = new Emitter<void>();
  private _history: Array<{ x: number, y: number }> = [];

  get onUpdate() {return this._onUpdate.event;}
  echo(): string {
    return 'hello model!';
  }
  move(point: { x: number, y: number }) {
    this._history.push(point);
    this._onUpdate.fire();
  }
}

export class ModelChannel implements IServerChannel {
  constructor(private modelServer: IModelServer) {
  }

  listen(context: any, event: string): Event<any> {
    switch (event) {
      case 'onUpdate':
        return this.modelServer.onUpdate;
    }
    return NOTIMPLEMENTED();
  }

  async call(context: any, command: string, arg?: any): Promise<any> {
    switch (command) {
      case 'echo':
        return this.modelServer.echo();
      case 'move':
        return this.modelServer.move(arg);
    }
    NOTIMPLEMENTED();
  }
}
