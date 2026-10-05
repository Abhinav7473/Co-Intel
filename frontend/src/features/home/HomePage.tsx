import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BRIEF_THESIS, SECTIONS } from "@/content/brief";
import { SOURCES } from "@/content/data";
import { TOOLS } from "@/content/tools";
import { useAssessments } from "@/hooks/useAssessments";
import { useEntries } from "@/hooks/useEntries";
import { useExperiments } from "@/hooks/useExperiments";
import { useSetupAudits } from "@/hooks/useSetupAudits";
import { CONTAINER } from "@/shell/layout";
import { SourceCards } from "@/ui/SourceCards";
import { cn } from "@/utils/cn";
import { ContextScrubber } from "./ContextScrubber";
import { SiteMap } from "./SiteMap";

const EASE = [0.16, 1, 0.3, 1] as const;

export function HomePage() {
  return (
    <>
      <Hero />
      <main className={cn(CONTAINER, "pb-28")}>
        <Status />
        <Topics />
        <Tools />
        <Sources />
      </main>
    </>
  );
}

function Hero() {
  return (
    <header className={cn(CONTAINER, "pb-20 pt-36")}>
      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-display text-[clamp(2.75rem,5.5vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.035em]"
          >
            AI Workflow Habits
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
            {BRIEF_THESIS}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap items-center gap-5">
            <Link to="/audit" className="inline-flex h-11 items-center rounded-[12px] bg-ink px-5 font-medium text-canvas transition-[background-color,transform] duration-150 hover:bg-ink/85 active:scale-[0.97]">
              Audit your setup
            </Link>
            <a href="#topics" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              Read the research
            </a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>
          <ContextScrubber />
        </motion.div>
      </div>
    </header>
  );
}

/** Where you stand: your latest results, or a nudge to get one. */
function Status() {
  const { data: audits = [] } = useSetupAudits();
  const { data: assessments = [] } = useAssessments();
  const { data: experiments = [] } = useExperiments();
  const { data: entries = [] } = useEntries();
  const cells = [
    { label: "Setup score", value: audits[0]?.score, to: "/audit" as const, empty: "Run an audit" },
    { label: "Habits score", value: assessments[0]?.overall, to: "/assess" as const, empty: "Take the assessment" },
    { label: "Experiments", value: experiments.length || undefined, to: "/experiments" as const, empty: "Start one" },
    { label: "Knowledge entries", value: entries.length || undefined, to: "/kb" as const, empty: "Add a finding" },
  ];
  return (
    <section aria-label="Your status" className="card mb-20 grid grid-cols-2 divide-line overflow-hidden rounded-[20px] md:grid-cols-4 md:divide-x">
      {cells.map((c) => (
        <Link key={c.label} to={c.to} className="group p-5 transition hover:bg-sunken">
          <div className="text-[12.5px] text-mute">{c.label}</div>
          {c.value !== undefined ? (
            <div className="mt-1 font-display text-4xl tabular-nums">{c.value}</div>
          ) : (
            <div className="mt-2 inline-flex items-center gap-1 text-[14px] text-accent">
              {c.empty} <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </div>
          )}
        </Link>
      ))}
    </section>
  );
}

function Topics() {
  const { data: entries = [] } = useEntries();
  return (
    <section id="topics" className="scroll-mt-24">
      <SectionHead
        eyebrow="The research"
        title="A map of the site"
        lead={`${SECTIONS.length} topics in five groups. Each square is one scene; its icon says what kind. Click any square to jump straight to it.`}
      />
      <SiteMap yours={(slug) => entries.filter((e) => e.topic === slug).length} />
    </section>
  );
}

function Tools() {
  return (
    <section className="mt-24">
      <SectionHead eyebrow="The tools" title="Apply it to your own setup" lead="Everything you save stays in this app's database." />
      <ul className="grid gap-3 md:grid-cols-2">
        {TOOLS.map((t) => (
          <li key={t.id}>
            <Link to={t.to} className="card group flex h-full items-start gap-4 rounded-[18px] p-6 transition hover:border-line-strong">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-accent-soft text-accent">
                <t.icon className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block font-display text-xl tracking-tight">{t.label}</span>
                <span className="mt-1 block text-[14px] text-mute">{t.blurb}</span>
              </span>
              <ArrowRight className="mt-1 size-5 text-ink/30 transition group-hover:translate-x-1 group-hover:text-ink" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Sources() {
  const [open, setOpen] = useState(false);
  const total = SOURCES.reduce((a, g) => a + g.links.length, 0);
  return (
    <section className="mt-24 border-t border-line pt-8">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex items-center gap-2 text-[14px] text-mute hover:text-ink">
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        All {total} sources
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="space-y-10 pt-6">
              {SOURCES.map((g) => (
                <div key={g.group}>
                  <h3 className="mb-3 font-display text-xl tracking-tight">{g.group}</h3>
                  <SourceCards sources={g.links} />
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <div className="mb-2 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">{eyebrow}</div>
      <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-semibold leading-tight tracking-[-0.02em]">{title}</h2>
      <p className="mt-2 text-[16px] text-mute">{lead}</p>
    </div>
  );
}
