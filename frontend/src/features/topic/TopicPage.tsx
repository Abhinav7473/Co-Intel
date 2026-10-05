import { getRouteApi, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { SECTION_BY_SLUG, SECTIONS } from "@/content/brief";
import { SLIDES } from "@/content/deck";
import { TOOL_BY_ID } from "@/content/tools";
import { TopicEntries } from "@/features/kb/TopicEntries";
import { useEntries } from "@/hooks/useEntries";
import { CONTAINER, GRID } from "@/shell/layout";
import { cn } from "@/utils/cn";
import { Scene } from "./Scene";

const route = getRouteApi("/topics/$slug");

export function TopicPage() {
  const { slug } = route.useParams();
  const section = SECTION_BY_SLUG[slug]!; // loader 404s unknown slugs
  const index = SECTIONS.indexOf(section);
  const prev = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];
  const scenes = SLIDES.filter((s) => s.chapter === slug && s.kind !== "chapter");
  const { data: entries = [] } = useEntries();
  const mine = entries.filter((e) => e.topic === slug).length;

  return (
    <main className={cn(CONTAINER, GRID, "pb-24 pt-32")}>
      <TopicRail current={slug} />
      {/* keyed by topic: scroll-linked scenes re-measure for each topic */}
      <div key={slug} className="min-w-0">
        <header className="mb-6 border-b border-line pb-12">
          <div className="flex items-center gap-4">
            <span className="font-display text-[clamp(4rem,9vw,7rem)] font-semibold leading-[0.85] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--color-accent)]">
              {section.num}
            </span>
          </div>
          <h1
            className="mt-6 max-w-4xl font-display text-[clamp(2.4rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            style={{ viewTransitionName: `topic-title-${slug}` }}
          >
            {section.title}
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-mute">{section.kicker}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {section.tools.map((t) => {
              const tool = TOOL_BY_ID[t];
              return (
                <Link key={t} to={tool.to} className="card inline-flex h-10 items-center gap-2 rounded-[12px] px-4 text-[13.5px] font-medium transition hover:border-line-strong">
                  <tool.icon className="size-4 text-accent" /> {tool.verb}
                </Link>
              );
            })}
            <a href="#your-knowledge" className="inline-flex h-10 items-center rounded-[12px] px-3 text-[13.5px] text-mute transition hover:text-ink">
              {mine} of your entries ↓
            </a>
          </div>
        </header>

        {scenes.map((s) => (
          <Scene key={s.id} slide={s} />
        ))}

        <TopicEntries topic={slug} />

        <nav aria-label="Other topics" className="mt-20 grid gap-3 sm:grid-cols-2">
          {prev ? <Neighbour to={prev.slug} label="Previous" title={prev.title} num={prev.num} dir="prev" /> : <span />}
          {next ? <Neighbour to={next.slug} label="Next" title={next.title} num={next.num} dir="next" /> : null}
        </nav>
      </div>
    </main>
  );
}

function Neighbour({ to, label, title, num, dir }: { to: string; label: string; title: string; num: string; dir: "prev" | "next" }) {
  return (
    <Link
      to="/topics/$slug"
      params={{ slug: to }}
      className={cn("card group flex flex-col gap-1 rounded-[20px] p-6 transition hover:border-line-strong", dir === "next" && "sm:text-right")}
    >
      <span className={cn("flex items-center gap-2 text-[13px] text-mute", dir === "next" && "sm:justify-end")}>
        {dir === "prev" ? <ArrowLeft className="size-4 transition group-hover:-translate-x-1" /> : null}
        {label} · {num}
        {dir === "next" ? <ArrowRight className="size-4 transition group-hover:translate-x-1" /> : null}
      </span>
      <span className="font-display text-2xl tracking-tight">{title}</span>
    </Link>
  );
}

/** Left rail: every topic, current one marked. Moving between topics is a view transition. */
function TopicRail({ current }: { current: string }) {
  return (
    <aside className="hidden lg:block">
      <nav aria-label="Topics" className="sticky top-28">
        <Link to="/" className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink">
          <ArrowLeft className="size-3.5" /> All topics
        </Link>
        <ol className="relative border-l border-line">
          {SECTIONS.map((s) => {
            const on = s.slug === current;
            return (
              <li key={s.slug} className="relative">
                {on ? <motion.span layoutId="rail-marker" className="absolute -left-px top-0 h-full w-0.5 bg-accent" /> : null}
                <Link
                  to="/topics/$slug"
                  params={{ slug: s.slug }}
                  aria-current={on ? "page" : undefined}
                  className={cn("flex gap-3 py-1.5 pl-4 text-[13px] leading-snug transition-colors", on ? "text-ink" : "text-mute hover:text-ink")}
                >
                  <span className={cn("font-mono tabular-nums", on ? "text-accent" : "text-mute/70")}>{s.num}</span>
                  <span>{s.title}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
