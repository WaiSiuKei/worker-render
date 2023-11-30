import { Client } from '../../base/ipc/browser/ipc.mp';
import { getDelayedChannel, IChannel, IServerChannel } from '../../base/ipc/common/ipc';
import { IPCSetupCommand } from '../../base/ipc/worker/ipc.mp';
import ModelInWorker from '../worker/model?worker';
import RenderInWorker from '../worker/render?worker';
import { Event } from '../../base/common/event';

export class MainThreadModel {
  model: Worker;
  render: Worker;
  private readonly withModelConnection: Promise<Client>;
  private readonly withRenderConnection: Promise<Client>;

  constructor() {
    this.model = new ModelInWorker();
    this.render = new RenderInWorker();
    this.withModelConnection = this.connect(this.model, 'main2model');
    this.withRenderConnection = this.connect(this.render, 'main2render');
    const modelService = new ModelService(this.getChannel(this.withModelConnection, 'model'));
    modelService.echo().then(console.log);

    const htmlCanvas = document.createElement('canvas');
    document.body.append(htmlCanvas);
    const offscreen = htmlCanvas.transferControlToOffscreen();
    const renderService = new RenderService(this.getChannel(this.withRenderConnection, 'render'));
    this.render.postMessage({ canvas: offscreen }, [offscreen]);
    renderService.echo().then(console.log);
    renderService.render();

    this.connectOnlyPort(this.render, 'model2render').then(port => {
      console.log('port', port);
      this.render.postMessage({ port }, {
        transfer: [port]
      });
    });
  }

  async connect(worker: Worker, channelName: string): Promise<Client> {
    worker.postMessage({
      command: IPCSetupCommand.createMessageChannel,
      arg: channelName
    });
    // Wait until the window has returned the `MessagePort`
    // We need to filter by the `nonce` to ensure we listen
    // to the right response.
    const onMessageChannelResult = Event.fromDOMEventEmitter<MessageEvent>(worker, 'message');
    const e = await Event.toPromise(Event.once(Event.filter(onMessageChannelResult, e => {
      const { data } = e;
      return data.command && data.command === IPCSetupCommand.createMessageChannelResult && data.arg === channelName;
    })));

    return new Client(e.ports[0], channelName);
  }

  async connectOnlyPort(worker: Worker, channelName: string): Promise<MessagePort> {
    worker.postMessage({
      command: IPCSetupCommand.createMessageChannel,
      arg: channelName
    });
    // Wait until the window has returned the `MessagePort`
    // We need to filter by the `nonce` to ensure we listen
    // to the right response.
    const onMessageChannelResult = Event.fromDOMEventEmitter<MessageEvent>(worker, 'message');
    const e = await Event.toPromise(Event.once(Event.filter(onMessageChannelResult, e => {
      const { data } = e;
      return data.command && data.command === IPCSetupCommand.createMessageChannelResult && data.arg === channelName;
    })));

    return e.ports[0];
  }

  getChannel(connection: Promise<Client>, channelName: string): IChannel {
    return getDelayedChannel(connection.then(connection => connection.getChannel(channelName)));
  }

  registerChannel(connection: Promise<Client>, channelName: string, channel: IServerChannel<string>): void {
    connection.then(connection => connection.registerChannel(channelName, channel));
  }
}

class ModelService {
  constructor(private channel: IChannel) {
  }

  echo() {
    return this.channel.call('echo');
  }
}

class RenderService {
  constructor(private channel: IChannel) {
  }

  echo() {
    return this.channel.call('echo');
  }

  render() {
    return this.channel.call('render');
  }
}
