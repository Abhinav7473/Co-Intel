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

/**
 * Guess first, then reveal. The reader's guess is about the study (what did the stopwatch say?),
 * so moving it answers a real question; the measurement itself is fixed and only appears after.
 */
export function PerceptionGap() {
  const [guess, setGuess] = useState(20); // % faster (negative = slower)
  const [shown, setShown] = useState(false);
  const yourMiss = Math.abs(-guess - MEASURED);

  return (
    <WidgetFrame title="Feeling vs. stopwatch" hint="16 experienced developers, their own projects, early-2025 AI tools.">
      <Slider
        label="My guess: with AI, they were"
        value={guess}
        min={-50}
        max={50}
        onChange={(v) => {
          setGuess(v);
          setShown(false);
        }}
        format={(v) => (v === 0 ? "no different" : `${Math.abs(v)}% ${v > 0 ? "faster" : "slower"}`)}
        color="#0072b2"
      />

      <div className="relative mt-12 h-28" aria-hidden>
        <div className="absolute inset-x-0 top-12 h-px bg-ink/20" />
        {shown ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-12 h-3 -translate-y-1/2 rounded-full bg-warn/20" style={{ left: pos(CI[0]), width: `calc(${pos(CI[1])} - ${pos(CI[0])})` }} />
        ) : null}
        <div className="absolute top-12 h-8 w-px -translate-y-1/2 bg-ink/30" style={{ left: pos(0) }} />
        <span className="absolute bottom-0 -translate-x-1/2 font-mono text-[10.5px] text-mute" style={{ left: pos(0) }}>
          no change
        </span>
        {shown ? (
          <>
            <Marker at={-FELT} color={MUTE} label="they felt: 20% faster" hollow />
            <Marker at={MEASURED} color={WARN} label="stopwatch: 19% slower" />
          </>
        ) : null}
        <Marker at={-guess} color={ACCENT} label={`your guess: ${guess === 0 ? "no change" : `${Math.abs(guess)}% ${guess > 0 ? "faster" : "slower"}`}`} up />
        <span className="absolute bottom-0 left-0 font-mono text-[10.5px] text-mute">← faster with AI</span>
        <span className="absolute bottom-0 right-0 font-mono text-[10.5px] text-mute">slower with AI →</span>
      </div>

      {shown ? (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
          <dl className="mt-6 grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-[9rem_1fr]">
            <Row color={WARN} term="Stopwatch">
              Measured: {MEASURED}% slower with AI. The pale band is the range the true value likely sits in ({CI[0]}–{CI[1]}% slower).
            </Row>
            <Row color={MUTE} term="They felt">
              Afterwards the developers estimated AI had made them {FELT}% faster. Beforehand they had predicted {PREDICTED}%.
            </Row>
            <Row color={ACCENT} term="Your guess">
              {yourMiss} points from the stopwatch. Theirs, about their own work, was {MISS} points off.
            </Row>
          </dl>
          <p className="mt-6 rounded-[12px] bg-sunken p-4 text-[14px] leading-relaxed">
            {guess > 0
              ? "You guessed faster, as they did. That's the point: it feels faster, so we assume it is."
              : "You guessed slower or no change, which beats the developers' own estimate. They were doing the work and still felt faster."}{" "}
            One study of experienced developers on code they knew well; it doesn't say AI slows everyone down.
          </p>
        </motion.div>
      ) : (
        <button
          type="button"
          onClick={() => setShown(true)}
          className="mt-6 inline-flex h-10 items-center rounded-control bg-ink px-4 text-[14px] font-medium text-canvas transition-[background-color,transform] duration-150 hover:bg-ink/85 active:scale-[0.97]"
        >
          Reveal the stopwatch
        </button>
      )}

      <Link
        to="/experiments"
        search={{ template: "speed-check" }}
        className="mt-5 flex w-fit items-center gap-1.5 text-[14px] font-medium text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
      >
        Get your own stopwatch result: time 6 real tasks <ArrowRight className="size-4" />
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
