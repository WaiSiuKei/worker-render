import { Event } from '../../base/common/event';
import { NOTIMPLEMENTED } from '../../base/common/notreached';
import { Client } from '../../base/ipc/browser/ipc.mp';
import { getDelayedChannel, IChannel, IServerChannel } from '../../base/ipc/common/ipc';
import { IPCSetupCommand, Server } from '../../base/ipc/worker/ipc.mp';
// import RenderInWorker from './render?worker';

class ModelChannel implements IServerChannel {
  listen(context: any, event: string): Event<any> {
    return NOTIMPLEMENTED();
  }

  async call(context: any, command: string, arg?: any): Promise<any> {
    switch (command) {
      case 'echo':
        return 'hello model!';
    }
    NOTIMPLEMENTED();
  }
}

class ModelInWorker {
  // render: Worker;
  // private readonly withRenderConnection: Promise<Client>;
  constructor() {
    const server = new Server();
    server.registerChannel('model', new ModelChannel());
    // this.render = new RenderInWorker();
    // this.withRenderConnection = this.connect(this.render, 'model2render');
    //
    // type CanvasPassingPayload = { canvas: OffscreenCanvas }
    // const onMessage = Event.filter(Event.fromDOMEventEmitter<MessageEvent<CanvasPassingPayload>>(self, 'message'), e => !!e.data.canvas);
    // onMessage(e => {
    //   const { canvas } = e.data;
    //   this.render.postMessage({ canvas }, [canvas]);
    //   setTimeout(() => {
    //     renderService.render();
    //   });
    // });
    //
    // const renderService = new RenderService(this.getChannel(this.withRenderConnection, 'render'));
    // renderService.echo().then(console.log);
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

  getChannel(connection: Promise<Client>, channelName: string): IChannel {
    return getDelayedChannel(connection.then(connection => connection.getChannel(channelName)));
  }

  registerChannel(connection: Promise<Client>, channelName: string, channel: IServerChannel<string>): void {
    connection.then(connection => connection.registerChannel(channelName, channel));
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

new ModelInWorker();
