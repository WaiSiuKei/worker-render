import { Event } from '../../base/common/event';
import { NOTIMPLEMENTED } from '../../base/common/notreached';
import { IServerChannel } from '../../base/ipc/common/ipc';
import { Server } from '../../base/ipc/worker/ipc.mp';

let ctx: OffscreenCanvasRenderingContext2D;
class RenderChannel implements IServerChannel {
  listen(context: any, event: string): Event<any> {
    return NOTIMPLEMENTED();
  }

  async call(context: any, command: string, arg?: any): Promise<any> {
    switch (command) {
      case 'echo':
        return 'hello render!';
      case 'render':
        ctx.moveTo(0, 0);
        ctx.lineTo(200, 100);
        ctx.stroke();
        return;
    }
    NOTIMPLEMENTED();
  }
}

type CanvasPassingPayload = { canvas: OffscreenCanvas }
const onMessage = Event.filter(Event.fromDOMEventEmitter<MessageEvent<CanvasPassingPayload>>(self, 'message'), e => !!e.data.canvas);
onMessage(e => {
  const { canvas } = e.data;
  ctx = canvas.getContext('2d')!;
});

const server = new Server();
server.registerChannel('render', new RenderChannel());
export {};
