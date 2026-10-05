import { useState } from "react";
import { FileCode2, FileText, Tag, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/ui/Button";
import { WidgetFrame } from "@/ui/Panel";

const LEVELS = [
  { icon: Tag, name: "Name + description", when: "At startup", cost: "~100 tokens", detail: "The only part always in context. A vague description means the skill never fires — 26.4% of public skills lack one." },
  { icon: FileText, name: "SKILL.md body", when: "On trigger", cost: "only when used", detail: "Procedure, rubric, formatting rules. Keep it actionable: over 60% of the average body is not." },
  { icon: FileCode2, name: "Referenced files & scripts", when: "When needed", cost: "scripts run outside context", detail: "Scripts can execute without their source ever entering context — deterministic work for zero tokens." },
] as const;

const STAGES = ["Idle session", "Task matches the description", "Task needs the details"] as const;

export function SkillLevels() {
  const [stage, setStage] = useState(0);

  return (
    <WidgetFrame
      title="Three load levels"
      hint="Step a task through a skill and watch what actually enters the context window."
      actions={
        <Button size="sm" icon={<Zap className="size-3.5" />} onClick={() => setStage((s) => (s + 1) % 3)}>
          {stage === 2 ? "Reset" : "Next step"}
        </Button>
      }
    >
      <div className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
        {STAGES.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className={i <= stage ? "text-accent" : ""}>{s}</span>
            {i < 2 ? <span className="text-ink/25">→</span> : null}
          </span>
        ))}
      </div>
      <div className="relative space-y-3">
        {LEVELS.map((l, i) => {
          const loaded = i <= stage;
          return (
            <motion.div
              key={l.name}
              animate={{
                opacity: loaded ? 1 : 0.35,
                x: loaded ? 0 : 12,
                borderColor: loaded ? "rgb(0 114 178 / 0.45)" : "rgb(22 24 29 / 0.08)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="flex gap-4 rounded-2xl border bg-surface p-4"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <l.icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-display text-lg">
                    L{i + 1} · {l.name}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
                    {l.when} · {l.cost}
                  </span>
                </div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink/75">{l.detail}</p>
              </div>
              <div className="hidden items-center sm:flex">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${loaded ? "bg-accent/15 text-accent" : "bg-ink/[0.06] text-mute"}`}>
                  {loaded ? "in context" : "on disk"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </WidgetFrame>
  );
}
