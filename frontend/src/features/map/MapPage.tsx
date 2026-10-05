import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { GROUPS, hue, SECTION_BY_SLUG, SECTIONS } from "@/content/brief";
import { sceneLabel } from "@/content/outline";
import { TOOLS } from "@/content/tools";
import { CONTAINER } from "@/shell/layout";
import { cn } from "@/utils/cn";
import { ALL_SCENES, Emblem, scenesOf, ThemeMap } from "./MapParts";
import { usePosition, useVisited } from "./position";

export function MapPage() {
  return (
    <main className={cn(CONTAINER, "pb-28 pt-32")}>
      <header className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
        <div>
          <h1 className="font-display text-[clamp(2.6rem,5vw,4.25rem)] font-semibold leading-[1] tracking-[-0.03em]">The map</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/75">
            {SECTIONS.length} topics in {GROUPS.length} themes. Open any topic, or jump straight to a single scene.
          </p>
        </div>
        <YouAreHere />
      </header>
      <ThemeMap />
      <Tools />
    </main>
  );
}

/** Where you left off, and how much of the whole you've seen, by theme. */
export function YouAreHere() {
  const here = usePosition();
  const visited = useVisited();
  const s = here.topic ? SECTION_BY_SLUG[here.topic] : undefined;
  const scene = s && here.scene ? scenesOf(s.slug).find((x) => x.id === here.scene) : undefined;
  const target = s ?? SECTIONS[0]!;
  const seen = ALL_SCENES.filter((x) => visited.has(x.id)).length;

  return (
    <div style={hue(target.group)} className="card rounded-panel p-5">
      <div className="flex items-start gap-4">
        <Emblem section={target} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-topic">
            <MapPin className="size-3.5" /> {s ? "You are here" : "Start here"}
          </div>
          <div className="mt-0.5 font-display text-xl leading-tight tracking-tight">
            Topic {Number(target.num)}: {target.title}
          </div>
          {scene ? <div className="mt-0.5 truncate text-[14px] text-mute">{sceneLabel(scene)}</div> : null}
        </div>
        <Link
          to="/topics/$slug"
          params={{ slug: target.slug }}
          hash={scene?.id}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-control bg-ink px-4 text-[14px] font-medium text-canvas transition-[background-color,transform] duration-150 hover:bg-ink/85 active:scale-[0.97]"
        >
          {s ? "Continue" : "Begin"} <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-5">
        <div className="flex gap-[3px]" role="img" aria-label={`${seen} of ${ALL_SCENES.length} scenes seen`}>
          {SECTIONS.flatMap((t) =>
            scenesOf(t.slug).map((x) => (
              <span
                key={x.id}
                style={hue(t.group)}
                className={cn("h-2 flex-1 rounded-[2px]", x.id === here.scene ? "bg-ink" : visited.has(x.id) ? "bg-topic" : "bg-topic/15")}
              />
            )),
          )}
        </div>
        <div className="mt-2 text-[13px] text-mute">
          {seen} of {ALL_SCENES.length} scenes seen. One bar per scene, coloured by theme; the dark one is where you are.
        </div>
      </div>
    </div>
  );
}

function Tools() {
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl tracking-tight">Apply it to your own setup</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((t) => {
          const topics = SECTIONS.filter((s) => s.tools.includes(t.id));
          return (
            <li key={t.id}>
              <Link to={t.to} className="card flex h-full flex-col gap-3 rounded-panel p-5 transition-colors hover:border-line-strong">
                <span className="flex items-center gap-2 font-medium">
                  <t.icon className="size-4 text-accent" /> {t.label}
                </span>
                <span className="text-[13.5px] text-mute">{t.blurb}</span>
                <span className="mt-auto flex flex-wrap gap-1" aria-label={`Applies ${topics.length} topics`}>
                  {topics.map((s) => (
                    <span key={s.slug} style={hue(s.group)} title={s.title}>
                      <Emblem section={s} size="sm" />
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
