// core.js — rules, drawing and touch controls shared by the game and the skills course.

const COLS = 10, HIDDEN = 2;
const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const GREY = '#8E8E8E';

const SHAPES = {
  I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1],[0,0,0]],
  S: [[0,1,1],[1,1,0],[0,0,0]],
  Z: [[1,1,0],[0,1,1],[0,0,0]],
  J: [[1,0,0],[1,1,1],[0,0,0]],
  L: [[0,0,1],[1,1,1],[0,0,0]],
};

// Palette colours, matched to the official colour of each piece as closely as the palette allows.
const COLOR = {
  I: '#A5BCD6', // Cerulean            (official: cyan)
  O: '#F5EFC6', // Transparent Yellow  (official: yellow)
  Z: '#4D0E12', // Sceptre Red         (official: red)
  L: '#4A2E27', // Potting Soil        (official: orange)
  S: '#231815', // Java                (official: green)
  J: '#6E86A6', // added: dusty blue   (official: blue)
  T: '#8C3B57', // added: raspberry    (official: purple)
};

const rotCW = s => s[0].map((_, i) => s.map(r => r[i]).reverse());
const ROT = {};
for (const t in SHAPES) {
  ROT[t] = [SHAPES[t]];
  for (let i = 1; i < 4; i++) ROT[t].push(rotCW(ROT[t][i - 1]));
}

// Super Rotation System wall kicks, as (x, y) with y pointing up.
const KICKS = {
  '0>1': [[0,0],[-1,0],[-1, 1],[0,-2],[-1,-2]],
  '1>0': [[0,0],[ 1,0],[ 1,-1],[0, 2],[ 1, 2]],
  '1>2': [[0,0],[ 1,0],[ 1,-1],[0, 2],[ 1, 2]],
  '2>1': [[0,0],[-1,0],[-1, 1],[0,-2],[-1,-2]],
  '2>3': [[0,0],[ 1,0],[ 1, 1],[0,-2],[ 1,-2]],
  '3>2': [[0,0],[-1,0],[-1,-1],[0, 2],[-1, 2]],
  '3>0': [[0,0],[-1,0],[-1,-1],[0, 2],[-1, 2]],
  '0>3': [[0,0],[ 1,0],[ 1, 1],[0,-2],[ 1,-2]],
};
const KICKS_I = {
  '0>1': [[0,0],[-2,0],[ 1,0],[-2,-1],[ 1, 2]],
  '1>0': [[0,0],[ 2,0],[-1,0],[ 2, 1],[-1,-2]],
  '1>2': [[0,0],[-1,0],[ 2,0],[-1, 2],[ 2,-1]],
  '2>1': [[0,0],[ 1,0],[-2,0],[ 1,-2],[-2, 1]],
  '2>3': [[0,0],[ 2,0],[-1,0],[ 2, 1],[-1,-2]],
  '3>2': [[0,0],[-2,0],[ 1,0],[-2,-1],[ 1, 2]],
  '3>0': [[0,0],[ 1,0],[-2,0],[ 1,-2],[-2, 1]],
  '0>3': [[0,0],[-1,0],[ 2,0],[-1,-2],[ 2, 1]],
};

// Guideline gravity: seconds per row = (0.8 - (level-1) * 0.007)^(level-1)
const gravityMs = lv => {
  const l = Math.min(lv, 20);
  return Math.pow(0.8 - (l - 1) * 0.007, l - 1) * 1000;
};

// ---------- Rules helpers (work on any grid) ----------
function collidesIn(grid, shape, ox, oy) {
  const rows = grid.length;
  for (let y = 0; y < shape.length; y++)
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;
      const gx = ox + x, gy = oy + y;
      if (gx < 0 || gx >= COLS || gy >= rows) return true;
      if (gy >= 0 && grid[gy][gx]) return true;
    }
  return false;
}

// Try an SRS rotation. Returns the new position and which kick test worked, or null.
function srsRotate(grid, p, dir) {
  if (p.type === 'O') return null;
  const to = (p.r + dir + 4) % 4;
  const table = (p.type === 'I' ? KICKS_I : KICKS)[`${p.r}>${to}`];
  const shape = ROT[p.type][to];
  for (let i = 0; i < table.length; i++) {
    const nx = p.x + table[i][0], ny = p.y - table[i][1];
    if (!collidesIn(grid, shape, nx, ny)) return { x: nx, y: ny, r: to, kick: i };
  }
  return null;
}

// T-spin check (3-corner rule). Returns 'full', 'mini' or null.
function tSpinCheck(grid, p, lastRot, lastKick) {
  if (p.type !== 'T' || !lastRot) return null;
  const occ = (x, y) => x < 0 || x >= COLS || y >= grid.length || (y >= 0 && grid[y][x]);
  const { x, y, r } = p;
  const c = [[x, y], [x + 2, y], [x, y + 2], [x + 2, y + 2]].map(([a, b]) => !!occ(a, b));
  if (c.filter(Boolean).length < 3) return null;
  const front = [[0, 1], [1, 3], [2, 3], [0, 2]][r];
  return (c[front[0]] && c[front[1]]) || lastKick === 4 ? 'full' : 'mini';
}

function pieceCells(p) {
  const out = [];
  ROT[p.type][p.r].forEach((row, y) => row.forEach((v, x) => { if (v) out.push([p.x + x, p.y + y]); }));
  return out;
}

// ---------- Drawing ----------
const mix = (hex, target, a) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (target - v) * a));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
const BEVEL = {};
const bevelOf = c => BEVEL[c] || (BEVEL[c] =
  { top: mix(c, 255, 0.5), left: mix(c, 255, 0.28), bottom: mix(c, 0, 0.38), right: mix(c, 0, 0.22) });

function poly(c, pts) {
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  c.closePath(); c.fill();
}

// Bevelled, arcade-style block
function block(c, px, py, s, color, alpha = 1) {
  const b = Math.max(2, Math.round(s * 0.16));
  const v = bevelOf(color);
  c.globalAlpha = alpha;
  c.fillStyle = color; c.fillRect(px, py, s, s);
  c.fillStyle = v.top;    poly(c, [[px, py], [px + s, py], [px + s - b, py + b], [px + b, py + b]]);
  c.fillStyle = v.left;   poly(c, [[px, py], [px + b, py + b], [px + b, py + s - b], [px, py + s]]);
  c.fillStyle = v.bottom; poly(c, [[px, py + s], [px + b, py + s - b], [px + s - b, py + s - b], [px + s, py + s]]);
  c.fillStyle = v.right;  poly(c, [[px + s, py], [px + s, py + s], [px + s - b, py + s - b], [px + s - b, py + b]]);
  c.fillStyle = 'rgba(255,255,255,0.45)';
  c.fillRect(px + b + 1, py + b + 1, Math.max(1, Math.round(b * 0.7)), Math.max(1, Math.round(b * 0.7)));
  c.strokeStyle = 'rgba(0,0,0,0.22)'; c.lineWidth = 1;
  c.strokeRect(px + 0.5, py + 0.5, s - 1, s - 1);
  c.globalAlpha = 1;
}

function drawMini(c, type, cx, cy, ns, alpha = 1) {
  const s = SHAPES[type].filter(r => r.some(v => v));
  const w = s[0].length, h = s.length;
  const ox = Math.round(cx - (w * ns) / 2), oy = Math.round(cy - (h * ns) / 2);
  s.forEach((row, y) => row.forEach((v, x) => { if (v) block(c, ox + x * ns, oy + y * ns, ns, COLOR[type], alpha); }));
}

function drawGhost(c, cells, cell, rowOffset) {
  cells.forEach(([x, y]) => {
    if (y < rowOffset) return;
    const px = x * cell, py = (y - rowOffset) * cell;
    c.fillStyle = 'rgba(0,0,0,0.06)'; c.fillRect(px, py, cell, cell);
    c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 1.5;
    c.setLineDash([3, 3]); c.strokeRect(px + 2, py + 2, cell - 4, cell - 4); c.setLineDash([]);
  });
}

function drawGridLines(c, cols, rows, cell) {
  c.strokeStyle = 'rgba(0,0,0,0.06)'; c.lineWidth = 1;
  for (let x = 1; x < cols; x++) { c.beginPath(); c.moveTo(x * cell + .5, 0); c.lineTo(x * cell + .5, rows * cell); c.stroke(); }
  for (let y = 1; y < rows; y++) { c.beginPath(); c.moveTo(0, y * cell + .5); c.lineTo(cols * cell, y * cell + .5); c.stroke(); }
}

function setCanvas(c, cx, w, h) {
  const dpr = window.devicePixelRatio || 1;
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
  c.style.width = w + 'px'; c.style.height = h + 'px';
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function bigText(c, text, x, y, size, alpha = 1) {
  c.save();
  c.globalAlpha = Math.max(0, alpha);
  c.font = `500 ${size}px ${FONT}`;
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.lineJoin = 'round';
  c.lineWidth = Math.max(3, size * 0.22);
  c.strokeStyle = '#fff'; c.strokeText(text, x, y);
  c.fillStyle = '#000'; c.fillText(text, x, y);
  c.restore();
}

// ---------- Touch controls (modelled on the official mobile "swipe" controls) ----------
// Drag left/right: piece follows your finger, a short distance per column.
// Slide down: soft drop.  Flick down: hard drop.  Flick up or tap the Hold box: hold.
// Tap anywhere: rotate right.  Two-finger tap: rotate left.
function attachTouch(o) {
  let t = null;
  const stepX = () => Math.max(14, Math.min(24, o.cell() * 0.62));
  const stepY = () => Math.max(16, Math.min(28, o.cell() * 0.75));

  document.addEventListener('touchstart', e => {
    if (e.target.closest('button, a, .no-touch')) return;
    const inHold = o.holdEl && o.holdEl.contains(e.target);
    if (o.area && !o.area.contains(e.target) && !inHold) return;   // let the page scroll elsewhere
    if (!o.active()) return;
    e.preventDefault();
    if (inHold && e.touches.length === 1) { o.hold(); t = null; return; }
    if (t && e.touches.length === 2) { t.two = true; return; }
    if (e.touches.length > 1) return;
    const p = e.touches[0], now = performance.now();
    t = { x0: p.clientX, y0: p.clientY, ax: p.clientX, ay: p.clientY, t0: now,
          far: 0, two: false, hist: [[p.clientY, now]] };
  }, { passive: false });

  document.addEventListener('touchmove', e => {
    if (!t) return;
    e.preventDefault();
    if (t.two || !o.active()) return;
    const p = e.touches[0], now = performance.now();
    const dx = p.clientX - t.x0, dy = p.clientY - t.y0;
    t.far = Math.max(t.far, Math.hypot(dx, dy));

    // sideways: ignore while the gesture is clearly a downward flick
    const vertical = Math.abs(dy) > 2.2 * Math.abs(dx) && Math.abs(dy) > 20;
    const sx = stepX();
    if (!vertical) {
      while (p.clientX - t.ax >= sx) { o.move(1); t.ax += sx; }
      while (t.ax - p.clientX >= sx) { o.move(-1); t.ax -= sx; }
    } else t.ax = p.clientX;

    // downward slide: soft drop, only when mostly vertical
    const sy = stepY();
    if (dy > 0 && dy > 1.2 * Math.abs(dx)) {
      while (p.clientY - t.ay >= sy) { t.ay += sy; o.soft(); }
    } else t.ay = Math.max(t.ay, p.clientY);

    t.hist.push([p.clientY, now]);
    while (t.hist.length > 2 && now - t.hist[0][1] > 90) t.hist.shift();
  }, { passive: false });

  document.addEventListener('touchend', e => {
    if (!t) return;
    e.preventDefault();
    if (e.touches.length > 0) return;
    const now = performance.now(), dt = now - t.t0;
    const last = e.changedTouches[0];
    const dx = last.clientX - t.x0, dy = last.clientY - t.y0;
    const h0 = t.hist[0];
    const vy = (last.clientY - h0[0]) / Math.max(1, now - h0[1]);
    if (t.two) { if (dt < 400) o.ccw(); }
    else if (t.far < 10 && dt < 300) o.cw();
    else if (vy > 0.8 && dy > 30 && dy > 1.5 * Math.abs(dx)) o.hard();
    else if (vy < -0.6 && dy < -30 && -dy > 1.5 * Math.abs(dx)) o.hold();
    t = null;
  }, { passive: false });

  document.addEventListener('touchcancel', () => { t = null; });
}
