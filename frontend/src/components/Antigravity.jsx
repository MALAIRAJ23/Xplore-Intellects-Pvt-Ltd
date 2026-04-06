import { useEffect, useMemo, useRef } from 'react';

function Antigravity({
  count = 300,
  magnetRadius = 10,
  ringRadius = 10,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = '#FF9FFC',
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  const pointerRef = useRef({ x: 0, y: 0 });
  const virtualMouseRef = useRef({ x: 0, y: 0 });
  const lastMoveTsRef = useRef(0);
  const sizeRef = useRef({ width: 1, height: 1 });

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i += 1) {
      const t = Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const z = (Math.random() - 0.5) * 1;

      const x = Math.random();
      const y = Math.random();

      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      temp.push({
        t,
        speed,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        randomRadiusOffset
      });
    }

    return temp;
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current.width = rect.width;
      sizeRef.current.height = rect.height;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!pointerRef.current.x && !pointerRef.current.y) {
        pointerRef.current.x = rect.width / 2;
        pointerRef.current.y = rect.height / 2;
        virtualMouseRef.current.x = rect.width / 2;
        virtualMouseRef.current.y = rect.height / 2;
      }

      particles.forEach((p) => {
        const x = p.mx * rect.width;
        const y = p.my * rect.height;
        p.mx = x;
        p.my = y;
        p.cx = x;
        p.cy = y;
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const onPointerMove = (event) => {
      const rect = wrap.getBoundingClientRect();
      pointerRef.current.x = event.clientX - rect.left;
      pointerRef.current.y = event.clientY - rect.top;
      lastMoveTsRef.current = Date.now();
    };

    window.addEventListener('pointermove', onPointerMove);

    let raf;

    const drawParticle = (x, y, size, theta) => {
      if (particleShape === 'sphere') {
        ctx.beginPath();
        ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      if (particleShape === 'box') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(theta);
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.restore();
        return;
      }

      if (particleShape === 'tetrahedron') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(theta);
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.7);
        ctx.lineTo(size * 0.7, size * 0.7);
        ctx.lineTo(-size * 0.7, size * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        return;
      }

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(theta);
      const h = size * 0.55;
      const w = size * 0.24;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, w / 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = (timeMs) => {
      const widthPx = sizeRef.current.width;
      const heightPx = sizeRef.current.height;
      const tSec = timeMs * 0.001;

      ctx.clearRect(0, 0, widthPx, heightPx);
      ctx.fillStyle = color;

      let targetX = pointerRef.current.x;
      let targetY = pointerRef.current.y;

      if (autoAnimate && Date.now() - lastMoveTsRef.current > 1800) {
        targetX = widthPx / 2 + Math.sin(tSec * 0.8) * (widthPx * 0.18);
        targetY = heightPx / 2 + Math.cos(tSec * 1.1) * (heightPx * 0.14);
      }

      virtualMouseRef.current.x += (targetX - virtualMouseRef.current.x) * 0.08;
      virtualMouseRef.current.y += (targetY - virtualMouseRef.current.y) * 0.08;

      const mx = virtualMouseRef.current.x;
      const my = virtualMouseRef.current.y;
      const globalRotation = tSec * rotationSpeed;

      particles.forEach((p) => {
        p.t += p.speed / 2;

        const dz = 1 - p.cz * 0.02;
        const px = mx * dz;
        const py = my * dz;

        const dx = p.mx - px;
        const dy = p.my - py;
        const distance = Math.hypot(dx, dy);

        let tx = p.mx;
        let ty = p.my;
        let tz = p.mz * depthFactor;

        if (distance < magnetRadius * 12) {
          const angle = Math.atan2(dy, dx) + globalRotation;
          const wave = Math.sin(p.t * waveSpeed + angle) * (4 * waveAmplitude);
          const deviation = p.randomRadiusOffset * (5 / (fieldStrength + 0.1));
          const radius = ringRadius * 9 + wave + deviation;

          tx = px + radius * Math.cos(angle);
          ty = py + radius * Math.sin(angle);
          tz = p.mz * depthFactor + Math.sin(p.t) * waveAmplitude;
        }

        p.cx += (tx - p.cx) * lerpSpeed;
        p.cy += (ty - p.cy) * lerpSpeed;
        p.cz += (tz - p.cz) * lerpSpeed;

        const currentDistToMouse = Math.hypot(p.cx - px, p.cy - py);
        const distFromRing = Math.abs(currentDistToMouse - ringRadius * 9);
        let scaleFactor = 1 - distFromRing / 44;
        scaleFactor = Math.max(0, Math.min(1, scaleFactor));

        const pulse = 0.8 + Math.sin(p.t * pulseSpeed) * 0.2 * particleVariance;
        const finalScale = scaleFactor * pulse * particleSize * 3;
        const angle = Math.atan2(p.cy - py, p.cx - px) + Math.PI / 2;

        drawParticle(p.cx, p.cy, Math.max(0.3, finalScale), angle);
      });

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [
    particles,
    autoAnimate,
    color,
    fieldStrength,
    lerpSpeed,
    magnetRadius,
    particleShape,
    particleSize,
    particleVariance,
    pulseSpeed,
    ringRadius,
    rotationSpeed,
    waveAmplitude,
    waveSpeed,
    depthFactor
  ]);

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

export default Antigravity;
