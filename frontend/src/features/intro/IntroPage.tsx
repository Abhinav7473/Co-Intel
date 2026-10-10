import { motion, useReducedMotion } from "motion/react";
import { BEATS, SCREENS } from "@/content/intro";
import { CONTAINER } from "@/shell/layout";
import { cn } from "@/utils/cn";
import { conduct, goTo, useActiveChapter } from "./conductor";
import { Panel } from "./Panels";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * The junior seminar as a stepped page: one screen per section, snapped on desktop (`[data-snap]` in styles.css), so
 * PageDown, Space or a clicker moves exactly one screen with native scroll. A test is two screens: the question, then
 * the answer. Copy left, evidence right; nothing tilts, nothing waits on a click.
 */
export function IntroPage() {
  const reduce = useReducedMotion() ?? false;
  return (
    <div ref={conduct} data-snap className="relative">
      <Rail reduce={reduce} />
      <main>
        {SCREENS.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            data-chapter
            aria-labelledby={`${s.id}-title`}
            className="flex min-h-svh snap-start items-center"
          >
            <div className={cn(CONTAINER, "grid gap-8 py-24 lg:items-center lg:gap-14 lg:py-20 lg:pr-24", s.id === "reads" ? "lg:grid-cols-[4fr_8fr]" : "lg:grid-cols-[5fr_7fr]")}>
              <div>
                {i === 0 ? (
                  <OpeningTitle id={`${s.id}-title`} text={s.title} reduce={reduce} />
                ) : (
                  <h2 id={`${s.id}-title`} className="font-display text-[clamp(2.2rem,3.8vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.028em]">
                    {s.title}
                  </h2>
                )}
                <p className="mt-6 max-w-[32rem] text-[clamp(1.2rem,1.5vw,1.75rem)] leading-relaxed text-ink/85">{s.body}</p>
              </div>
              <Panel id={s.id} />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

/** The opening title: words come into focus once, on load (the page's one orchestrated moment). */
function OpeningTitle({ id, text, reduce }: { id: string; text: string; reduce: boolean }) {
  const words = text.split(" ");
  return (
    <h1 id={id} aria-label={text} className="font-display text-[clamp(3rem,6vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden
          className="inline-block"
          initial={reduce ? false : { opacity: 0, transform: "translateY(0.25em)", filter: "blur(4px)" }}
          animate={{ opacity: 1, transform: "translateY(0em)", filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: EASE }}
        >
          {w}
          {i < words.length - 1 ? " " : null}
        </motion.span>
      ))}
    </h1>
  );
}

/** Where you are in the talk, one tick per beat (a test's two screens share one), and a way to jump. */
function Rail({ reduce }: { reduce: boolean }) {
  const active = SCREENS[useActiveChapter()]?.beat ?? 0;
  return (
    <nav aria-label="Beats" className="fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
      <ol className="flex flex-col items-end gap-1">
        {BEATS.map((label, b) => {
          const on = b === active;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => goTo(SCREENS.findIndex((s) => s.beat === b), reduce)}
                aria-current={on ? "step" : undefined}
                className="group flex h-7 items-center gap-3 rounded-full pl-3 text-[14px] text-mute hover:text-ink"
              >
                <span
                  className={cn(
                    "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    on ? "translate-x-0 text-ink opacity-100" : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                  )}
                >
                  {label}
                </span>
                <span className={cn("h-px w-8 origin-right rounded-full transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]", on ? "scale-x-100 bg-ink" : "scale-x-50 bg-ink/30 group-hover:bg-ink/60")} />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
