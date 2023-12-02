interface Particle {
  x: number,
  y: number,
  rad: number,
  rgba: string,
  vx: number,
  vy: number
}

export function run(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, w: number, h: number) {
  const particles: Array<Particle> = [];
  const patriclesNum = 500;
  const colors = ['#f35d4f', '#f36849', '#c0d988', '#6ddaf1', '#f1e85b'];
  for (var i = 0; i < patriclesNum; i++) {
    particles.push({
      x: Math.round(Math.random() * w),
      y: Math.round(Math.random() * h),
      rad: Math.round(Math.random() * 1) + 1,
      rgba: colors[Math.round(Math.random() * 3)],
      vx: Math.round(Math.random() * 3) - 1.5,
      vy: Math.round(Math.random() * 3) - 1.5,
    });
  }


  const draw = () => {
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

      temp.x += temp.vx;
      temp.y += temp.vy;

      if (temp.x > w) temp.x = 0;
      if (temp.x < 0) temp.x = w;
      if (temp.y > h) temp.y = 0;
      if (temp.y < 0) temp.y = h;
    }
  };
  function findDistance(p1: Particle, p2: Particle) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  (function loop() {
    draw();
    requestAnimationFrame(loop);
  })();
}
