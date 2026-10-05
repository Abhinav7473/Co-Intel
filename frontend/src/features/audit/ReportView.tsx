import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { SECTION_BY_SLUG } from "@/content/brief";
import { Gauge } from "@/ui/charts/Gauge";
import { Panel } from "@/ui/Panel";
import { Segmented } from "@/ui/Segmented";
import { cn } from "@/utils/cn";
import { fmtTokens } from "@/utils/tones";
import type { Area, Finding, Report, Severity } from "./analyze";

const SEVERITY: Record<Severity, { label: string; icon: typeof Info; cls: string; order: number }> = {
  risk: { label: "Risk", icon: ShieldAlert, cls: "bg-warn-soft text-warn", order: 0 },
  warn: { label: "Fix", icon: AlertTriangle, cls: "bg-caution-soft text-caution", order: 1 },
  info: { label: "Note", icon: Info, cls: "bg-accent-soft text-accent", order: 2 },
  good: { label: "Good", icon: CheckCircle2, cls: "bg-sunken text-ink/70", order: 3 },
};

/** The analysis: score, where the always-on tokens go, and every finding with its fix. */
export function ReportView({ report, emptyHint }: { report: Report; emptyHint?: string }) {
  const [area, setArea] = useState<Area | "all">("all");
  const { budget } = report;
  const total = budget.memory + budget.skills + budget.tools;
  const findings = report.findings
    .filter((f) => area === "all" || f.area === area)
    .sort((a, b) => SEVERITY[a.severity].order - SEVERITY[b.severity].order);
  const issues = report.findings.filter((f) => f.severity === "risk" || f.severity === "warn").length;

  if (!report.findings.length) {
    return <Panel className="p-8 text-center text-mute">{emptyHint ?? "Nothing to analyse yet."}</Panel>;
  }

  return (
    <div className="space-y-5">
      <Panel className="flex flex-wrap items-center gap-6 p-6">
        <Gauge value={report.score} label="Setup score" warnBelow={60} />
        <div className="min-w-56 flex-1">
          <div className="font-display text-2xl tracking-tight">{issues ? `${issues} thing${issues === 1 ? "" : "s"} to fix` : "Nothing urgent"}</div>
          <div className="mt-4 text-[12px] text-mute">Loaded before you type: ~{fmtTokens(total)} tokens</div>
          <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-ink/[0.06]">
            {(
              [
                ["memory", budget.memory, "var(--color-accent)"],
                ["skills", budget.skills, "#56b4e9"],
                ["tools", budget.tools, "var(--color-series-b)"],
              ] as const
            ).map(([k, v, c]) => (
              <motion.span key={k} className="h-full" style={{ background: c }} animate={{ width: total ? `${(v / total) * 100}%` : 0 }} transition={{ type: "spring", stiffness: 120, damping: 22 }} />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-mute">
            <Legend color="var(--color-accent)" label={`Memory ${fmtTokens(budget.memory)}`} />
            <Legend color="#56b4e9" label={`Skill headers ${fmtTokens(budget.skills)}`} />
            <Legend color="var(--color-series-b)" label={`Tool definitions ${fmtTokens(budget.tools)}`} />
          </div>
        </div>
      </Panel>

      <Segmented
        label="Filter findings"
        size="sm"
        value={area}
        onChange={setArea}
        options={[
          { value: "all", label: "All" },
          { value: "memory", label: "Memory" },
          { value: "skills", label: "Skills" },
          { value: "servers", label: "Servers" },
          { value: "session", label: "Session" },
        ]}
      />

      <LayoutGroup>
        <ul className="space-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {findings.map((f) => (
              <FindingRow key={`${f.rule}-${f.title}`} finding={f} />
            ))}
          </AnimatePresence>
        </ul>
      </LayoutGroup>
    </div>
  );
}

function FindingRow({ finding: f }: { finding: Finding }) {
  const s = SEVERITY[f.severity];
  const topic = SECTION_BY_SLUG[f.topic];
  return (
    <motion.li layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card rounded-[14px] p-4">
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium", s.cls)}>
          <s.icon className="size-3" /> {s.label}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-medium leading-snug">{f.title}</div>
          {f.evidence ? <div className="mt-1 break-words font-mono text-[11.5px] leading-relaxed text-mute">{f.evidence}</div> : null}
          {f.fix ? <div className="mt-1.5 text-[13.5px] text-ink/80">{f.fix}</div> : null}
        </div>
        {topic ? (
          <Link to="/topics/$slug" params={{ slug: topic.slug }} className="shrink-0 text-[12px] text-mute hover:text-accent" title={topic.title}>
            Why · {topic.num}
          </Link>
        ) : null}
      </div>
    </motion.li>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
