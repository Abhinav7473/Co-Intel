import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { GROUPS, hue, SECTION_BY_SLUG, SECTIONS } from "@/content/brief";
import { SLIDES } from "@/content/deck";
import { isScene, SCENE_CLASSES, sceneLabel, type OutlineScene } from "@/content/outline";
import { TOOL_BY_ID } from "@/content/tools";
import type { GroupId, Section } from "@/content/types";
import { cn } from "@/utils/cn";
import { usePosition, useVisited } from "./position";

export const scenesOf = (slug: string): OutlineScene[] => SLIDES.filter((s) => s.chapter === slug).filter(isScene);
export const ALL_SCENES = SECTIONS.flatMap((s) => scenesOf(s.slug));

/** Bento spans on the 12-column map: blocks sized roughly by how much they hold. */
const SPAN: Record<GroupId, string> = {
  sees: "lg:col-span-5",
  feeds: "lg:col-span-7",
  costs: "lg:col-span-7",
  wrong: "lg:col-span-5",
  behind: "lg:col-span-12",
};

/** A topic's emblem: its icon on a tile in its group's hue. Set `hue()` on an ancestor. */
export function Emblem({ section, size = "md" }: { section: Section; size?: "sm" | "md" | "lg" }) {
  const box = { sm: "size-6 rounded-[7px]", md: "size-11 rounded-control", lg: "size-20 rounded-panel" }[size];
  const icon = { sm: "size-3.5", md: "size-5", lg: "size-9" }[size];
  return (
    <span aria-hidden className={cn("flex shrink-0 items-center justify-center bg-topic/10 text-topic", box)}>
      <section.icon className={icon} strokeWidth={size === "lg" ? 1.5 : 2} />
    </span>
  );
}

/** One square per scene: its icon says what kind; fill says seen; the ring says you are here. */
export function SceneChips({ slug, size = "md" }: { slug: string; size?: "sm" | "md" }) {
  const visited = useVisited();
  const here = usePosition();
  return (
    <ol className={cn("relative z-10 flex flex-wrap", size === "sm" ? "gap-1" : "gap-1.5")} aria-label="Scenes">
      {scenesOf(slug).map((sc) => {
        const C = SCENE_CLASSES[sc.kind];
        const now = here.topic === slug && here.scene === sc.id;
        const seen = visited.has(sc.id);
        const label = `${C.name}: ${sceneLabel(sc)}${now ? " (you are here)" : seen ? " (seen)" : ""}`;
        return (
          <li key={sc.id} className="relative">
            {now ? <motion.span layoutId={`here-${size}`} className="absolute -inset-[3px] rounded-[9px] border-2 border-topic" transition={{ type: "spring", stiffness: 420, damping: 36 }} /> : null}
            <Link
              to="/topics/$slug"
              params={{ slug }}
              hash={sc.id}
              title={label}
              aria-label={label}
              aria-current={now ? "location" : undefined}
              className={cn(
                "relative flex items-center justify-center transition-colors",
                size === "sm" ? "size-6 rounded-[6px]" : "size-8 rounded-[7px]",
                now ? "bg-topic text-surface" : seen ? "bg-topic/15 text-topic hover:bg-topic hover:text-surface" : "bg-sunken text-ink/55 hover:bg-ink hover:text-canvas",
              )}
            >
              <C.icon className={size === "sm" ? "size-3" : "size-3.5"} />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** Seen / total for a set of scenes. */
export function useProgress(slugs: string[]) {
  const visited = useVisited();
  const scenes = slugs.flatMap(scenesOf);
  return { seen: scenes.filter((s) => visited.has(s.id)).length, total: scenes.length };
}

/** The whole site as themed blocks. Every topic card is one big link; every square jumps to a scene. */
export function ThemeMap() {
  return (
    <div>
      <Legend />
      <div className="grid gap-4 lg:grid-cols-12">
        {GROUPS.map((g) => (
          <GroupBlock key={g.id} id={g.id} title={g.title} blurb={g.blurb} />
        ))}
      </div>
    </div>
  );
}

function GroupBlock({ id, title, blurb }: { id: GroupId; title: string; blurb: string }) {
  const topics = SECTIONS.filter((s) => s.group === id);
  const { seen, total } = useProgress(topics.map((t) => t.slug));
  return (
    <section style={hue(id)} aria-labelledby={`group-${id}`} className={cn("rounded-panel border border-topic/15 bg-topic/[0.045] p-3 sm:p-4", SPAN[id])}>
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-2 pb-4 pt-2">
        <div>
          <h3 id={`group-${id}`} className="font-display text-2xl tracking-tight text-topic">
            {title}
          </h3>
          <p className="text-[14px] text-ink/70">{blurb}</p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-mute" title={`${seen} of ${total} scenes seen`}>
          <span className="h-1.5 w-20 overflow-hidden rounded-full bg-topic/15">
            <span className="block h-full rounded-full bg-topic transition-[width] duration-500" style={{ width: `${(seen / total) * 100}%` }} />
          </span>
          <span className="tabular-nums">
            {seen}/{total} seen
          </span>
        </div>
      </header>
      <ul className="grid gap-3">
        {topics.map((t) => (
          <TopicCard key={t.slug} section={t} />
        ))}
      </ul>
    </section>
  );
}

function TopicCard({ section: s }: { section: Section }) {
  const here = usePosition();
  const visited = useVisited();
  const scenes = scenesOf(s.slug);
  const isHere = here.topic === s.slug;
  const nextUp = scenes.find((sc) => !visited.has(sc.id));
  return (
    <li className={cn("group relative rounded-[16px] border bg-surface p-4 transition-[border-color,box-shadow] sm:p-5", isHere ? "border-topic shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-topic)_18%,transparent)]" : "border-line hover:border-topic/40")}>
      <div className="flex items-start gap-4">
        <Emblem section={s} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-[13px] tabular-nums text-topic">Topic {Number(s.num)}</span>
            {isHere ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-topic px-2 py-0.5 text-[12px] font-medium text-surface">
                <MapPin className="size-3" /> You are here
              </span>
            ) : null}
          </div>
          <Link
            to="/topics/$slug"
            params={{ slug: s.slug }}
            className="mt-0.5 block font-display text-[1.35rem] leading-tight tracking-tight outline-none after:absolute after:inset-0 after:rounded-[16px] focus-visible:after:ring-2 focus-visible:after:ring-topic"
            style={{ viewTransitionName: `topic-title-${s.slug}` }}
          >
            {s.title}
          </Link>
          <p className="mt-1 text-[14px] leading-snug text-mute">{s.kicker}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pl-0 sm:pl-15">
        <SceneChips slug={s.slug} />
        {s.tools.length ? (
          <span className="relative z-10 flex gap-1">
            {s.tools.map((id) => {
              const t = TOOL_BY_ID[id];
              return (
                <Link key={id} to={t.to} title={t.verb} aria-label={t.verb} className="flex size-8 items-center justify-center rounded-[7px] text-mute transition-colors hover:bg-sunken hover:text-ink">
                  <t.icon className="size-4" />
                </Link>
              );
            })}
          </span>
        ) : null}
      </div>
      {isHere && here.scene ? (
        <ContinueLink slug={s.slug} scene={here.scene} verb="Continue at" />
      ) : nextUp && nextUp !== scenes[0] ? (
        <ContinueLink slug={s.slug} scene={nextUp.id} verb="Not seen yet:" />
      ) : null}
    </li>
  );
}

function ContinueLink({ slug, scene, verb }: { slug: string; scene: string; verb: string }) {
  const sc = scenesOf(slug).find((x) => x.id === scene);
  if (!sc) return null;
  return (
    <Link to="/topics/$slug" params={{ slug }} hash={scene} className="relative z-10 mt-3 flex items-center gap-1.5 text-[13.5px] text-topic hover:underline sm:pl-15">
      <span className="text-mute">{verb}</span>
      <span className="truncate">{sceneLabel(sc)}</span>
      <ArrowRight className="size-3.5 shrink-0" />
    </Link>
  );
}

export function Legend() {
  return (
    <dl className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-mute">
      {Object.entries(SCENE_CLASSES).map(([kind, c]) => (
        <div key={kind} className="flex items-center gap-1.5" title={c.blurb}>
          <dt className="flex size-6 items-center justify-center rounded-[6px] bg-sunken text-ink/60">
            <c.icon className="size-3" aria-hidden />
          </dt>
          <dd className="text-ink/80">{c.name}</dd>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <dt className="size-6 rounded-[6px] bg-accent/15" />
        <dd>Seen</dd>
      </div>
      <div className="flex items-center gap-1.5">
        <dt className="size-6 rounded-[6px] border-2 border-accent bg-accent" />
        <dd>You are here</dd>
      </div>
    </dl>
  );
}

/**
 * Topic rail: the map in miniature. Every topic one click away; the current topic opens to its
 * scenes, and the ring follows the scene you're reading.
 */
export function MiniMap({ current }: { current: string }) {
  return (
    <aside className="hidden lg:block">
      <nav aria-label="Map of topics" className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto pb-6 pr-1 no-scrollbar">
        <Link to="/map" className="mb-4 inline-flex items-center gap-1.5 rounded-control border border-line bg-surface px-3 py-1.5 text-[13px] font-medium transition-colors hover:border-line-strong">
          <MapPin className="size-3.5 text-accent" /> Open the map
        </Link>
        {GROUPS.map((g) => (
          <div key={g.id} style={hue(g.id)} className="mb-3">
            <div className="mb-1 flex items-center gap-2 pl-1 text-[12px] font-medium text-topic">
              <span className="size-1.5 rounded-full bg-topic" />
              {g.title}
            </div>
            <ol>
              {SECTIONS.filter((s) => s.group === g.id).map((s) => {
                const on = s.slug === current;
                return (
                  <li key={s.slug} className={cn("rounded-control", on && "bg-topic/[0.07] pb-2.5")}>
                    <Link
                      to="/topics/$slug"
                      params={{ slug: s.slug }}
                      aria-current={on ? "page" : undefined}
                      className={cn("flex items-start gap-2.5 rounded-control px-1 py-1.5 text-[13px] leading-snug transition-colors", on ? "font-medium text-ink" : "text-mute hover:bg-sunken hover:text-ink")}
                    >
                      <Emblem section={s} size="sm" />
                      <span className="pt-0.5">{s.title}</span>
                    </Link>
                    {on ? (
                      <div className="pl-9 pr-2 pt-1">
                        <SceneChips slug={s.slug} size="sm" />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </nav>
    </aside>
  );
}

/** Below lg: a floating pill with where you are in this topic; tap for the map. */
export function HerePill({ slug }: { slug: string }) {
  const here = usePosition();
  const s = SECTION_BY_SLUG[slug]!;
  const scenes = scenesOf(slug);
  const i = here.topic === slug ? scenes.findIndex((x) => x.id === here.scene) : -1;
  return (
    <Link
      to="/map"
      style={hue(s.group)}
      className="glass-frost glass-rim fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full py-2 pl-2 pr-4 text-[13px] lg:hidden"
    >
      <Emblem section={s} size="sm" />
      <span className="font-medium">Topic {Number(s.num)}</span>
      <span className="flex gap-0.5" aria-hidden>
        {scenes.map((x, j) => (
          <span key={x.id} className={cn("h-1.5 w-2 rounded-full", j === i ? "w-4 bg-topic" : j < i ? "bg-topic/40" : "bg-ink/15")} />
        ))}
      </span>
      <span className="text-mute">{i >= 0 ? `${i + 1}/${scenes.length}` : `${scenes.length} scenes`}</span>
      <span className="sr-only">Open the map</span>
      <MapPin className="size-4 text-topic" aria-hidden />
    </Link>
  );
}
