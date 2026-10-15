import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  AGENDA,
  ASK,
  BYLINE,
  CARRY,
  NAMED,
  PARTS,
  PROMPT,
  RECAP,
  REVIEW,
  ROT,
  RULES,
  SCREENS,
  SESSIONS,
  SOURCES,
  STEPS,
  STRIP,
  STRIP_LABEL,
  TOKENS,
  THANKS,
  TOOLS,
  TOOLS_HEAD,
  WEB,
  WORDS,
  type IntroScreen,
  type PartKey,
} from "@/content/intro";
import { STAGE } from "@/shell/layout";
import { cn } from "@/utils/cn";
import { useActiveChapter } from "./conductor";

const EASE = [0.23, 1, 0.32, 1] as const;

/*
 * Editorial poster type: four sizes, each scaled by the smaller of width and height so a screen fits a 1280×720
 * projector as well as 1920×1080. Statement ≈ 127px and body ≈ 33px at 1080p (the poster scale is deliberate: this is
 * read from the back of a room). Mono only for things you type.
 */
const STATEMENT = "font-display font-semibold leading-[0.98] tracking-[-0.03em] text-balance text-[clamp(2.75rem,min(6.6vw,11.8vh),8.5rem)]";
const HEAD = "font-display font-semibold leading-[1.02] tracking-[-0.028em] text-balance text-[clamp(2rem,min(4.2vw,7.4vh),5rem)]";
const BODY = "text-[clamp(1.15rem,min(1.75vw,3.1vh),2.05rem)] leading-[1.35] text-pretty";
const META = "text-[clamp(1rem,min(1vw,1.8vh),1.2rem)] leading-snug text-mute";
const MONO = "font-mono text-[clamp(0.95rem,min(1.4vw,2.5vh),1.65rem)] leading-[1.55]";
/** A typed artifact: sunken, flat, one radius; never a shadowed card. */
const SHEET = "rounded-panel bg-sunken px-[2.2vw] py-[3vh]";

/* ------------------------------------------------------------------ the context strip */

/** Fixed shares of every bar (illustrative). `notes` and `session` come from the screen. */
const FIXED = { own: 0.05, tools: 0.03, message: 0.015 } as const;
const FILL: Record<PartKey, string> = {
  own: "bg-ink/20",
  notes: "bg-ink/60",
  tools: "bg-series-b",
  session: "bg-accent",
  message: "bg-ink",
};
const GROW = "transition-[flex-grow,opacity] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]";

/**
 * One bar of what a message carries, as flex segments that resize smoothly when the values change. `dim` greys the
 * middle of the session (lost in the middle) or the tail of the notes (instructions a long file loses).
 */
function Bar({ notes, session, dim, className }: { notes: number; session: number; dim?: "middle" | "notes-tail"; className?: string }) {
  const share: Record<PartKey, number> = { ...FIXED, notes, session };
  const rest = Math.max(0, 1 - Object.values(share).reduce((a, b) => a + b, 0));
  return (
    <div className={cn("flex gap-[2px] overflow-hidden rounded-[4px]", className)} aria-hidden>
      {PARTS.map((p) => (
        <div key={p.key} className={cn("flex gap-[2px]", GROW)} style={{ flexGrow: share[p.key], flexBasis: 0 }}>
          {/* split a segment only when part of it dims; otherwise one solid block (small splits read as stripes) */}
          {p.key === "session" && dim === "middle" ? (
            [0, 1, 2].map((k) => <span key={k} className={cn("flex-1", FILL.session, GROW, k === 1 && "opacity-25")} />)
          ) : p.key === "notes" && dim === "notes-tail" ? (
            <>
              <span className={cn(FILL.notes, GROW)} style={{ flexGrow: 68, flexBasis: 0 }} />
              <span className={cn(FILL.notes, GROW, "opacity-20")} style={{ flexGrow: 32, flexBasis: 0 }} />
            </>
          ) : (
            <span className={cn("flex-1", FILL[p.key])} />
          )}
        </div>
      ))}
      <div className={cn("bg-ink/[0.06]", GROW)} style={{ flexGrow: rest, flexBasis: 0 }} />
    </div>
  );
}

/** Pinned to the bottom of every screen: the talk as one session that grows, rots, and starts fresh. Also progress. */
export function Strip() {
  const i = useActiveChapter();
  const s = SCREENS[i] ?? SCREENS[0]!;
  const v = STRIP[s.id];
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface">
      <div className={cn(STAGE, "py-[1.4vh]")}>
        <div className={cn(META, "mb-[0.8vh] flex justify-between gap-4 whitespace-nowrap tabular-nums")}>
          <span className="truncate">
            <span className="max-sm:hidden">{STRIP_LABEL} · </span>
            <span className="text-ink">{s.beat}</span>
          </span>
          <span>
            {i + 1} / {SCREENS.length}
          </span>
        </div>
        <Bar notes={v.notes} session={v.session} dim={v.dim} className="h-[clamp(12px,2.2vh,24px)]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ screens */

export function Screen({ s, i }: { s: IntroScreen; i: number }) {
  const Title = i === 0 ? "h1" : "h2";
  const id = `${s.id}-title`;
  switch (s.kind) {
    case "title":
      return <TitleScreen s={s} Title={Title} id={id} />;
    case "tokens":
      return <Tokens s={s} id={id} />;
    case "recap":
      return <Recap s={s} id={id} />;
    case "split":
      return <Split s={s} Title={Title} id={id} />;
    case "diagram":
      return <Diagram s={s} id={id} />;
    case "list":
      return <Toolkit s={s} id={id} />;
    case "ask":
      return <Ask s={s} id={id} />;
    case "answer":
      return <Answer s={s} id={id} />;
    case "do":
      return <Do s={s} id={id} />;
    case "steps":
      return <Steps s={s} id={id} />;
  }
}

function Copy({ s, id, className }: { s: IntroScreen; id: string; className?: string }) {
  return (
    <div className={className}>
      <h2 id={id} className={HEAD}>
        {s.title}
      </h2>
      {s.finding ? <p className={cn(BODY, "mt-[3vh] max-w-[38ch] text-ink/85")}>{s.finding}</p> : null}
    </div>
  );
}

/** Sources, one line, pinned above the strip: there for anyone checking, out of the way of the room. */
export function Sources({ id }: { id: IntroScreen["id"] }) {
  const list = SOURCES[id];
  if (!list) return null;
  return (
    <p className={cn(META, "absolute bottom-[calc(var(--strip)+1.6vh)] left-[6vw] right-[6vw]")}>
      {list.map((x, k) => (
        <span key={x.href}>
          {k ? " · " : null}
          <a href={x.href} target="_blank" rel="noreferrer" className="underline decoration-line-strong underline-offset-4 hover:text-ink">
            {x.text}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </span>
      ))}
    </p>
  );
}

/* split: the opening, and the close that mirrors it with the answers filled in */
function Split({ s, Title, id }: { s: IntroScreen; Title: "h1" | "h2"; id: string }) {
  const reduce = useReducedMotion();
  const answered = s.id === "close";
  const words = s.title.split(" ");
  return (
    <div className="grid items-center gap-[6vh] lg:grid-cols-12 lg:gap-x-[4vw]">
      <div className="lg:col-span-6">
        <Title id={id} aria-label={s.title} className={STATEMENT}>
          {words.map((w, k) => (
            <motion.span
              key={`${w}-${k}`}
              aria-hidden
              className="inline-block"
              initial={reduce || answered ? false : { opacity: 0, transform: "translateY(0.2em)", filter: "blur(4px)" }}
              animate={{ opacity: 1, transform: "translateY(0em)", filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15 + k * 0.06, ease: EASE }}
            >
              {w}
              {k < words.length - 1 ? " " : null}
            </motion.span>
          ))}
        </Title>
      </div>
      <div className="lg:col-span-6">
        <p className={META}>{SESSIONS.lead}</p>
        <p className={cn(MONO, "mt-[1vh] rounded-panel bg-ink px-[2vw] py-[2.4vh] text-canvas")}>{PROMPT}</p>
        <div className="mt-[4vh] grid grid-cols-2 gap-[3vw]">
          {[
            { ...SESSIONS.known, bar: { notes: 0.07, session: 0.66 } },
            { ...SESSIONS.fresh, bar: { notes: 0.07, session: 0.03 } },
          ].map((x) => (
            <div key={x.name}>
              <p className={cn(BODY, "font-medium")}>{x.name}</p>
              <Bar notes={x.bar.notes} session={x.bar.session} className="mt-[1.6vh] h-[clamp(12px,2vh,22px)]" />
              {answered ? <p className={cn(BODY, "mt-[1.6vh] text-ink/85")}>{x.answer}</p> : null}
            </div>
          ))}
        </div>
        {answered ? <p className={cn(HEAD, "mt-[6vh]")}>{THANKS}</p> : null}
      </div>
    </div>
  );
}

/* diagram: what every message carries, at message 1, 10 and 40 */
function Diagram({ s, id }: { s: IntroScreen; id: string }) {
  return (
    <div>
      <h2 id={id} className={HEAD}>
        {s.title}
      </h2>
      {/* one grid for all rows, so every bar starts at the same x */}
      <ul className="mt-[6vh] grid grid-cols-[auto_1fr] items-center gap-x-[2vw] gap-y-[2.2vh]">
        {CARRY.rows.map((r) => (
          <li key={r.label} className="contents">
            <span className={cn(BODY, "whitespace-nowrap text-mute")}>{r.label}</span>
            <Bar notes={0.06} session={r.session} className="h-[clamp(32px,6.5vh,72px)]" />
          </li>
        ))}
      </ul>
      <ul className="mt-[5vh] grid grid-cols-2 gap-x-[3vw] gap-y-[2vh] lg:grid-cols-5">
        {PARTS.map((p) => (
          <li key={p.key} className="flex items-start gap-[0.8vw]">
            <span className={cn("mt-[0.5em] size-[clamp(12px,1.6vh,18px)] shrink-0 rounded-[3px]", FILL[p.key])} />
            <span>
              <span className={cn(BODY, "block font-medium", p.key === "session" && "text-accent")}>{p.name}</span>
              <span className={cn(META, "block")}>{p.loads}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className={cn(BODY, "mt-[5vh]")}>
        <span className="font-mono font-medium">{CARRY.see}</span> <span className="text-mute">· {CARRY.note}</span>
      </p>
    </div>
  );
}

/* list: the six tools as a ruled table across the full width */
function Toolkit({ s, id }: { s: IntroScreen; id: string }) {
  const cell = "text-[clamp(1.05rem,min(1.45vw,2.6vh),1.7rem)] leading-[1.3]";
  return (
    <div>
      <h2 id={id} className={HEAD}>
        {s.title}
      </h2>
      <table className={cn("mt-[5vh] w-full text-left", cell)}>
        <thead className={META}>
          <tr className="border-b border-line-strong">
            <th className="w-[20%] pb-[1.2vh] pr-[2vw] font-normal">{TOOLS_HEAD.name}</th>
            <th className="w-[30%] pb-[1.2vh] pr-[2vw] font-normal">{TOOLS_HEAD.is}</th>
            <th className="pb-[1.2vh] pr-[2vw] font-normal">{TOOLS_HEAD.when}</th>
            <th className="w-[9%] pb-[1.2vh] font-normal">{TOOLS_HEAD.web}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {TOOLS.map((t) => (
            <tr key={t.name} className="align-baseline">
              <th scope="row" className="py-[1.5vh] pr-[2vw] text-left font-semibold">
                {t.name}
              </th>
              <td className="py-[1.5vh] pr-[2vw] text-ink/80">{t.is}</td>
              <td className="py-[1.5vh] pr-[2vw]">{t.when}</td>
              <td className={cn("py-[1.5vh] font-medium", t.web ? "text-ink/80" : "text-warn")}>{t.web ? WEB.yes : WEB.no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ask: the question, poster size; the options as bare numerals, so nobody mistakes them for buttons */
function Ask({ s, id }: { s: IntroScreen; id: string }) {
  const options = ASK[s.id as keyof typeof ASK];
  return (
    <div>
      <h2 id={id} className={cn(STATEMENT, "max-w-[16ch]")}>
        {s.title}
      </h2>
      {s.setup ? <p className={cn(BODY, "mt-[3vh] max-w-[60ch] text-mute")}>{s.setup}</p> : null}
      <div className="mt-[7vh] flex flex-wrap items-baseline gap-x-[6vw] gap-y-[2vh]">
        <ol className="contents">
          {options.map((o) => (
            <li key={o} className={cn(HEAD, "tabular-nums")}>
              {o}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** The answer (a number, or "The short part") set in warn; the rest of the line in ink. */
function emphasise(title: string): ReactNode {
  const m = title.match(/\d+%|The short part/);
  if (!m || m.index === undefined) return title;
  return (
    <>
      {title.slice(0, m.index)}
      <span className="text-warn">{m[0]}</span>
      {title.slice(m.index + m[0].length)}
    </>
  );
}

/* answer: the finding as a sentence, poster size; one supporting element at most */
function Answer({ s, id }: { s: IntroScreen; id: string }) {
  return (
    <div>
      <h2 id={id} className={cn(STATEMENT, "max-w-[18ch]")}>
        {emphasise(s.title)}
      </h2>
      {s.finding ? <p className={cn(BODY, "mt-[3vh] max-w-[46ch] text-ink/85")}>{s.finding}</p> : null}
      {s.id === "rot" ? <Reveal word="context rot" className="mt-[4vh]" /> : null}
      {s.id === "review" ? (
        <div className="mt-[4vh] grid gap-[4vh] lg:grid-cols-12 lg:items-end lg:gap-x-[4vw]">
          <Rows className="lg:col-span-7" />
          <Reveal word="sycophancy" className="lg:col-span-5" />
        </div>
      ) : null}
    </div>
  );
}

/** The CHI 2026 result per model; bars grow once when the list comes into view. */
function Rows({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className={META}>{REVIEW.rowsLead}</p>
      <motion.ul
        className={cn(BODY, "mt-[1.6vh] grid grid-cols-[auto_1fr_auto] items-center gap-x-[1.6vw] gap-y-[1.2vh] whitespace-nowrap")}
        initial="off"
        whileInView="on"
        viewport={{ once: true }}
      >
        {REVIEW.rows.map((r, k) => (
          <li key={r.model} className="contents">
            <span>{r.model}</span>
            <span className="h-[clamp(10px,1.6vh,16px)] overflow-hidden rounded-[3px] bg-ink/[0.1]">
              <motion.span
                className="block h-full bg-accent"
                style={{ originX: 0 }}
                variants={{ off: { scaleX: 0 }, on: { scaleX: r.more / 50 } }}
                transition={{ duration: 0.7, delay: k * 0.06, ease: EASE }}
              />
            </span>
            <span className="text-right tabular-nums text-ink/80">{r.more ? `+${r.more}%` : REVIEW.zero}</span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

/**
 * An earned word: its letters keep shuffling while the screen is up, until the presenter clicks it; then they lock in
 * left to right (after motion-primitives' TextScramble). The button drops focus, so Space and PageDown keep scrolling.
 */
function Reveal({ word, className }: { word: (typeof WORDS)[number]["word"]; className?: string }) {
  const w = WORDS.find((x) => x.word === word)!;
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? w.word : scrambled(w.word, 0));
  const revealed = useRef(Boolean(reduce));
  // shuffle on a timer while mounted and not yet revealed; React 19 runs the returned cleanup on unmount
  const shuffle = (el: HTMLButtonElement | null) => {
    if (!el || revealed.current) return;
    const timer = setInterval(() => !revealed.current && setShown(scrambled(w.word, 0)), 70);
    return () => clearInterval(timer);
  };
  const reveal = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    if (revealed.current) return;
    revealed.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setShown(scrambled(w.word, t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  return (
    <div className={className}>
      <p className={META}>{NAMED}</p>
      <button ref={shuffle} type="button" onClick={reveal} className={cn(HEAD, "mt-[0.6vh] cursor-pointer text-left text-accent")}>
        <span className="sr-only">{w.word}</span>
        <span aria-hidden>{shown}</span>
      </button>
    </div>
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

/* title: the talk's name, the class, and the five parts */
function TitleScreen({ s, Title, id }: { s: IntroScreen; Title: "h1" | "h2"; id: string }) {
  return (
    <div>
      <p className={META}>{BYLINE}</p>
      <Title id={id} className={cn(STATEMENT, "mt-[2vh] max-w-[12ch]")}>
        {s.title}
      </Title>
      <ol className={cn(BODY, "mt-[6vh] flex flex-wrap gap-x-[3vw] gap-y-[1.2vh] text-ink/85")}>
        {AGENDA.map((a, k) => (
          <li key={a} className="flex gap-[0.6vw]">
            <span className="tabular-nums text-mute">{k + 1}</span>
            <span>{a}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** One run of text as its tokens: each a tinted chip, alternating, so the boundaries show. */
function Chips({ parts, size }: { parts: readonly string[]; size: string }) {
  return (
    <div>
      <p className={cn(size, "flex flex-wrap gap-y-[1vh]")}>
        {parts.map((x, k) => (
          <span key={k} className={cn("whitespace-pre rounded-[6px] px-[0.08em]", k % 2 ? "bg-series-b/25" : "bg-accent/15")}>
            {x}
          </span>
        ))}
      </p>
      <p className={cn(META, "mt-[1vh] tabular-nums")}>
        {parts.length} {TOKENS.unit}
      </p>
    </div>
  );
}

/* tokens: a sentence and two long words, split the way a model reads them */
function Tokens({ s, id }: { s: IntroScreen; id: string }) {
  return (
    <div>
      <h2 id={id} className={HEAD}>
        {s.title}
      </h2>
      <div className="mt-[6vh] space-y-[5vh]">
        <Chips parts={TOKENS.sentence} size={cn(HEAD, "font-sans font-medium tracking-normal")} />
        <div className="grid gap-[3vh] lg:grid-cols-2 lg:gap-x-[4vw]">
          {TOKENS.words.map((w) => (
            <Chips key={w.join("")} parts={w} size={cn(HEAD, "font-sans font-medium tracking-normal")} />
          ))}
        </div>
      </div>
      <p className={cn(META, "mt-[5vh]")}>{TOKENS.note}</p>
    </div>
  );
}

/* recap: the conclusion, each part of the talk in one ruled line */
function Recap({ s, id }: { s: IntroScreen; id: string }) {
  return (
    <div>
      <Copy s={s} id={id} />
      <dl className="mt-[5vh] divide-y divide-line border-y border-line">
        {RECAP.map((r) => (
          <div key={r.part} className="grid gap-[1vh] py-[2.2vh] lg:grid-cols-12 lg:gap-x-[4vw]">
            <dt className={cn(BODY, "font-semibold lg:col-span-4", WORDS.some((w) => w.word === r.part) && "font-display text-accent")}>{r.part}</dt>
            <dd className={cn(BODY, "text-ink/85 lg:col-span-8")}>{r.line}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* do: the habit on the left, the exact thing you type on the right, large enough to photograph */
function Do({ s, id }: { s: IntroScreen; id: string }) {
  return (
    <div className="grid items-center gap-[5vh] lg:grid-cols-12 lg:gap-x-[4vw]">
      <Copy s={s} id={id} className="lg:col-span-5" />
      <div className="space-y-[3vh] lg:col-span-7">
        {s.id === "rot-do" ? (
          <>
            <Sheet title={ROT.noteTitle} lines={ROT.note} />
            <Sheet title={ROT.compactTitle} lines={[ROT.compact]} />
          </>
        ) : null}
        {s.id === "rules-do" ? <Sheet title={RULES.fileTitle} lines={RULES.file} /> : null}
        {s.id === "review-do" ? <Sheet title={REVIEW.criteriaTitle} lines={[REVIEW.criteria]} /> : null}
      </div>
    </div>
  );
}

function Sheet({ title, lines }: { title: string; lines: readonly string[] }) {
  return (
    <figure>
      <figcaption className={META}>{title}</figcaption>
      <div className={cn(SHEET, MONO, "mt-[1vh]")}>
        {lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
    </figure>
  );
}

/* steps: tonight's three moves, a sequence, so numbered */
function Steps({ s, id }: { s: IntroScreen; id: string }) {
  return (
    <div>
      <Copy s={s} id={id} />
      <ol className="mt-[7vh] grid gap-[5vh] lg:grid-cols-3 lg:gap-x-[4vw]">
        {STEPS.map((x, k) => (
          <li key={x.step} className="border-t border-line-strong pt-[2.4vh]">
            <span className={cn(HEAD, "tabular-nums")}>{k + 1}</span>
            <p className={cn(BODY, "mt-[1.6vh] font-semibold")}>{x.step}</p>
            <p className={cn(BODY, "mt-[0.6vh] text-ink/85")}>{x.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
