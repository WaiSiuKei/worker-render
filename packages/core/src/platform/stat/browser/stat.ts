const PR = 2;
const WIDTH = 80 * PR;
const HEIGHT = 48 * PR;
const TEXT_X = 3 * PR;
const TEXT_Y = 2 * PR;
const GRAPH_X = 3 * PR;
const GRAPH_Y = 15 * PR;
const GRAPH_WIDTH = 74 * PR;
const GRAPH_HEIGHT = 30 * PR;

const round = Math.round;
export function preparePanel(canvas: HTMLCanvasElement) {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  Object.assign(canvas.style, {
    width: '80px',
    height: '48px',
    pointerEvents: 'none',
  } as CSSStyleDeclaration);
}

function getTime() {
  return (performance || Date).now();
}

export class Panel {
  static ID = 0;
  id = Panel.ID++;
  private min = Infinity;
  private max = 0;
  private frames = 0;
  private prevTime = 0;
  private name = 'FPS';
  private fg = '#0ff';
  private bg = '#002';
  private context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement | OffscreenCanvas) {
    const context = canvas.getContext('2d')!;
    this.context = context;
    const { name, bg, fg } = this;
    context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
    context.textBaseline = 'top';

    context.fillStyle = bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
  }

  begin() {
    this.prevTime = getTime();
  }

  update() {
    this.frames += 1;

    var time = getTime();
    if (time >= this.prevTime + 1000) {
      this._update((this.frames * 1000) / (time - this.prevTime), 100);
      this.prevTime = time;
      this.frames = 0;
    }
  }

  private _update(value: number, maxValue: number) {
    let { name, fg, bg, context, canvas } = this;
    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);

    context.fillStyle = bg;
    context.globalAlpha = 1;
    context.fillRect(0, 0, WIDTH, GRAPH_Y);
    context.fillStyle = fg;
    context.fillText(round(value) + ' ' + name + ' (' + round(this.min) + '-' + round(this.max) + ')', TEXT_X, TEXT_Y);

    context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

    context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
  }
}
