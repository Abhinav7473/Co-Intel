import { getRouteApi, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { GROUPS, hue, SECTION_BY_SLUG, SECTIONS } from "@/content/brief";
import { SCENE_CLASSES, sceneLabel } from "@/content/outline";
import { TOOL_BY_ID } from "@/content/tools";
import type { Section } from "@/content/types";
import { TopicEntries } from "@/features/kb/TopicEntries";
import { Emblem, HerePill, MiniMap, scenesOf } from "@/features/map/MapParts";
import { trackScenes } from "@/features/map/position";
import { useEntries } from "@/hooks/useEntries";
import { CONTAINER, GRID } from "@/shell/layout";
import { cn } from "@/utils/cn";
import { Scene } from "./Scene";
import { TakeawayBar } from "./TakeawayBar";

const route = getRouteApi("/topics/$slug");

export function TopicPage() {
  const { slug } = route.useParams();
  const section = SECTION_BY_SLUG[slug]!; // loader 404s unknown slugs
  const index = SECTIONS.indexOf(section);
  const prev = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];
  const scenes = scenesOf(slug);
  const group = GROUPS.find((g) => g.id === section.group)!;
  const siblings = SECTIONS.filter((s) => s.group === section.group);
  const { data: entries = [] } = useEntries();
  const mine = entries.filter((e) => e.topic === slug).length;

  return (
    // the whole page takes its theme's hue: chrome reads `topic`, widgets keep their data colours
    <main style={hue(section.group)} className={cn(CONTAINER, GRID, "pb-24 pt-32")}>
      <MiniMap current={slug} />
      {/* keyed by topic: scroll-linked scenes re-measure, and the tracker re-observes, for each topic */}
      <div key={slug} ref={trackScenes(slug)} className="min-w-0">
        <header className="mb-6 border-b border-line pb-12">
          <Link to="/map" className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-topic hover:underline">
            <span className="font-medium">{group.title}</span>
            <span className="text-mute">
              topic {siblings.indexOf(section) + 1} of {siblings.length} in this theme
            </span>
          </Link>
          <div className="mt-6 flex items-center gap-5">
            <Emblem section={section} size="lg" />
            <span className="font-display text-[clamp(4rem,9vw,7rem)] font-semibold leading-[0.85] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--color-topic)]">
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
                <Link key={t} to={tool.to} className="card inline-flex h-10 items-center gap-2 rounded-control px-4 text-[13.5px] font-medium transition hover:border-line-strong">
                  <tool.icon className="size-4 text-topic" /> {tool.verb}
                </Link>
              );
            })}
            <a href="#your-knowledge" className="inline-flex h-10 items-center rounded-control px-3 text-[13.5px] text-mute transition hover:text-ink">
              {mine} of your entries ↓
            </a>
          </div>

          <nav aria-label="On this page" className="mt-10">
            <h2 className="mb-2 text-[13px] text-mute">On this page: {scenes.length} scenes</h2>
            <ol className="grid gap-x-8 sm:grid-cols-2">
              {scenes.map((s, i) => {
                const C = SCENE_CLASSES[s.kind];
                return (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="group flex items-center gap-3 border-t border-line py-2 text-[14px] transition-colors hover:text-topic">
                      <span className="w-5 text-[12px] tabular-nums text-mute">{i + 1}</span>
                      <C.icon className={cn("size-3.5 shrink-0", s.kind === "widget" ? "text-topic" : "text-ink/50")} aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{sceneLabel(s)}</span>
                      <span className="shrink-0 text-[12px] text-mute">{C.name}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </header>

        {scenes.map((s) => (
          <Scene key={s.id} slide={s} />
        ))}

        <TakeawayBar slug={slug} />

        <TopicEntries topic={slug} />

        <WhereNext section={section} prev={prev} next={next} />
      </div>
      <HerePill slug={slug} />
    </main>
  );
}

/** Not just back and next: the topics this one leans on, each in its own theme's hue, and the map. */
function WhereNext({ section, prev, next }: { section: Section; prev?: Section; next?: Section }) {
  const unlinked = (n?: Section) => n && !section.links.some((l) => l.to === n.slug);
  return (
    <nav aria-label="Where next" className="mt-20">
      <h2 className="font-display text-3xl tracking-tight">Where next</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {section.links.map((l) => {
          const t = SECTION_BY_SLUG[l.to]!;
          return (
            <li key={l.to} style={hue(t.group)}>
              <Link to="/topics/$slug" params={{ slug: t.slug }} className="group flex h-full items-start gap-4 rounded-panel border border-topic/20 bg-topic/[0.045] p-5 transition-colors hover:border-topic/50">
                <Emblem section={t} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] text-topic">{l.why}</span>
                  <span className="mt-0.5 block font-display text-xl leading-tight tracking-tight">
                    Topic {Number(t.num)}: {t.title}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr]">
        {unlinked(prev) ? <Neighbour section={prev!} dir="prev" /> : <span />}
        <Link to="/map" className="card flex items-center justify-center gap-2 rounded-panel px-6 py-4 text-[14px] font-medium transition-colors hover:border-line-strong">
          <MapPin className="size-4 text-topic" /> All topics
        </Link>
        {unlinked(next) ? <Neighbour section={next!} dir="next" /> : <span />}
      </div>
    </nav>
  );
}

function Neighbour({ section: s, dir }: { section: Section; dir: "prev" | "next" }) {
  return (
    <Link
      to="/topics/$slug"
      params={{ slug: s.slug }}
      style={hue(s.group)}
      className={cn("card group flex items-center gap-3 rounded-panel px-5 py-4 transition hover:border-line-strong", dir === "next" && "flex-row-reverse text-right")}
    >
      {dir === "prev" ? <ArrowLeft className="size-4 shrink-0 text-mute transition group-hover:-translate-x-0.5" /> : <ArrowRight className="size-4 shrink-0 text-mute transition group-hover:translate-x-0.5" />}
      <span className="min-w-0">
        <span className="block text-[12.5px] text-mute">{dir === "prev" ? "Previous" : "Next"}</span>
        <span className="block truncate text-[15px] font-medium">{s.title}</span>
      </span>
    </Link>
  );
}
