/**
 * Generates the Focal app assets by drawing the mark: a ring with a solid
 * centre — a focal point. Monochrome, matching the app's design system.
 *
 * Pure Node, no native image libraries. Shapes are rasterised with a scanline
 * fill, supersampled, then box-downsampled for smooth edges.
 *
 * Run:  node scripts/generate-assets.js
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---------------------------------------------------------------- PNG output
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA

  const rowLen = width * 4;
  const raw = Buffer.alloc((rowLen + 1) * height);
  for (let y = 0; y < height; y++) {
    const off = y * (rowLen + 1);
    raw[off] = 0;
    rgba.copy(raw, off + 1, y * rowLen, (y + 1) * rowLen);
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ------------------------------------------------------------------- drawing
function createCanvas(w, h, bg) {
  const buf = Buffer.alloc(w * h * 4, 0);
  if (bg) {
    for (let i = 0; i < w * h; i++) {
      buf[i * 4] = bg[0];
      buf[i * 4 + 1] = bg[1];
      buf[i * 4 + 2] = bg[2];
      buf[i * 4 + 3] = 255;
    }
  }
  return buf;
}

// Filled disc.
function fillCircle(buf, w, h, cx, cy, r, color) {
  const r2 = r * r;
  const y0 = Math.max(0, Math.floor(cy - r));
  const y1 = Math.min(h - 1, Math.ceil(cy + r));
  for (let y = y0; y <= y1; y++) {
    const dy = y + 0.5 - cy;
    const span = Math.sqrt(Math.max(0, r2 - dy * dy));
    const x0 = Math.max(0, Math.ceil(cx - span - 0.5));
    const x1 = Math.min(w - 1, Math.floor(cx + span - 0.5));
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      buf[i] = color[0];
      buf[i + 1] = color[1];
      buf[i + 2] = color[2];
      buf[i + 3] = 255;
    }
  }
}

// Annulus: outer disc minus inner disc (punched back to `hole`, which may be
// transparent for the adaptive icon).
function fillRing(buf, w, h, cx, cy, rOuter, rInner, color, hole) {
  fillCircle(buf, w, h, cx, cy, rOuter, color);
  const r2 = rInner * rInner;
  const y0 = Math.max(0, Math.floor(cy - rInner));
  const y1 = Math.min(h - 1, Math.ceil(cy + rInner));
  for (let y = y0; y <= y1; y++) {
    const dy = y + 0.5 - cy;
    const span = Math.sqrt(Math.max(0, r2 - dy * dy));
    const x0 = Math.max(0, Math.ceil(cx - span - 0.5));
    const x1 = Math.min(w - 1, Math.floor(cx + span - 0.5));
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      buf[i] = hole ? hole[0] : 0;
      buf[i + 1] = hole ? hole[1] : 0;
      buf[i + 2] = hole ? hole[2] : 0;
      buf[i + 3] = hole ? 255 : 0;
    }
  }
}

// The Focal mark, drawn centred. `size` is the outer diameter.
function drawMark(buf, w, h, cx, cy, size, fg, bg) {
  const rOuter = size / 2;
  const stroke = size * 0.085;
  const rInner = rOuter - stroke;
  const rCore = size * 0.17;

  fillRing(buf, w, h, cx, cy, rOuter, rInner, fg, bg);
  fillCircle(buf, w, h, cx, cy, rCore, fg);
}

function downsample(src, w, h, scale) {
  const dw = Math.round(w / scale);
  const dh = Math.round(h / scale);
  const out = Buffer.alloc(dw * dh * 4);
  const n = scale * scale;
  for (let y = 0; y < dh; y++) {
    for (let x = 0; x < dw; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const i = ((y * scale + sy) * w + (x * scale + sx)) * 4;
          r += src[i]; g += src[i + 1]; b += src[i + 2]; a += src[i + 3];
        }
      }
      const o = (y * dw + x) * 4;
      out[o] = Math.round(r / n);
      out[o + 1] = Math.round(g / n);
      out[o + 2] = Math.round(b / n);
      out[o + 3] = Math.round(a / n);
    }
  }
  return { buf: out, w: dw, h: dh };
}

// ------------------------------------------------------------------ targets
const INK = [24, 24, 27]; // colors.text (light) / accent
const PAPER = [255, 255, 255];
const NIGHT = [15, 15, 17]; // dark bg

const outDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(outDir, { recursive: true });

function render({ name, width, height, scale, background, fg, markSize }) {
  const w = width * scale;
  const h = height * scale;
  const buf = createCanvas(w, h, background);
  drawMark(buf, w, h, w / 2, h / 2, markSize * scale, fg, background);
  const { buf: out, w: dw, h: dh } = downsample(buf, w, h, scale);
  fs.writeFileSync(path.join(outDir, name), encodePng(dw, dh, out));
  console.log(`  ${name.padEnd(20)} ${dw}x${dh}`);
}

console.log('Generando assets de Focal...');

// App icon — dark ink field, light mark. Full bleed, no transparency.
render({ name: 'icon.png', width: 1024, height: 1024, scale: 3, background: INK, fg: PAPER, markSize: 500 });

// Android adaptive foreground — transparent, inside the 66% safe circle.
// Outer radius 250 < 338, so nothing is cropped.
render({ name: 'adaptive-icon.png', width: 1024, height: 1024, scale: 3, background: null, fg: PAPER, markSize: 460 });

// Splash screens, one per theme.
render({ name: 'splash.png', width: 1242, height: 2436, scale: 2, background: PAPER, fg: INK, markSize: 200 });
render({ name: 'splash-dark.png', width: 1242, height: 2436, scale: 2, background: NIGHT, fg: PAPER, markSize: 200 });

render({ name: 'favicon.png', width: 64, height: 64, scale: 8, background: INK, fg: PAPER, markSize: 36 });

console.log('Listo.');
