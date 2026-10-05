import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Plus, RotateCcw } from "lucide-react";
import type { BoardPin } from "@/api/types";
import { useBoard, useResetBoard, useSavePin } from "@/hooks/useBoard";
import { Button } from "@/ui/Button";
import { LiquidGlass } from "@/ui/LiquidGlass";
import { WidgetFrame } from "@/ui/Panel";
import { clamp01 } from "@/utils/tones";

/** keep lenses fully inside the board: map 0..1 onto an inset band */
const INSET = 7;
const at = (v: number) => `${INSET + v * (100 - 2 * INSET)}%`;

const PIN_HUES = ["#0072b2", "#0072b2", "#0072b2", "#0072b2", "#0072b2", "#a94400"];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export function ControlMemoryBoard() {
  const { data: pins = [] } = useBoard();
  const save = useSavePin();
  const reset = useResetBoard();
  const [drag, setDrag] = useState<BoardPin | null>(null);
  const [draft, setDraft] = useState("");
  // which pin the pointer holds; a ref so fast move/up events never see stale state
  const held = useRef<string | null>(null);

  const positionOf = (pin: BoardPin, e: PointerEvent<HTMLButtonElement>): BoardPin => {
    const board = e.currentTarget.closest<HTMLElement>("[data-board]");
    if (!board) return pin;
    const r = board.getBoundingClientRect();
    const band = (v: number) => clamp01((v * 100 - INSET) / (100 - 2 * INSET));
    return { ...pin, control: band((e.clientX - r.left) / r.width), memory: band((e.clientY - r.top) / r.height) };
  };

  const release = (pin: BoardPin, e: PointerEvent<HTMLButtonElement>) => {
    if (held.current !== pin.key) return;
    held.current = null;
    setDrag(null);
    save.mutate(positionOf(pin, e));
  };

  const nudge = (pin: BoardPin, e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    const base = drag?.key === pin.key ? drag : pin;
    setDrag({ ...base, control: clamp01(base.control + m[0]), memory: clamp01(base.memory + m[1]) });
  };

  const commit = () => {
    if (drag) save.mutate(drag);
    setDrag(null);
  };

  const addPin = () => {
    const label = draft.trim();
    const key = slugify(label);
    if (!key) return;
    save.mutate({ key, label, control: 0.5, memory: 0.5 });
    setDraft("");
  };

  return (
    <WidgetFrame
      title="Place every tool on the axis"
      hint="Drag the lenses (or focus one and use arrow keys). Positions are saved."
      actions={
        <Button size="sm" tone="ghost" icon={<RotateCcw className="size-3.5" />} onClick={() => reset.mutate()}>
          Reset
        </Button>
      }
    >
      <div className="relative pl-7 pb-7">
        {/* axis labels */}
        <div className="absolute bottom-0 left-7 right-0 flex justify-between font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute">
          <span>← you own control flow</span>
          <span>model owns it →</span>
        </div>
        <span className="absolute left-0 top-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute [writing-mode:vertical-rl] rotate-180">
          readable memory you edit ↑
        </span>
        <span className="absolute bottom-7 left-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute [writing-mode:vertical-rl] rotate-180">
          ↓ extracted, opaque
        </span>
        <div
          data-board
          className="grid-lines relative aspect-[16/11] w-full touch-none overflow-hidden rounded-3xl border border-line bg-sunken sm:aspect-[16/9]"
          style={{ backgroundSize: "32px 32px" }}
        >
          {/* thesis quadrant glow */}
          <div className="absolute left-0 top-0 h-1/2 w-1/2 bg-[radial-gradient(circle_at_30%_30%,rgb(0_114_178/0.28),transparent_70%)]" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-ink/20" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-ink/20" />
          <QuadrantLabel className="left-4 top-3 text-accent">Workflow thesis · human owns both</QuadrantLabel>
          <QuadrantLabel className="right-4 top-3 text-right">Model drives, you keep the notes</QuadrantLabel>
          <QuadrantLabel className="bottom-3 left-4">You drive, system remembers</QuadrantLabel>
          <QuadrantLabel className="bottom-3 right-4 text-right text-accent">Agent quadrant</QuadrantLabel>
          {/* big faint words for the lenses to bend */}
          <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-display text-[13vw] font-semibold leading-none text-ink/[0.05] sm:text-[8vw]">
            agency
          </div>

          {pins.map((pin, i) => {
            const p = drag?.key === pin.key ? drag : pin;
            const hue = PIN_HUES[i % PIN_HUES.length]!;
            return (
              <button
                key={pin.key}
                type="button"
                aria-label={`${pin.label}: control ${Math.round(p.control * 100)}%, memory ${Math.round(p.memory * 100)}%`}
                className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing"
                style={{ left: at(p.control), top: at(p.memory), zIndex: drag?.key === pin.key ? 20 : 10 }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  held.current = pin.key;
                  setDrag(positionOf(pin, e));
                }}
                onPointerMove={(e) => {
                  if (held.current === pin.key) setDrag(positionOf(pin, e));
                }}
                onPointerUp={(e) => release(pin, e)}
                onPointerCancel={() => {
                  held.current = null;
                  setDrag(null);
                }}
                onKeyDown={(e) => nudge(pin, e)}
                onKeyUp={(e) => {
                  if (e.key.startsWith("Arrow")) commit();
                }}
              >
                <LiquidGlass
                  radius={999}
                  bezel={24}
                  refraction={22}
                  frost={0}
                  tint={`radial-gradient(circle at 50% 120%, ${hue}55, transparent 60%)`}
                  className="size-[68px] transition-transform duration-300 ease-spring group-hover:scale-110 group-active:scale-125"
                />
                <span
                  className={`pointer-events-none absolute left-1/2 -translate-x-1/2 ${p.memory > 0.7 ? "bottom-full mb-1.5" : "top-full mt-1.5"} whitespace-nowrap rounded-full border border-line bg-canvas/70 px-2.5 py-0.5 text-[11.5px] font-medium backdrop-blur-md`}
                  style={{ color: hue }}
                >
                  {pin.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <form
        className="mt-4 flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addPin();
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={48}
          placeholder="Add a tool (e.g. Cursor)"
          className="h-10 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-sm outline-none placeholder:text-mute/60 focus:border-accent/50"
        />
        <Button type="submit" size="sm" icon={<Plus className="size-3.5" />} disabled={!slugify(draft)}>
          Add
        </Button>
        {save.isError ? <span className="text-[12px] text-warn">{save.error.message}</span> : null}
      </form>
    </WidgetFrame>
  );
}

function QuadrantLabel({ className, children }: { className?: string; children: string }) {
  return (
    <span className={`pointer-events-none absolute max-w-[45%] font-mono text-[10px] uppercase leading-tight tracking-[0.12em] text-mute sm:text-[11px] ${className ?? ""}`}>
      {children}
    </span>
  );
}
