import { lazy, Suspense, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ASK, HABITS, HANDS, LEARNING, NAMED, NOW, PROMPT, ROT, SESSIONS, TAGLINE, WORDS, YESMAN, type ScreenId } from "@/content/intro";
import { cn } from "@/utils/cn";
import { Flat } from "./Flat";

// three.js is ~1 MB: load it only for the one beat that uses it, and never for reduced-motion visitors
const World = lazy(() => import("./World").then((m) => ({ default: m.World })));

const EASE = [0.23, 1, 0.32, 1] as const;

/* Projector sizes: evidence ≥ ~22px at 1080p, numbers ≥ 64px. One card style, flat, never tilted. */
const CARD = "rounded-panel bg-surface p-6 ring-1 ring-line shadow-[0_1px_2px_rgb(22_24_29/0.06),0_18px_40px_-24px_rgb(22_24_29/0.3)] lg:p-8";
const TEXT = "text-[clamp(1.15rem,1.5vw,1.75rem)] leading-snug";
const SMALL = "text-[clamp(1rem,1.05vw,1.25rem)] leading-snug text-mute";
const BIG = "font-display font-semibold leading-none tracking-[-0.03em] tabular-nums";

export function Panel({ id }: { id: ScreenId }) {
  switch (id) {
    case "hook":
      return <Sessions />;
    case "reads":
      return <Reads />;
    case "rot-ask":
    case "yes-ask":
    case "learn-ask":
      return <Ask id={id} />;
    case "rot":
      return <Rot />;
    case "yes":
      return <YesMan />;
    case "learn":
      return <Learn />;
    case "close":
      return <Close />;
  }
}

function Source({ text, href }: { text: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cn(SMALL, "mt-5 flex items-start gap-1.5 hover:text-ink")}>
      <span>{text}</span>
      <ArrowUpRight className="mt-1 size-4 shrink-0" aria-hidden />
    </a>
  );
}

/** "What we do now", plus the exact thing typed into Claude Code. */
function Practice({ lead, typed }: { lead: string; typed?: string }) {
  return (
    <div className="mt-6">
      <p className={TEXT}>
        <span className="font-medium text-accent">{NOW}</span>
        {lead}
      </p>
      {typed ? <Bubble className="mt-3">{typed}</Bubble> : null}
    </div>
  );
}

function Bubble({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("w-fit max-w-full rounded-[18px] rounded-br-[6px] bg-ink px-5 py-3 text-canvas", TEXT, className)}>{children}</div>;
}

/* ------------------------------------------------------------------ hook / close */

/** Two sessions, one prompt. Answers hidden on the opening screen; shown at the close. */
function Sessions({ answered = false }: { answered?: boolean }) {
  return (
    <div>
      <p className={SMALL}>{SESSIONS.lead}</p>
      <Bubble className="mt-2">{PROMPT}</Bubble>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {([SESSIONS.known, SESSIONS.fresh] as const).map((s, i) => (
          <div key={s.name} className={cn(CARD, "flex flex-col gap-3 !p-5")}>
            <p className={cn(TEXT, "font-medium", i === 0 && "text-accent")}>{s.name}</p>
            <div className={cn("rounded-control px-4 py-3", answered ? "bg-sunken" : "border border-dashed border-line-strong")}>
              <p className={cn(TEXT, answered ? "" : "font-display text-[2rem] leading-none text-mute")}>{answered ? s.answer : "?"}</p>
            </div>
          </div>
        ))}
      </div>
      {answered ? null : <p className={cn(SMALL, "mt-4")}>{SESSIONS.hidden}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ reads */

function Reads() {
  const reduce = useReducedMotion();
  return (
    <div className="h-[clamp(320px,68svh,760px)] w-full">
      {reduce ? (
        <Flat />
      ) : (
        <Suspense fallback={null}>
          <World />
        </Suspense>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ ask */

/** A question screen: options said aloud, hands counted. Nothing to click, so a clicker can run the talk. */
function Ask({ id }: { id: keyof typeof ASK }) {
  return (
    <div className={CARD}>
      {id === "yes-ask" ? (
        <div className="mb-6 border-b border-line pb-6">
          <blockquote className="font-display text-[clamp(1.3rem,1.7vw,1.8rem)] leading-snug tracking-tight">“{YESMAN.rationale}”</blockquote>
          <p className={cn(SMALL, "mt-4")}>{YESMAN.promptLead}</p>
          <Bubble className="mt-2">{PROMPT}</Bubble>
        </div>
      ) : null}
      <p className={cn(SMALL, "font-medium")}>{HANDS}</p>
      <ol className="mt-3 flex flex-wrap gap-3">
        {ASK[id].map((o) => (
          <li key={o} className={cn("rounded-full border border-line-strong px-5 py-2.5 font-medium", TEXT)}>
            {o}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ reveal */

/** The one earned word: the plain description has been shown; now it gets its name, decoded into place. */
function Reveal({ word }: { word: (typeof WORDS)[number]["word"] }) {
  const w = WORDS.find((x) => x.word === word)!;
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? w.word : scrambled(w.word, 0));
  const begin = () => {
    if (reduce) return setShown(w.word);
    // a short decode (after motion-primitives' TextScramble): letters lock in left to right over ~0.9s
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setShown(scrambled(w.word, t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  return (
    <motion.div className="mt-5" onViewportEnter={begin} viewport={{ once: true, amount: 0.8 }}>
      <p className={SMALL}>{NAMED}</p>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-4">
        <span aria-label={w.word} className={cn(BIG, "text-[clamp(2.6rem,4.4vw,4rem)] text-accent")}>
          <span aria-hidden>{shown}</span>
        </span>
        <span className={TEXT}>{w.means}</span>
      </p>
    </motion.div>
  );
}

const GLYPHS = "abcdefghijklmnopqrstuvwxyz";
/** The word with its first `t` share of letters locked and the rest shuffling; spaces stay spaces. */
function scrambled(word: string, t: number) {
  const locked = Math.floor(word.length * t);
  return word
    .split("")
    .map((ch, i) => (i < locked || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
    .join("");
}

/* ------------------------------------------------------------------ test 1 */

function Rot() {
  const [rot] = WORDS;
  return (
    <div className={CARD}>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
        <span className={cn(BIG, "text-[clamp(4rem,7vw,6.5rem)]")}>{ROT.big}</span>
        <span className={TEXT}>{ROT.bigLabel}</span>
      </div>
      <p className={cn(TEXT, "mt-5")}>
        <span className="text-mute">{NAMED} </span>
        <span className="font-display text-[1.4em] font-semibold text-accent">{rot.word}</span>
      </p>
      <Practice lead={ROT.practice} />
      <div className="mt-3 rounded-control bg-sunken p-4 font-mono text-[clamp(0.9rem,1vw,1.05rem)] leading-relaxed">
        <p className="text-mute">{ROT.noteTitle}</p>
        {ROT.note.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
      <p className={cn(SMALL, "mt-4")}>{ROT.caveat}</p>
      <Source text={ROT.source} href={ROT.href} />
    </div>
  );
}

/* ------------------------------------------------------------------ test 2 */

function YesMan() {
  return (
    <div className={CARD}>
      <p className={SMALL}>{YESMAN.rowsLead}</p>
      {/* one grid for all rows, so the bars line up whatever the name lengths */}
      <ul className={cn("mt-3 grid grid-cols-[auto_1fr_4.5rem] items-center gap-x-4 gap-y-2 whitespace-nowrap", TEXT)}>
        {YESMAN.rows.map((r, i) => (
          <li key={r.model} className="contents">
            <span>{r.model}</span>
            {/* the track watches the viewport: a bar at scaleX(0) has no area for the observer to see */}
            <motion.span className="h-3 overflow-hidden rounded-full bg-ink/[0.06]" initial="off" whileInView="on" viewport={{ once: true }}>
              <motion.span
                className="block h-full rounded-full bg-accent"
                style={{ originX: 0 }}
                variants={{ off: { scaleX: 0 }, on: { scaleX: r.more / 50 } }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              />
            </motion.span>
            <span className="text-right tabular-nums text-mute">{r.more ? `+${r.more}%` : "none"}</span>
          </li>
        ))}
      </ul>
      <p className={cn(TEXT, "mt-4")}>{YESMAN.bridge}</p>
      <Reveal word="sycophancy" />
      <Practice lead={`${YESMAN.practice} “${YESMAN.criteria}”`} />
      <Source text={YESMAN.source} href={YESMAN.href} />
    </div>
  );
}

/* ------------------------------------------------------------------ test 3 */

function Learn() {
  return (
    <div className={CARD}>
      <div className="grid grid-cols-2 gap-6">
        <Score value={LEARNING.withAi} label={LEARNING.withAiLabel} />
        <Score value={LEARNING.byHand} label={LEARNING.byHandLabel} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6 border-t border-line pt-5">
        <div>
          <p className={cn(BIG, "text-[clamp(2rem,3vw,2.8rem)]")}>{LEARNING.explain}</p>
          <p className={cn(SMALL, "mt-1")}>{LEARNING.explainLabel}</p>
        </div>
        <div>
          <p className={cn(BIG, "text-[clamp(2rem,3vw,2.8rem)]")}>{LEARNING.delegate}</p>
          <p className={cn(SMALL, "mt-1")}>{LEARNING.delegateLabel}</p>
        </div>
      </div>
      <p className={cn(SMALL, "mt-4")}>{LEARNING.caveat}</p>
      <Practice lead={LEARNING.practice} typed={LEARNING.ask} />
      <Source text={LEARNING.source} href={LEARNING.href} />
    </div>
  );
}

function Score({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className={cn(BIG, "text-[clamp(4rem,7vw,6.5rem)]")}>{value}%</div>
      <div className={cn(SMALL, "mt-1.5")}>
        {LEARNING.scoreLabel}, {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ close */

function Close() {
  return (
    <div className="space-y-5">
      <Sessions answered />
      <ol className={cn(CARD, "!py-4 divide-y divide-line")}>
        {HABITS.map((h) => (
          <li key={h.test} className="flex items-baseline gap-4 py-2.5">
            <span className={cn(SMALL, "w-16 shrink-0")}>{h.test}</span>
            <span className={cn(TEXT, "font-medium")}>{h.habit}</span>
          </li>
        ))}
      </ol>
      <p className="font-display text-[clamp(1.6rem,2.4vw,2.4rem)] text-accent">{TAGLINE}</p>
    </div>
  );
}
