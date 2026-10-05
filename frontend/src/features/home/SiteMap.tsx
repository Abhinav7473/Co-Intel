import { Link } from "@tanstack/react-router";
import { QUESTIONS } from "@/content/assessment";
import { GROUPS, SECTIONS } from "@/content/brief";
import { SLIDES } from "@/content/deck";
import { TEMPLATES } from "@/content/experiments";
import { isScene, SCENE_CLASSES, sceneLabel } from "@/content/outline";
import { TOOLS } from "@/content/tools";
import type { Section, ToolId } from "@/content/types";
import { cn } from "@/utils/cn";

const scenesOf = (slug: string) => SLIDES.filter((s) => s.chapter === slug).filter(isScene);

/** How many items each tool holds for a topic, where the tool's data is per topic. */
const toolCount = (tool: ToolId, slug: string): string | null => {
  if (tool === "assess") {
    const n = QUESTIONS.filter((q) => q.topic === slug).length;
    return n ? `${n} question${n === 1 ? "" : "s"}` : null;
  }
  if (tool === "experiments") {
    const n = TEMPLATES.filter((t) => t.topic === slug).length;
    return n ? `${n} template${n === 1 ? "" : "s"}` : null;
  }
  return null;
};

const COLS = "md:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1fr)_repeat(4,4.5rem)]";

/**
 * The site as a diagram: topics grouped by category (rows), each topic's scenes as squares
 * whose icon is the scene's class, and which tool applies the topic (columns). Every cell is a link.
 */
export function SiteMap({ yours }: { yours: (slug: string) => number }) {
  return (
    <div>
      <Legend />
      <div className="card overflow-hidden rounded-[20px]">
        <div className={cn("hidden gap-4 border-b border-line bg-sunken px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-mute md:grid", COLS)}>
          <span>#</span>
          <span>Topic</span>
          <span>Scenes, in order</span>
          {TOOLS.map((t) => (
            <Link key={t.id} to={t.to} className="flex flex-col items-center gap-1 text-center normal-case tracking-normal hover:text-ink">
              <t.icon className="size-4" />
              <span className="text-[11px] leading-tight">{t.label}</span>
            </Link>
          ))}
        </div>
        {GROUPS.map((g) => (
          <section key={g.id} aria-labelledby={`group-${g.id}`}>
            <div className="border-b border-line px-5 pb-2 pt-6">
              <h3 id={`group-${g.id}`} className="font-display text-xl tracking-tight">
                {g.title}
              </h3>
              <p className="text-[13px] text-mute">{g.blurb}</p>
            </div>
            <ul>
              {SECTIONS.filter((s) => s.group === g.id).map((s) => (
                <Row key={s.slug} section={s} yours={yours(s.slug)} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Row({ section: s, yours }: { section: Section; yours: number }) {
  const scenes = scenesOf(s.slug);
  return (
    <li className={cn("grid grid-cols-[2.5rem_1fr] items-start gap-x-4 gap-y-3 border-b border-line px-5 py-4 last:border-b-0", COLS)}>
      <span className="pt-0.5 font-mono text-[13px] text-accent">{s.num}</span>
      <div className="min-w-0">
        <Link
          to="/topics/$slug"
          params={{ slug: s.slug }}
          className="font-display text-lg leading-tight tracking-tight hover:text-accent"
          style={{ viewTransitionName: `topic-title-${s.slug}` }}
        >
          {s.title}
        </Link>
        <p className="mt-0.5 text-[13px] text-mute">
          {s.kicker}
          {yours ? <span className="text-accent"> · {yours} of your notes</span> : null}
        </p>
      </div>
      <ol className="col-start-2 flex flex-wrap gap-1.5 md:col-start-auto" aria-label={`${s.title}: ${scenes.length} scenes`}>
        {scenes.map((sc) => {
          const C = SCENE_CLASSES[sc.kind];
          const label = `${C.name}: ${sceneLabel(sc)}`;
          return (
            <li key={sc.id}>
              <Link
                to="/topics/$slug"
                params={{ slug: s.slug }}
                hash={sc.id}
                title={label}
                aria-label={label}
                className={cn(
                  "flex size-8 items-center justify-center rounded-[8px] transition-colors",
                  sc.kind === "widget" ? "bg-accent-soft text-accent hover:bg-accent hover:text-surface" : "bg-sunken text-ink/60 hover:bg-ink hover:text-canvas",
                )}
              >
                <C.icon className="size-3.5" />
              </Link>
            </li>
          );
        })}
      </ol>
      {TOOLS.map((t) => {
        const on = s.tools.includes(t.id);
        const count = on ? toolCount(t.id, s.slug) : null;
        return on ? (
          <Link
            key={t.id}
            to={t.to}
            title={`${t.label}${count ? `: ${count} on this topic` : ""}`}
            className="hidden flex-col items-center gap-1 pt-1 text-center text-[11px] leading-tight text-mute hover:text-ink md:flex"
          >
            <span className="size-3 rounded-full bg-accent" />
            {count}
          </Link>
        ) : (
          <span key={t.id} className="hidden justify-center pt-1 md:flex" aria-hidden>
            <span className="size-3 rounded-full border border-line-strong" />
          </span>
        );
      })}
    </li>
  );
}

function Legend() {
  return (
    <dl className="mb-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
      {Object.entries(SCENE_CLASSES).map(([kind, c]) => (
        <div key={kind} className="flex items-center gap-2" title={c.blurb}>
          <dt className={cn("flex size-6 items-center justify-center rounded-[6px]", kind === "widget" ? "bg-accent-soft text-accent" : "bg-sunken text-ink/60")}>
            <c.icon className="size-3" aria-hidden />
          </dt>
          <dd>
            <span className="font-medium">{c.name}</span> <span className="text-mute">— {c.blurb}</span>
          </dd>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <dt>
          <span className="block size-3 rounded-full bg-accent" />
        </dt>
        <dd className="text-mute">a tool applies this topic</dd>
      </div>
    </dl>
  );
}
