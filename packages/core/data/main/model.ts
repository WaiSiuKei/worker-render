import ModelInWorker from '../worker/model?worker';
// import RenderInWorker from '../worker/render?worker';

export class MainThreadModel {
  model: Worker;
  constructor() {
    this.model = new ModelInWorker();
    this.model.onmessage = (e) => {
      console.log('e', e);
    };
    this.model.postMessage(JSON.stringify({
      command: 'mte:createMessageChannel',
      arg: 'model'
    }));
    this.model.postMessage(JSON.stringify({
      command: 'mte:createMessageChannel',
      arg: 'ipc'
    }));
  }
}
