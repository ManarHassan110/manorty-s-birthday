// ── Falling petals canvas ──
const canvas = document.getElementById('petal-canvas');
const ctx    = canvas.getContext('2d');
let W, H, petals = [];

const PETAL_COLORS = ['#f7c0d1','#f0b8cc','#faedf3','#d4537e','#c9a86c','#fdd9e8'];
const SHAPES       = ['heart', 'circle', 'petal'];
const TARGET       = 60;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function rand(a, b) { return Math.random() * (b - a) + a; }

function createPetal() {
  return {
    x:         rand(0, W),
    y:         rand(-60, -10),
    size:      rand(8, 18),
    speedY:    rand(1.2, 2.8),
    speedX:    rand(-0.6, 0.6),
    rot:       rand(0, Math.PI * 2),
    rotSpeed:  rand(-0.03, 0.03),
    color:     PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    shape:     SHAPES[Math.floor(Math.random() * SHAPES.length)],
    opacity:   rand(0.4, 0.85),
    sway:      rand(0.3, 0.8),
    swayPhase: rand(0, Math.PI * 2),
  };
}

function drawHeart(cx, cy, size, color, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle   = color;
  const s = size * 0.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.4);
  ctx.bezierCurveTo(cx, cy, cx - s, cy - s * 0.5, cx - s, cy - s * 0.1);
  ctx.bezierCurveTo(cx - s, cy - s * 0.8, cx, cy - s * 0.8, cx, cy - s * 0.4);
  ctx.bezierCurveTo(cx, cy - s * 0.8, cx + s, cy - s * 0.8, cx + s, cy - s * 0.1);
  ctx.bezierCurveTo(cx + s, cy - s * 0.5, cx, cy, cx, cy + s * 0.4);
  ctx.fill();
  ctx.restore();
}

function drawPetalShape(cx, cy, size, color, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle   = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, size * 0.35, size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCircle(cx, cy, size, color, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle   = color;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function animate(t) {
  ctx.clearRect(0, 0, W, H);

  if (petals.length < TARGET && Math.random() < 0.4) petals.push(createPetal());

  petals.forEach((p, i) => {
    p.y   += p.speedY;
    p.x   += p.speedX + Math.sin(t * 0.001 * p.sway + p.swayPhase) * 0.5;
    p.rot += p.rotSpeed;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    if      (p.shape === 'heart') drawHeart(0, 0, p.size, p.color, p.opacity);
    else if (p.shape === 'petal') drawPetalShape(0, 0, p.size, p.color, p.opacity);
    else                          drawCircle(0, 0, p.size, p.color, p.opacity);

    ctx.restore();

    if (p.y > H + 30) petals[i] = createPetal();
  });

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ── Scroll-triggered reveal ──
const revealEls = document.querySelectorAll(
  '.section-label, .message-body, .wish-icon, .wish-text, .wish-detail, .divider'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

revealEls.forEach(el => observer.observe(el));