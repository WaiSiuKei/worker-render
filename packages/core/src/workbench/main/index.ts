import { Client } from '../../base/ipc/browser/ipc.mp';
import { getDelayedChannel, IChannel } from '../../base/ipc/common/ipc';
import { IPCSetupCommand } from '../../base/ipc/worker/ipc.mp';
import { ModelService } from '../client/model';
import { RenderService } from '../client/render';
import { run } from '../common/draw';
import ModelInWorker from '../worker/model?worker';
import RenderInWorker from '../worker/render?worker';
import { Event } from '../../base/common/event';
import Debug from 'debug';

const debug = Debug('editor:ma');

export class Application {
  model: Worker;
  render: Worker;
  private readonly withModelConnection: Promise<Client>;
  private readonly withRenderConnection: Promise<Client>;
  modelService: ModelService;
  renderService: RenderService;
  mainCanvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor() {
    this.model = new ModelInWorker();
    this.render = new RenderInWorker();
    this.withModelConnection = this.connect(this.model, 'main2model');
    this.withRenderConnection = this.connect(this.render, 'main2render');
    this.modelService = new ModelService(this.getChannel(this.withModelConnection, 'model'));
    this.renderService = new RenderService(this.getChannel(this.withRenderConnection, 'render'));

    const mainCanvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;
    const renderCanvas = document.querySelector('#renderCanvas') as HTMLCanvasElement;
    const rect = renderCanvas.getBoundingClientRect();
    renderCanvas.width = rect.width;
    renderCanvas.height = rect.height;
    mainCanvas.width = rect.width;
    mainCanvas.height = rect.height;
    Object.assign(renderCanvas.style, { width: rect.width + 'px', height: rect.height + 'px' });
    Object.assign(mainCanvas.style, { width: rect.width + 'px', height: rect.height + 'px' });
    const offscreen = renderCanvas.transferControlToOffscreen();
    this.render.postMessage({ canvas: offscreen }, [offscreen]);
    this.mainCanvas = mainCanvas;
    this.ctx = mainCanvas.getContext('2d')!;
    this.init();
  }

  async init() {
    await this.connectModelAndRender();
    this.start();
  }

  async connect(worker: Worker, channelName: string): Promise<Client> {
    worker.postMessage({
      command: IPCSetupCommand.createMessageChannel,
      arg: channelName
    });
    const onMessageChannelResult = Event.fromDOMEventEmitter<MessageEvent>(worker, 'message');
    const e = await Event.toPromise(Event.once(Event.filter(onMessageChannelResult, e => {
      const { data } = e;
      return data.command && data.command === IPCSetupCommand.createMessageChannelResult && data.arg === channelName;
    })));

    return new Client(e.ports[0], channelName);
  }

  async connectModelAndRender() {
    return new Promise<void>(async (c) => {
      const channelName = 'model2worker';
      this.model.postMessage({
        command: IPCSetupCommand.createMessageChannel,
        arg: channelName
      });
      const onCreateMessagePortResult = Event.fromDOMEventEmitter<MessageEvent>(this.model, 'message');
      const onTransferMessagePortResult = Event.filter(Event.fromDOMEventEmitter<MessageEvent>(this.render, 'message'), e => {
        const { data } = e;
        return data.command && data.command === IPCSetupCommand.transferMessageChannelResult;
      });
      const e = await Event.toPromise(Event.once(Event.filter(onCreateMessagePortResult, e => {
        const { data } = e;
        return data.command && data.command === IPCSetupCommand.createMessageChannelResult && data.arg === channelName;
      })));

      const port = e.ports[0];
      this.render.postMessage({ port, channelName }, {
        transfer: [port]
      });
      Event.once(onTransferMessagePortResult)(() => c());
    });
  }

  getChannel(connection: Promise<Client>, channelName: string): IChannel {
    return getDelayedChannel(connection.then(connection => connection.getChannel(channelName)));
  }

  start() {
    run(this.ctx, this.mainCanvas.width, this.mainCanvas.height);
    this.renderService.render({ width: this.mainCanvas.width, height: this.mainCanvas.height });
    (function loop() {
      const ret = longTask();
      Reflect.set(window, 'test', ret);
      requestAnimationFrame(loop);
    })();
  }
}

function longTask() {
  let count = 1;
  for (let i = 0; i < 8e7; i++) {
    count += i;
  }
  return count;
}
