import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { WidgetFrame } from "@/ui/Panel";
import { Slider } from "@/ui/Slider";

/** Axis = change in task time with AI. Negative = faster (left), positive = slower (right). */
const MIN = -60;
const MAX = 60;
const pos = (v: number) => `${((Math.max(MIN, Math.min(MAX, v)) - MIN) / (MAX - MIN)) * 100}%`;

/** METR 2025: 16 experienced developers, 246 tasks on their own repos. */
const FELT = 20; // % faster, estimated afterwards
const PREDICTED = 24; // % faster, predicted beforehand
const MEASURED = 19; // % slower
const CI: [number, number] = [2, 39]; // 95% interval, % slower
const MISS = FELT + MEASURED;

const ACCENT = "var(--color-accent)";
const WARN = "var(--color-warn)";
const MUTE = "var(--color-mute)";

export function PerceptionGap() {
  const [feel, setFeel] = useState(FELT);
  const whatIf = feel - MISS; // what you'd measure if your feeling missed by as much as theirs

  return (
    <WidgetFrame title="Feeling vs. stopwatch">
      <Slider label="AI makes me feel faster by" value={feel} min={-20} max={60} onChange={setFeel} format={(v) => `${v > 0 ? "+" : ""}${v}%`} color="#0072b2" />

      <div className="relative mt-12 h-28" aria-hidden>
        <div className="absolute inset-x-0 top-12 h-px bg-ink/20" />
        <div className="absolute top-12 h-3 -translate-y-1/2 rounded-full bg-warn/20" style={{ left: pos(CI[0]), width: `calc(${pos(CI[1])} - ${pos(CI[0])})` }} />
        <div className="absolute top-12 h-8 w-px -translate-y-1/2 bg-ink/30" style={{ left: pos(0) }} />
        <span className="absolute bottom-0 -translate-x-1/2 font-mono text-[10.5px] text-mute" style={{ left: pos(0) }}>
          no change
        </span>
        <Marker at={-FELT} color={MUTE} label="they felt: 20% faster" hollow />
        <Marker at={MEASURED} color={WARN} label="stopwatch: 19% slower" />
        <Marker at={-feel} color={ACCENT} label={`you: ${Math.abs(feel)}% ${feel >= 0 ? "faster" : "slower"}`} up />
        <span className="absolute bottom-0 left-0 font-mono text-[10.5px] text-mute">← faster with AI</span>
        <span className="absolute bottom-0 right-0 font-mono text-[10.5px] text-mute">slower with AI →</span>
      </div>

      <dl className="mt-6 grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-[9rem_1fr]">
        <Row color={ACCENT} term="You">Your guess. It's the only dot you can move.</Row>
        <Row color={MUTE} term="They felt">
          What the 16 developers estimated after finishing. Before starting, they had predicted {PREDICTED}% faster.
        </Row>
        <Row color={WARN} term="Stopwatch">
          What was measured: {MEASURED}% slower with AI. The pale band is the range the true value likely sits in ({CI[0]}–{CI[1]}% slower).
        </Row>
      </dl>

      <div className="mt-6 rounded-[12px] bg-sunken p-4 text-[14px] leading-relaxed">
        <span className="font-medium">What-if, not a prediction:</span> their feeling missed the stopwatch by {MISS} points. If yours misses by the same
        amount, you are really{" "}
        <span className="font-medium tabular-nums">
          {Math.abs(whatIf)}% {whatIf >= 0 ? "faster" : "slower"}
        </span>{" "}
        with AI.
      </div>

      <Link
        to="/experiments"
        search={{ template: "speed-check" }}
        className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
      >
        Get your own stopwatch dot: time 6 real tasks <ArrowRight className="size-4" />
      </Link>
    </WidgetFrame>
  );
}

function Row({ color, term, children }: { color: string; term: string; children: ReactNode }) {
  return (
    <>
      <dt className="flex items-center gap-2 font-medium">
        <span className="size-2.5 rounded-full" style={{ background: color }} />
        {term}
      </dt>
      <dd className="text-mute">{children}</dd>
    </>
  );
}

function Marker({ at, color, label, up, hollow }: { at: number; color: string; label: string; up?: boolean; hollow?: boolean }) {
  return (
    <motion.div className="absolute top-12" animate={{ left: pos(at) }} transition={{ type: "spring", stiffness: 200, damping: 22 }}>
      <span
        className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
        style={hollow ? { borderColor: color, background: "var(--color-surface)" } : { borderColor: "white", background: color }}
      />
      <span
        className={`absolute -translate-x-1/2 whitespace-nowrap rounded-full bg-surface px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-line ${up ? "-top-10" : "top-4"}`}
        style={{ color }}
      >
        {label}
      </span>
    </motion.div>
  );
}
