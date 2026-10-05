/**
 * Refraction maps for liquid glass.
 *
 * We model the glass as a slab whose rim is a convex squircle bevel. A ray
 * looking straight down hits the sloped rim, bends toward the surface normal
 * (Snell, n≈1.5) and lands further *inside* the shape. So each pixel near the
 * edge samples the backdrop from a point pushed toward the centre — that's
 * what makes the background visibly bend around the rim instead of blurring.
 *
 * Output is a PNG data URL for <feImage>: R = x-shift, G = y-shift, 128 = none.
 * <feDisplacementMap scale={2 * maxShift}> turns that back into pixels.
 */

export interface LensShape {
  width: number;
  height: number;
  radius: number;
  /** width of the curved rim in px; the flat middle does not refract */
  bezel: number;
}

const IOR = 1.5;
const SAMPLES = 256;

/** Normalised lateral shift (0..1) across the bezel, 0 = outer edge. */
const PROFILE: Float32Array = (() => {
  const height = (x: number) => Math.pow(1 - Math.pow(1 - x, 4), 1 / 4); // squircle
  const out = new Float32Array(SAMPLES);
  let max = 0;
  for (let i = 0; i < SAMPLES; i++) {
    const x = Math.max((i + 0.5) / SAMPLES, 1e-3);
    const dx = 1e-3;
    const slope = (height(Math.min(x + dx, 1)) - height(Math.max(x - dx, 0))) / (2 * dx);
    const incidence = Math.atan(slope);
    const refracted = Math.asin(Math.sin(incidence) / IOR);
    // lateral travel through the glass ∝ tan(deviation) × local thickness
    const shift = Math.tan(incidence - refracted) * (0.35 + height(x));
    out[i] = shift;
    max = Math.max(max, shift);
  }
  for (let i = 0; i < SAMPLES; i++) out[i]! /= max;
  return out;
})();

function roundedRectSdf(px: number, py: number, hw: number, hh: number, r: number): number {
  const qx = Math.abs(px) - hw + r;
  const qy = Math.abs(py) - hh + r;
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
}

const cache = new Map<string, string>();

export function refractionMap(shape: LensShape): string {
  const key = `${shape.width}x${shape.height}r${shape.radius}b${shape.bezel}`;
  const hit = cache.get(key);
  if (hit) return hit;

  // Big surfaces get a half-res map; feImage stretches it back up smoothly.
  const scale = shape.width * shape.height > 240_000 ? 0.5 : 1;
  const w = Math.max(1, Math.round(shape.width * scale));
  const h = Math.max(1, Math.round(shape.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const data = img.data;

  const hw = shape.width / 2;
  const hh = shape.height / 2;
  const r = Math.min(shape.radius, hw, hh);
  const bezel = Math.max(1, Math.min(shape.bezel, hw, hh));

  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const px = (i + 0.5) / scale - hw;
      const py = (j + 0.5) / scale - hh;
      const d = roundedRectSdf(px, py, hw, hh, r);
      const depth = -d;
      let vx = 0;
      let vy = 0;
      if (depth > 0 && depth < bezel) {
        // outward normal = SDF gradient
        const e = 0.5;
        let nx = roundedRectSdf(px + e, py, hw, hh, r) - roundedRectSdf(px - e, py, hw, hh, r);
        let ny = roundedRectSdf(px, py + e, hw, hh, r) - roundedRectSdf(px, py - e, hw, hh, r);
        const len = Math.hypot(nx, ny) || 1;
        nx /= len;
        ny /= len;
        const t = depth / bezel;
        const mag = PROFILE[Math.min(SAMPLES - 1, Math.floor(t * SAMPLES))]!;
        // sample inward (against the outward normal)
        vx = -nx * mag;
        vy = -ny * mag;
      }
      const o = (j * w + i) * 4;
      data[o] = Math.round(128 + vx * 127);
      data[o + 1] = Math.round(128 + vy * 127);
      data[o + 2] = 128;
      data[o + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const url = canvas.toDataURL("image/png");
  if (cache.size > 64) cache.clear();
  cache.set(key, url);
  return url;
}
