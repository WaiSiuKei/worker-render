import { DeferredPromise } from '../../base/common/async';
import { Event } from '../../base/common/event';
import { NOTIMPLEMENTED } from '../../base/common/notreached';
import { Client } from '../../base/ipc/browser/ipc.mp';
import { getDelayedChannel, IChannel, IServerChannel } from '../../base/ipc/common/ipc';
import { IPCSetupCommand, Server } from '../../base/ipc/worker/ipc.mp';
import Debug from 'debug';
import { ModelService } from '../client/model';

const debug = Debug('editor:re');
debug.enabled = true;

class RenderChannel implements IServerChannel {
  constructor(private ctx: OffscreenCanvasRenderingContext2D) {}
  listen(context: any, event: string): Event<any> {
    return NOTIMPLEMENTED();
  }

  async call(context: any, command: string, arg?: any): Promise<any> {
    switch (command) {
      case 'echo':
        return 'hello render!';
      case 'render':
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(200, 100);
        this.ctx.stroke();
        return;
    }
    NOTIMPLEMENTED();
  }
}

type CanvasPayload = { canvas: OffscreenCanvas }
type PortPayload = { port: MessagePort, channelName: string }

class RenderInWorker {
  private readonly withModelConnection: Promise<Client>;
  private server = new Server();
  private onModelConnected = new DeferredPromise<void>();
  constructor() {
    this.initService();
    this.withModelConnection = this.connectModel();
    const modelService = new ModelService(this.getChannel(this.withModelConnection, 'model'));
    modelService.onUpdate(e => {
      debug('moved');
    });
    modelService.echo().then(() => {
      this.onModelConnected.complete();
    });
  }

  getChannel(connection: Promise<Client>, channelName: string): IChannel {
    return getDelayedChannel(connection.then(connection => connection.getChannel(channelName)));
  }

  initService() {
    const onCanvasReceived = Event.filter(Event.fromDOMEventEmitter<MessageEvent<CanvasPayload>>(self, 'message'), e => !!e.data.canvas);
    onCanvasReceived(e => {
      const { canvas } = e.data;
      const ctx = canvas.getContext('2d')!;

      this.server.registerChannel('render', new RenderChannel(ctx));
    });
  }

  connectModel() {
    return new Promise<Client>(c => {
      const onPortReceived = Event.once(Event.filter(Event.fromDOMEventEmitter<MessageEvent<PortPayload>>(self, 'message'), e => !!e.data.port));
      onPortReceived(e => {
        const { channelName } = e.data;
        c(new Client(e.ports[0], channelName));
        this.onModelConnected.p.then(() => {
          self.postMessage({ command: IPCSetupCommand.transferMessageChannelResult, arg: channelName });
        });
      });
    });
  }
}

new RenderInWorker();
