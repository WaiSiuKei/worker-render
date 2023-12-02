import { Emitter, Event } from '../../base/common/event';
import { NOTIMPLEMENTED } from '../../base/common/notreached';
import { IServerChannel } from '../../base/ipc/common/ipc';
import { IRenderServer } from '../../platform/render/server/render';
import { run } from '../common/draw';

export class RenderService implements IServerChannel, IRenderServer {
  private _onUpdate = new Emitter<void>();
  constructor(private ctx: OffscreenCanvasRenderingContext2D) {}

  get onUpdate() {return this._onUpdate.event;}
  echo(): string {
    return 'hello render!';
  }

  render(size: { width: number, height: number }) {
    run(this.ctx, size.width, size.height);
  }

  listen(context: any, event: string): Event<any> {
    switch (event) {
      case 'onUpdate':
        return this.onUpdate;
    }
    return NOTIMPLEMENTED();
  }

  async call(context: any, command: string, arg?: any): Promise<any> {
    switch (command) {
      case 'echo':
        return this.echo();
      case 'render':
        return this.render(arg);
    }
    NOTIMPLEMENTED();
  }
}
