import { useState, type ReactNode } from "react";
import { ArrowRight, Archive, BookOpen, FileText } from "lucide-react";
import facts from "@/content/build-facts.json";
import { WidgetFrame } from "@/ui/Panel";
import { Segmented } from "@/ui/Segmented";
import { Code } from "@/ui/Code";

const community = facts.skills.filter((s) => s.source !== "written for this project");
const own = facts.skills.filter((s) => s.source === "written for this project");

/** Two meta-diagrams of this repository: what the AI reads (and when), and how the app's code is layered. */
export function InfoSystem() {
  const [view, setView] = useState<"files" | "code">("files");
  return (
    <WidgetFrame
      title={view === "files" ? "What the AI reads, and when" : "How the app's code is layered"}
      actions={
        <Segmented
          label="Choose a diagram"
          size="sm"
          value={view}
          onChange={setView}
          options={[
            { value: "files", label: "The AI's files" },
            { value: "code", label: "The app's code" },
          ]}
        />
      }
    >
      {view === "files" ? <Files /> : <Layers />}
    </WidgetFrame>
  );
}

function Files() {
  return (
    <>
      <div className="grid gap-3 lg:grid-cols-3">
        <Tier icon={FileText} when="Read every session" title={facts.core.path} meta={`${facts.core.lines} lines · ${facts.core.rules.length} rules`} accent>
          <ul className="space-y-1.5">
            {facts.core.rules.map((r) => (
              <li key={r} className="text-[13px] leading-snug text-ink/80">
                <Code text={r} />
              </li>
            ))}
          </ul>
        </Tier>
        <Tier icon={BookOpen} when="Looked up when a task needs it" title="docs/" meta={`${facts.docs.length} files · ${facts.docs.reduce((a, d) => a + d.lines, 0)} lines`}>
          <ul className="space-y-2">
            {facts.docs.map((d) => (
              <li key={d.path} className="text-[13px] leading-snug">
                <span className="font-mono text-[12px]">{d.path.replace("docs/", "")}</span>
                <span className="text-mute"> · {d.lines} lines</span>
                <span className="block text-ink/75">{d.purpose}</span>
              </li>
            ))}
          </ul>
        </Tier>
        <Tier icon={Archive} when="Never loaded by default" title={facts.log.path.replace("docs/", "")} meta={`${facts.log.decisions.length} decisions · ${facts.log.lines} lines`}>
          <p className="text-[13px] leading-relaxed text-ink/80">
            Append-only. Each entry: the decision, why, and what was rejected. Searched when a question comes up, so an old argument isn't reopened. The
            next scene shows all of it.
          </p>
        </Tier>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-[12px] border border-line p-4">
          <div className="mb-1 font-medium">
            {facts.skills.length} skills{" "}
            <span className="text-[13px] font-normal text-mute">
              · {community.length} from other people, {own.length} written here
            </span>
          </div>
          <p className="mb-3 text-[13px] text-mute">Loaded only when a task matches the description (topic 04). Hover for what each does.</p>
          <div className="flex flex-wrap gap-1.5">
            {facts.skills.map((s) => (
              <span
                key={s.name}
                title={`${s.description} (${s.source})`}
                className={`rounded-full px-2.5 py-0.5 font-mono text-[11.5px] ${s.source === "written for this project" ? "bg-accent-soft text-accent" : "bg-sunken text-ink/80"}`}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[12px] border border-line p-4">
          <div className="mb-1 font-medium">Checks the AI runs</div>
          <p className="mb-3 text-[13px] text-mute">Rules a model drops at density are enforced by a command instead.</p>
          <ul className="space-y-1.5">
            {facts.checks.map((c) => (
              <li key={c.name} className="text-[13px] leading-snug">
                <span className="font-mono text-[12px]">{c.name}</span> <span className="text-mute">— {c.what}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function Tier({
  icon: Icon,
  when,
  title,
  meta,
  accent,
  children,
}: {
  icon: typeof FileText;
  when: string;
  title: string;
  meta: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`rounded-[12px] border p-4 ${accent ? "border-accent/40 bg-accent-soft/50" : "border-line bg-surface"}`}>
      <div className="mb-3 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.1em] text-accent">
        <Icon className="size-4" /> {when}
      </div>
      <div className="font-mono text-[15px]">{title}</div>
      <div className="mb-3 text-[12.5px] text-mute">{meta}</div>
      {children}
    </section>
  );
}

const LAYERS = [
  { title: "Content", path: "frontend/src/content", items: facts.code.content, note: "Topics, scenes, datasets. Plain data; no layout." },
  { title: "Pages", path: "frontend/src/features", items: facts.code.pages, note: `One folder per page, plus ${facts.code.widgets} widgets used in topics.` },
  { title: "API", path: "backend/app/features", items: facts.code.api, note: "FastAPI. One folder per thing you can save." },
  { title: "Database", path: "Postgres", items: facts.code.tables, note: "Your audits, answers, runs and notes. Nothing leaves it." },
];

function Layers() {
  return (
    <>
      <ol className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {LAYERS.map((l, i) => (
          <li key={l.title} className="contents">
            <div className="rounded-[12px] border border-line bg-surface p-4">
              <div className="font-display text-lg">{l.title}</div>
              <div className="mb-2 font-mono text-[11.5px] text-mute">{l.path}</div>
              <p className="mb-3 text-[13px] leading-snug text-ink/80">{l.note}</p>
              <ul className="flex flex-wrap gap-1.5">
                {l.items.map((x) => (
                  <li key={x} className="rounded-md bg-sunken px-2 py-0.5 font-mono text-[11.5px]">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            {i < LAYERS.length - 1 ? (
              <span className="hidden items-center text-mute lg:flex" aria-hidden>
                <ArrowRight className="size-4" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-5 text-[13px] leading-relaxed text-mute">
        Topic pages read only the content files; they need no server. The four tools save through the API into Postgres. Everything runs in Docker,
        started by one command: <span className="font-mono text-ink">docker compose up --watch</span>.
      </p>
    </>
  );
}
