import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import type { WidgetGuide } from "@/content/types";
import { cn } from "@/utils/cn";

/**
 * The same 200k-token context window, two ways. A divider scrubs between them:
 * mouse hover follows the pointer, touch drags, arrow keys step. Built as a
 * comparison slider (two stacked layers, the top one clipped with inset()),
 * so moving the divider only changes one clip-path: no React re-render.
 *
 * Figures are the brief's, arranged into one illustrative session each.
 */
const WINDOW = 200_000;
const CELL = 500; // tokens per cell → 400 cells

type Part = { key: string; label: string; tokens: number; cls: string };

const BLOATED: Part[] = [
  { key: "system", label: "System prompt", tokens: 10_000, cls: "bg-ink/30" },
  { key: "memory", label: "Memory file, 308 lines", tokens: 4_000, cls: "bg-accent" },
  { key: "tools", label: "Tool definitions, 5 servers", tokens: 55_000, cls: "bg-series-b" },
  { key: "history", label: "Earlier tasks still in context", tokens: 70_000, cls: "bg-warn/70" },
];

const TIERED: Part[] = [
  { key: "system", label: "System prompt", tokens: 10_000, cls: "bg-ink/30" },
  { key: "memory", label: "Core file, ~80 lines", tokens: 1_000, cls: "bg-accent" },
  { key: "tools", label: "Tools via search (−85%)", tokens: 8_000, cls: "bg-series-b" },
];

const used = (parts: Part[]) => parts.reduce((a, p) => a + p.tokens, 0);
const k = (n: number) => `${Math.round(n / 1000)}k`;
/** The read-me shown under the hero, like every widget's guide in the topics. */
export const SCRUBBER_GUIDE: WidgetGuide = {
  name: "One context window, two ways",
  shows: "A 200k-token context window. Each square holds 500 tokens; coloured squares are spent before you type your task.",
  try: "Move the divider across the grid, or focus it and use the arrow keys. Left of it: one long session. Right: a tiered one.",
  point: "Same model, same window: the tiered session leaves about three times as much room for the task. That room is decided by you.",
  data: ["illustration"],
};

const DEAD_ZONE = 0.04; // ±4% around the centre snaps to the middle

/** Load sequence: the window fills cell by cell (CSS, see .cell-fill), the counters count down in step, then the divider sweeps. */
const FILL_DELAY = 0.5; // s, matches .cell-fill
const PER_CELL = 0.0035; // s, matches .cell-fill
const fillTime = (parts: Part[]) => (used(parts) / CELL) * PER_CELL + 0.26;

export function ContextScrubber() {
  const pos = useMotionValue(0.5); // divider position: bloated shown left of it, tiered right of it
  const clip = useTransform(pos, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);
  const left = useTransform(pos, (p) => `${p * 100}%`);
  const [ariaNow, setAriaNow] = useState(50);
  useMotionValueEvent(pos, "change", (p) => setAriaNow(Math.round(p * 100)));
  const dragging = useRef(false);
  const played = useRef(false);
  const reduce = useReducedMotion();

  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    pos.set(Math.abs(p - 0.5) < DEAD_ZONE ? 0.5 : p);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const map: Record<string, number> = { ArrowLeft: -step, ArrowRight: step, Home: -1, End: 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    pos.set(Math.min(1, Math.max(0, pos.get() + map[e.key]!))); // keyboard: no animation
  };

  return (
    <motion.figure
      className="select-none"
      onViewportEnter={() => {
        // one orchestrated moment, once: show that the divider moves
        if (played.current || reduce) return;
        played.current = true;
        void animate(pos, [0.5, 0.8, 0.22, 0.5], { duration: 2.4, ease: [0.77, 0, 0.175, 1], delay: FILL_DELAY + fillTime(BLOATED) + 0.2 });
      }}
      viewport={{ once: true, amount: 0.6 }}
    >
      <div className="mb-3 flex items-end justify-between gap-6 text-[14px]">
        {/* the clipped top layer (bloated) is revealed from the left edge to the divider */}
        <Side title="One bloated, long session" parts={BLOATED} align="left" />
        <Side title="Tiered, one task per session" parts={TIERED} align="right" />
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Compare a tiered session with a bloated one"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={ariaNow}
        aria-valuetext={ariaNow > 55 ? "Showing mostly the bloated session" : ariaNow < 45 ? "Showing mostly the tiered session" : "Half and half"}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => {
          if (dragging.current || e.pointerType === "mouse") fromPointer(e);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        className="relative cursor-ew-resize touch-pan-y overflow-hidden rounded-[14px] border border-line bg-surface outline-none focus-visible:ring-4 focus-visible:ring-accent/25"
      >
        {TIERED_GRID}
        <motion.div aria-hidden className="absolute inset-0" style={{ clipPath: clip }}>
          {BLOATED_GRID}
        </motion.div>
        <motion.div aria-hidden className="pointer-events-none absolute inset-y-0 w-0" style={{ left }}>
          <span className="absolute inset-y-0 -left-px w-0.5 bg-ink" />
          <span className="absolute left-1/2 top-1/2 flex h-9 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-[3px] rounded-full border border-line-strong bg-white shadow-[0_1px_2px_rgb(22_24_29/0.2),0_4px_12px_rgb(22_24_29/0.15)]">
            <span className="h-3.5 w-px bg-ink/40" />
            <span className="h-3.5 w-px bg-ink/40" />
          </span>
        </motion.div>
      </div>

      <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-mute">
        {LEGEND.map(([label, cls]) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-[3px]", cls)} />
            {label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] border border-line-strong" />
          Free for the task
        </span>
        <span className="basis-full text-[12px]">Each square is 500 tokens of a 200k window. Figures from the brief, arranged as one illustrative session each.</span>
      </figcaption>
    </motion.figure>
  );
}

function Side({ title, parts, align }: { title: string; parts: Part[]; align: "left" | "right" }) {
  const free = WINDOW - used(parts);
  const reduce = useReducedMotion();
  // counts down from an empty window as the cells fill; rendered from the motion value, no re-renders
  const n = useMotionValue(reduce ? free : WINDOW);
  const shown = useTransform(n, k);
  const started = useRef(false);
  // ref callback, run once: re-renders while scrubbing must not restart the count
  const start = (el: HTMLElement | null) => {
    if (!el || reduce || started.current) return;
    started.current = true;
    void animate(n, free, { duration: fillTime(parts), delay: FILL_DELAY, ease: "linear" });
  };
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <div className="text-mute">{title}</div>
      <div className="font-display text-3xl tabular-nums sm:text-4xl">
        <motion.span ref={start}>{shown}</motion.span> <span className="text-[15px] font-normal text-mute">free for the task</span>
      </div>
    </div>
  );
}

const LEGEND = [
  ["System prompt", "bg-ink/30"],
  ["Memory file", "bg-accent"],
  ["Tool definitions", "bg-series-b"],
  ["Earlier tasks still in context", "bg-warn/70"],
] as const;

/** 400 cells, filled in order by part, the rest empty. Static: only the clip above it moves. */
function Grid({ parts }: { parts: Part[] }) {
  const cells: string[] = [];
  for (const p of parts) for (let i = 0; i < Math.round(p.tokens / CELL); i++) cells.push(p.cls);
  while (cells.length < WINDOW / CELL) cells.push("");
  return (
    <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[3px] bg-surface p-3 sm:grid-cols-[repeat(40,minmax(0,1fr))]">
      {cells.map((cls, i) =>
        cls ? (
          // --i staggers the fill: the window loads in reading order, the way a model receives it
          <span key={i} className={cn("cell-fill aspect-square rounded-[2px]", cls)} style={{ "--i": i } as CSSProperties} />
        ) : (
          <span key={i} className="aspect-square rounded-[2px] border border-line" />
        ),
      )}
    </div>
  );
}

// Hoisted: the same element objects every render, so React never re-renders the 800 cells while scrubbing.
const TIERED_GRID = <Grid parts={TIERED} />;
const BLOATED_GRID = <Grid parts={BLOATED} />;
