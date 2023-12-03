import { Emitter, Event } from '../../base/common/event';
import { NOTIMPLEMENTED } from '../../base/common/notreached';
import { IServerChannel } from '../../base/ipc/common/ipc';
import { IModelServer, Particle } from '../../platform/model/server/model';

export class ModelService implements IModelServer {
  private _onUpdate = new Emitter<void>();
  private _onTick = new Emitter<void>();
  private _particles: Array<Particle> = [];

  get onUpdate() {return this._onUpdate.event;}
  get onTick() {return this._onTick.event;}
  echo(): string {
    return 'hello model!';
  }
  load(size: { w: number, h: number }) {
    const { w, h } = size;
    const particles: Array<Particle> = [];
    const patriclesNum = 2;
    const colors = ['#f35d4f', '#f36849', '#c0d988', '#6ddaf1', '#f1e85b'];
    for (var i = 0; i < patriclesNum; i++) {
      particles.push({
        x: Math.round(Math.random() * w),
        y: Math.round(Math.random() * h),
        rad: Math.round(Math.random()) + 1,
        rgba: colors[Math.round(Math.random() * 3)],
        vx: Math.round(Math.random() * 3) - 1.5,
        vy: Math.round(Math.random() * 3) - 1.5,
      });
    }
    this._particles = particles;
    this._onUpdate.fire();
    const tick = () => {
      for (let i = 0; i < patriclesNum; i++) {
        let temp = particles[i];
        temp.x += temp.vx;
        temp.y += temp.vy;

        if (temp.x > w) temp.x = 0;
        if (temp.x < 0) temp.x = w;
        if (temp.y > h) temp.y = 0;
        if (temp.y < 0) temp.y = h;
      }
      this._onTick.fire();
      requestAnimationFrame(tick);
    };
    tick();
  }
  getParticles(): Particle[] {
    return this._particles;
  }
}

export class ModelChannel implements IServerChannel {
  constructor(private modelServer: IModelServer) {
  }

  listen(context: any, event: string): Event<any> {
    switch (event) {
      case 'onUpdate':
        return this.modelServer.onUpdate;
      case 'onTick':
        return this.modelServer.onTick;
    }
    return NOTIMPLEMENTED();
  }

  async call(context: any, command: string, arg?: any): Promise<any> {
    switch (command) {
      case 'echo':
        return this.modelServer.echo();
      case 'load':
        return this.modelServer.load(arg);
      case 'getParticles':
        return this.modelServer.getParticles();
    }
    NOTIMPLEMENTED();
  }
}
