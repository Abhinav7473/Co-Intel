import { useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { DATA_KINDS } from "@/content/outline";
import type { Line, Slide, Transition, WidgetGuide } from "@/content/types";
import { WIDGETS } from "@/features/widgets";
import { Panel } from "@/ui/Panel";
import { SourceCards } from "@/ui/SourceCards";
import { cn } from "@/utils/cn";
import { renderInline } from "@/utils/inline";
import { ITEM, STAGGER_PARENT } from "./reveal";

/**
 * A sub-scene inside a topic page.
 *
 * Two layers of motion:
 * 1. The envelope is scroll-linked (Motion `useScroll` + `useTransform`): it moves
 *    with the scroll position in both directions, with a different shape per kind.
 * 2. The content inside staggers in once (lines, columns) when it first enters.
 */
/** Scenes already scrolled to from a #hash link, so a re-render never jumps the reader back. */
const jumped = new WeakSet<HTMLElement>();

export function Scene({ slide }: { slide: Slide }) {
  const ref = useRef<HTMLElement>(null);
  // Site-map and outline links carry #scene-id. The router's hash scroll can run before
  // the scene exists, so the scene brings itself into view once, when it mounts.
  const attach = (el: HTMLElement | null) => {
    ref.current = el;
    if (!el || jumped.has(el) || window.location.hash !== `#${slide.id}`) return;
    jumped.add(el);
    requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
  };
  // 0 when the scene's top enters the viewport, 1 when it reaches 40% from the top.
  // Entry only: content you are reading never fades or drifts on its way out.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.4"] });
  const envelope = useEnvelope(slide.transition ?? "rise", scrollYProgress);
  const style = useReducedMotion() ? undefined : envelope;

  return (
    <motion.article
      ref={attach}
      id={slide.id}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      className="flex min-h-[80svh] snap-start flex-col justify-center py-16"
    >
      <motion.div style={style}>
        <motion.div variants={STAGGER_PARENT}>
          <SceneBody slide={slide} />
        </motion.div>
        <Details slide={slide} />
      </motion.div>
    </motion.article>
  );
}

/** Entry progress 0 → 1 drives a different shape per scene kind; at 1 everything is at rest. */
function useEnvelope(kind: Transition, p: MotionValue<number>): MotionStyle {
  const opacity = useTransform(p, [0, 0.6], [0, 1]);
  const y = useTransform(p, [0, 1], kind === "rise" ? [90, 0] : [28, 0]);
  const x = useTransform(p, [0, 1], kind === "push" ? [110, 0] : [0, 0]);
  const scale = useTransform(p, [0, 1], kind === "zoom" ? [0.84, 1] : [1, 1]);
  const blur = useTransform(p, [0, 0.8], kind === "zoom" || kind === "rise" ? [10, 0] : [0, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const reveal = useTransform(p, [0, 0.85], [100, 0]);
  const clipPath = useTransform(reveal, (r) =>
    kind === "wipe" ? `inset(0% ${r}% 0% 0%)` : kind === "iris" ? `circle(${150 - r * 1.5}% at 10% 50%)` : "none",
  );
  return { opacity, y, x, scale, filter, clipPath };
}

function SceneBody({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "statement":
      return (
        <>
          <Heading>{slide.heading}</Heading>
          <FineLines lines={slide.lines} />
        </>
      );
    case "stat":
      return (
        <>
          {/* study → number → what it counts → what it means: never a bare number */}
          <motion.p variants={ITEM} className="mb-6 max-w-2xl text-lg leading-relaxed text-ink/70">
            {slide.study}
          </motion.p>
          <motion.div variants={ITEM} className="text-gradient font-display text-[clamp(4rem,10vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
            {slide.value}
          </motion.div>
          <motion.p variants={ITEM} className="mt-4 max-w-3xl text-[clamp(1.2rem,2vw,1.6rem)] leading-snug">
            {slide.label}
          </motion.p>
          <motion.p variants={ITEM} className="mt-5 max-w-2xl border-l-2 border-accent pl-4 text-lg leading-relaxed">
            {slide.meaning}
          </motion.p>
          <motion.div variants={ITEM} className="mt-8 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
            <span className="h-px w-10 bg-accent" />
            {slide.source}
          </motion.div>
        </>
      );
    case "compare":
      return (
        <>
          {slide.heading ? <Heading small>{slide.heading}</Heading> : null}
          <div className={cn("mt-10 grid gap-4", slide.columns.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
            {slide.columns.map((c) => (
              <motion.div key={c.title} variants={ITEM}>
                <Panel className={cn("h-full p-7", c.emphasis && "border-accent/50 ring-1 ring-accent/30")}>
                  <div className={cn("mb-5 h-0.5 w-10 rounded-full", c.emphasis ? "bg-accent" : "bg-ink/20")} />
                  <h3 className="font-display text-3xl tracking-tight">{c.title}</h3>
                  <div className="mt-4 space-y-1.5">
                    {c.lines.map((l) => (
                      <p key={l} className="text-lg text-ink/75">
                        {l}
                      </p>
                    ))}
                  </div>
                </Panel>
              </motion.div>
            ))}
          </div>
        </>
      );
    case "list":
      return (
        <>
          <Heading small>{slide.heading}</Heading>
          <FineLines lines={slide.lines} numbered={slide.numbered} ruled />
        </>
      );
    case "widget": {
      const Widget = WIDGETS[slide.widget];
      return (
        <>
          <Guide guide={slide.guide} />
          <motion.div variants={ITEM}>
            <Widget />
          </motion.div>
        </>
      );
    }
    default:
      return null; // title / chapter / end are rendered by the pages themselves
  }
}

/** Read-me above every widget: what it shows, what to do, why it matters, and where its numbers come from. */
function Guide({ guide }: { guide: WidgetGuide }) {
  const rows = [
    ["What you're looking at", guide.shows],
    ["Try", guide.try],
    ["The point", guide.point],
  ] as const;
  return (
    <motion.div variants={ITEM} className="mb-6">
      <dl className="grid gap-x-6 gap-y-4 md:grid-cols-3">
        {rows.map(([k, v], i) => (
          <div key={k} className={cn("border-t-2 pt-3", i === 2 ? "border-accent" : "border-line")}>
            <dt className={cn("mb-1 font-mono text-[11px] uppercase tracking-[0.12em]", i === 2 ? "text-accent" : "text-mute")}>{k}</dt>
            <dd className={cn("text-[15px] leading-relaxed", i === 2 ? "text-ink" : "text-ink/80")}>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {guide.data.map((d) => (
          <span key={d} className="rounded-full bg-sunken px-3 py-1 text-[12.5px] text-ink/80">
            <span className="font-medium text-ink">{DATA_KINDS[d].label}</span> · {DATA_KINDS[d].means}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function Heading({ children, small }: { children: string; small?: boolean }) {
  return (
    <motion.h2
      variants={ITEM}
      className={cn(
        "max-w-4xl font-display font-medium leading-[1.04] tracking-[-0.03em]",
        small ? "text-[clamp(2rem,3.8vw,3.2rem)]" : "text-[clamp(2.4rem,4.8vw,4.25rem)]",
      )}
    >
      {children}
    </motion.h2>
  );
}

/** Fine lines: light weight, one hairline each, staggered in. Lines with `more` open on click. */
function FineLines({ lines, numbered, ruled }: { lines: Line[]; numbered?: boolean; ruled?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ol className={cn("mt-10 max-w-3xl", ruled ? "divide-y divide-line border-y border-line" : "space-y-5")}>
      {lines.map((l, i) => {
        const expanded = open === i;
        return (
          <motion.li key={l.text} variants={ITEM} className={cn(ruled && "py-4")}>
            <button
              type="button"
              disabled={!l.more}
              onClick={() => setOpen(expanded ? null : i)}
              aria-expanded={l.more ? expanded : undefined}
              className="group flex w-full items-baseline gap-5 text-left disabled:cursor-default"
            >
              {numbered ? (
                <span className="w-7 shrink-0 font-mono text-[13px] tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
              ) : (
                <span className="mb-[0.4em] h-px w-8 shrink-0 self-end bg-accent" />
              )}
              <span className="flex-1 text-[clamp(1.15rem,2vw,1.55rem)] font-light leading-snug text-ink/90">{l.text}</span>
              {l.more ? (
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-mute transition group-hover:border-line-strong group-hover:text-ink",
                    expanded && "rotate-45 border-accent text-accent",
                  )}
                >
                  <Plus className="size-3.5" />
                </span>
              ) : null}
            </button>
            <AnimatePresence initial={false}>
              {expanded && l.more ? (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pl-[3.25rem] text-[15px] leading-relaxed text-mute"
                >
                  <span className="block pt-2">{renderInline(l.more)}</span>
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ol>
  );
}

/** "Details & sources" disclosure: the long form, only when asked. */
function Details({ slide }: { slide: Slide }) {
  const [open, setOpen] = useState(false);
  if (!slide.details?.length && !slide.sources?.length) return null;
  return (
    <div className="mt-8 max-w-3xl">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="inline-flex items-center gap-1.5 text-[13px] text-mute transition hover:text-ink">
        <ChevronDown className={cn("size-4 transition-transform duration-300", open && "rotate-180")} />
        {open ? "Hide details" : "Details & sources"}
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-3 border-l-2 border-accent/40 pl-5">
              {slide.details?.map((d) => (
                <p key={d} className="mb-2.5 text-[15px] leading-relaxed text-ink/80">
                  {renderInline(d)}
                </p>
              ))}
              {slide.sources?.length ? (
                <div className="mt-4">
                  <SourceCards sources={slide.sources} compact />
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
