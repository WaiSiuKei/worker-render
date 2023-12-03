import { DeferredPromise } from '../../base/common/async';
import { Event } from '../../base/common/event';
import { Client } from '../../base/ipc/browser/ipc.mp';
import { getDelayedChannel, IChannel } from '../../base/ipc/common/ipc';
import { IPCSetupCommand, Server } from '../../base/ipc/worker/ipc.mp';
import Debug from 'debug';
import { ModelService } from '../client/model';
import { RenderService } from '../server/render';

const debug = Debug('editor:re');
debug.enabled = true;

type CanvasPayload = { canvas: OffscreenCanvas }
type PortPayload = { port: MessagePort, channelName: string }

class RenderInWorker {
  private readonly withModelConnection: Promise<Client>;
  private server = new Server();
  private onModelConnected = new DeferredPromise<void>();
  private onCanvasConnected = new DeferredPromise<void>();
  private renderService!: RenderService;
  private modelService: ModelService;
  constructor() {
    this.initService();
    this.withModelConnection = this.connectModel();
    this.modelService = new ModelService(this.getChannel(this.withModelConnection, 'model'));
    this.modelService.echo().then(() => {
      this.onModelConnected.complete();
    });
  }

  getChannel(connection: Promise<Client>, channelName: string): IChannel {
    return getDelayedChannel(connection.then(connection => connection.getChannel(channelName)));
  }

  initService() {
    const onCanvasReceived = Event.filter(Event.fromDOMEventEmitter<MessageEvent<CanvasPayload>>(self, 'message'), e => !!e.data.canvas);
    Event.once(onCanvasReceived)(e => {
      const { canvas } = e.data;
      const ctx = canvas.getContext('2d')!;

      this.renderService = new RenderService(ctx, this.modelService);
      this.server.registerChannel('render', this.renderService);
      this.onCanvasConnected.complete();
    });
  }

  connectModel() {
    return new Promise<Client>(c => {
      const onPortReceived = Event.once(Event.filter(Event.fromDOMEventEmitter<MessageEvent<PortPayload>>(self, 'message'), e => !!e.data.port));
      onPortReceived(e => {
        const { channelName } = e.data;
        c(new Client(e.ports[0], channelName));
        Promise.all([
          this.onModelConnected.p,
          this.onCanvasConnected.p
        ]).then(() => {
          self.postMessage({ command: IPCSetupCommand.transferMessageChannelResult, arg: channelName });
        });
      });
    });
  }
}

new RenderInWorker();
