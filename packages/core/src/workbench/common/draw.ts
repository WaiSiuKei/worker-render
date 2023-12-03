import { CancellationToken, CancellationTokenSource } from '../../base/common/cancellation';
import { IModelClient } from '../../platform/model/client/model';
import { Particle } from '../../platform/model/server/model';
import { Panel } from '../../platform/stat/browser/stat';

function findDistance(p1: Particle, p2: Particle) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export async function run(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  model: IModelClient,
  w: number,
  h: number,
  panel?: Panel,
) {
  let pending: number | undefined;
  panel?.begin();
  const draw = (particles: Particle[]) => {
    const patriclesNum = particles.length;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < patriclesNum; i++) {
      var temp = particles[i];
      var factor = 1;

      for (var j = 0; j < patriclesNum; j++) {
        var temp2 = particles[j];
        ctx.lineWidth = 0.5;

        if (temp.rgba == temp2.rgba && findDistance(temp, temp2) < 50) {
          ctx.strokeStyle = temp.rgba;
          ctx.beginPath();
          ctx.moveTo(temp.x, temp.y);
          ctx.lineTo(temp2.x, temp2.y);
          ctx.stroke();
          factor++;
        }
      }

      ctx.fillStyle = temp.rgba;
      ctx.strokeStyle = temp.rgba;

      ctx.beginPath();
      ctx.arc(temp.x, temp.y, temp.rad * factor, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(temp.x, temp.y, (temp.rad + 5) * factor, 0, Math.PI * 2, true);
      ctx.stroke();
      ctx.closePath();
    }
    panel?.update();
  };
  model.onTick((data) => {
    if (pending) {
      cancelAnimationFrame(pending);
    }
    pending = requestAnimationFrame(() => draw(data));
  });
}
