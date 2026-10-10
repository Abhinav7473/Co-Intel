import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { CanvasTexture, MathUtils, SRGBColorSpace, type Group } from "three";
import { LAYERS, LAYERS_NOTE, PROMPT, SCREENS } from "@/content/intro";
import { rig } from "./conductor";
import { Flat } from "./Flat";

/**
 * The one 3D beat: Claude Code's four inputs as cards that come apart as the "What it reads" screen scrolls in
 * (stack → a 2×2 that faces the room, so every card can be read), reversible. Everything else in the talk is flat. Site palette: white cards, hairlines, ink type;
 * the accent belongs to the session so far, the part a fresh session drops.
 */
const W = 2.9;
const H = 1.9;
const GRID = [
  [-1.55, 1.05],
  [1.55, 1.05],
  [-1.55, -1.05],
  [1.55, -1.05],
] as const;

const css = (t: string) => getComputedStyle(document.documentElement).getPropertyValue(t).trim() || "#888";
const ease = (t: number) => t * t * (3 - 2 * t);

/** Index of the "reads" screen; the conductor's fractional screen value reaches it as the screen arrives. */
const AT = SCREENS.findIndex((x) => x.id === "reads");

export function World() {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0.8, 0.5, 9.3], fov: 32, near: 0.1, far: 60 }}
        dpr={[1, 1.75]}
        eventSource={document.body}
        eventPrefix="client"
        gl={{ antialias: true }}
        flat // no tone mapping: the site's white is white, not filmic grey
        fallback={<Flat play />}
      >
        <Cards />
      </Canvas>
      <p className="absolute bottom-0 left-0 text-[clamp(0.95rem,1vw,1.1rem)] text-mute">{LAYERS_NOTE}</p>
    </div>
  );
}

function Cards() {
  const cards = useRef<(Group | null)[]>([]);
  const state = useRef({ apart: 0, lx: 0, ly: 0 });
  const faces = useMemo(() => LAYERS.map((l, i) => face(l.key, (c) => (i === 0 ? paintMessage(c) : paintLayer(c, l.name, l.lines, l.key === "session")))), []);

  useFrame(({ camera, pointer, size }, dt) => {
    const s = state.current;
    const step = Math.min(dt, 1 / 30);
    // apart from about a third of the way in from the opening screen; fully apart once this screen is in place
    s.apart = MathUtils.damp(s.apart, ease(MathUtils.clamp((rig.exact - (AT - 0.65)) / 0.6, 0, 1)), 6, step);
    // a slight, damped lean toward the pointer, so it reads as an object, not a picture
    s.lx = MathUtils.damp(s.lx, pointer.x, 2.5, step);
    s.ly = MathUtils.damp(s.ly, pointer.y, 2.5, step);
    // narrow screens step back so the whole 2×2 stays in frame
    camera.position.set(0.8 + s.lx * 0.3, 0.5 + s.ly * 0.2, 9.3 * Math.max(1, 1.15 / (size.width / size.height)));
    camera.lookAt(0, 0, -0.4);
    cards.current.forEach((g, i) => {
      if (!g) return;
      // stacked (a chat app as you see it: only your message shows) → a 2×2 (what it actually sends)
      const [x, y] = GRID[i]!;
      g.position.set(MathUtils.lerp(0.12 * i, x, s.apart), MathUtils.lerp(0.1 * i, y, s.apart), MathUtils.lerp(-0.12 * i, -0.35 * i, s.apart));
      g.rotation.set(0, MathUtils.lerp(0, -0.08, s.apart), 0);
    });
  });

  return (
    <group rotation={[0.03, -0.1, 0]}>
      {LAYERS.map((l, i) => (
        <group key={l.key} ref={(g) => void (cards.current[i] = g)}>
          <RoundedBox args={[W, H, 0.06]} radius={0.06} smoothness={4}>
            {/* unlit: flat white like the site's cards; the painted hairline gives the edge */}
            <meshBasicMaterial color={css("--color-surface")} />
          </RoundedBox>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[W, H]} />
            <meshBasicMaterial map={faces[i]} transparent toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ faces
   Text is painted into canvas textures with the site's fonts and tokens, so it sits in the scene with real
   depth. Each face is painted once, again when web fonts land. Sizes are for a projector, not a laptop. */
const FACES = new Map<string, CanvasTexture>();
const PX = { w: 640, h: 420, s: 2 };

function face(key: string, paint: (c: CanvasRenderingContext2D) => void) {
  let t = FACES.get(key);
  if (t) return t;
  const cv = document.createElement("canvas");
  cv.width = PX.w * PX.s;
  cv.height = PX.h * PX.s;
  const draw = () => {
    const c = cv.getContext("2d")!;
    c.setTransform(PX.s, 0, 0, PX.s, 0, 0);
    c.clearRect(0, 0, PX.w, PX.h);
    paint(c);
  };
  draw();
  t = new CanvasTexture(cv);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  FACES.set(key, t);
  const tex = t;
  void document.fonts.ready.then(() => {
    draw();
    tex.needsUpdate = true;
  });
  return t;
}

const font = () => getComputedStyle(document.body).fontFamily;
const pad = 32;

function wrap(c: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (c.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** The site's card edge: a hairline just inside the slab, so cards read as cards from any angle. */
function edge(c: CanvasRenderingContext2D) {
  c.strokeStyle = css("--color-line-strong");
  c.lineWidth = 2;
  c.beginPath();
  c.roundRect(1, 1, PX.w - 2, PX.h - 2, 14);
  c.stroke();
}

function paintMessage(c: CanvasRenderingContext2D) {
  edge(c);
  c.fillStyle = css("--color-ink");
  c.font = `600 40px ${font()}`;
  c.fillText(LAYERS[0].name, pad, pad + 34);
  c.font = `400 34px ${font()}`;
  const lines = wrap(c, PROMPT, 520);
  const w = Math.max(...lines.map((l) => c.measureText(l).width)) + 44;
  const h = lines.length * 44 + 30;
  const x = PX.w - pad - w;
  const y = PX.h - pad - h;
  c.fillStyle = css("--color-ink");
  c.beginPath();
  c.roundRect(x, y, w, h, [22, 22, 6, 22]);
  c.fill();
  c.fillStyle = css("--color-canvas");
  lines.forEach((l, i) => c.fillText(l, x + 22, y + 48 + i * 44));
}

function paintLayer(c: CanvasRenderingContext2D, name: string, lines: readonly string[], accent: boolean) {
  edge(c);
  c.fillStyle = css(accent ? "--color-accent" : "--color-ink");
  c.font = `600 40px ${font()}`;
  c.fillText(name, pad, pad + 34);
  c.font = `400 36px ${font()}`;
  lines.forEach((x, i) => {
    const y = 118 + i * 96;
    c.fillStyle = css(accent ? "--color-accent-soft" : "--color-sunken");
    c.beginPath();
    c.roundRect(pad, y, PX.w - pad * 2, 80, 14);
    c.fill();
    c.fillStyle = css(accent ? "--color-accent" : "--color-ink");
    c.fillText(x, pad + 22, y + 53);
  });
}
