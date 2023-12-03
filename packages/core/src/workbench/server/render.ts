import { Emitter, Event } from '../../base/common/event';
import { NOTIMPLEMENTED } from '../../base/common/notreached';
import { IServerChannel } from '../../base/ipc/common/ipc';
import { IModelClient } from '../../platform/model/client/model';
import { Particle } from '../../platform/model/server/model';
import { IRenderServer } from '../../platform/render/server/render';
import { Panel } from '../../platform/stat/browser/stat';
import { run } from '../common/draw';

export class RenderService implements IServerChannel, IRenderServer {
  private _onUpdate = new Emitter<void>();
  constructor(private ctx: OffscreenCanvasRenderingContext2D, private model: IModelClient, private panel: Panel) {}

  get onUpdate() {return this._onUpdate.event;}
  echo(): string {
    return 'hello render!';
  }

  async render(size: { width: number, height: number }) {
    run(this.ctx, this.model, size.width, size.height, this.panel);
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
