import { useState } from "react";
import { BookOpen, Cpu, ScrollText } from "lucide-react";
import { motion } from "motion/react";
import { Chip, WidgetFrame } from "@/ui/Panel";
import { cn } from "@/utils/cn";

const TIERS = [
  {
    key: "core",
    icon: Cpu,
    name: "Always-on core",
    files: "CLAUDE.md · AGENTS.md · project brief",
    rule: "Only non-obvious rules the model gets wrong without being told. No repo tours, no biography. Overwritten when things change, so it never grows with session count.",
    load: "Every turn",
    color: "#0072b2",
  },
  {
    key: "reference",
    icon: BookOpen,
    name: "On-demand reference",
    files: "specs · style guides · formatting rules · stack notes",
    rule: "Named in the core by path and purpose; read only when the task needs it.",
    load: "When relevant",
    color: "#0072b2",
  },
  {
    key: "log",
    icon: ScrollText,
    name: "Log",
    files: "decisions · rejected options · why",
    rule: "Append-only, plain language, never loaded by default. Consulted by targeted lookup — the Index Sickness fix.",
    load: "Never by default",
    color: "#0072b2",
  },
] as const;

/** Index Sickness: 308 lines of always-on instructions → ~80 after separating state from history. */
const BLOATED = 308;
const TIERED = 80;

export function MemoryTiers() {
  const [mode, setMode] = useState<"bloated" | "tiered">("bloated");
  const lines = mode === "bloated" ? BLOATED : TIERED;

  return (
    <WidgetFrame title="Three tiers, three load rules" hint="Flip between one bloated file and the tiered split from Index Sickness.">
      <div className="mb-5 flex flex-wrap gap-2">
        <Chip active={mode === "bloated"} onClick={() => setMode("bloated")} color="#a94400">
          One bloated file
        </Chip>
        <Chip active={mode === "tiered"} onClick={() => setMode("tiered")} color="#0072b2">
          Tiered memory
        </Chip>
      </div>

      <div className="mb-6 rounded-2xl border border-line bg-sunken p-4">
        <div className="mb-2 flex items-baseline justify-between text-[13px]">
          <span className="text-mute">Lines of instructions loaded every single turn</span>
          <motion.span key={lines} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-2xl tabular-nums">
            {lines}
          </motion.span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-ink/[0.06]">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${(lines / BLOATED) * 100}%`, background: mode === "bloated" ? "#a94400" : "#0072b2" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <p className="mt-3 text-[12.5px] text-mute">
          {mode === "bloated"
            ? "Defensive patches, code names, history and current state in one file. Shortening the project's spec documents first (−56% lines) did not fix it."
            : "Corrections fell from 0.79 to 0.53 per session. Corrections for the AI saying work was done when it wasn't: 9 before, 0 after."}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {TIERS.map((t, i) => {
          const dim = mode === "bloated" && i > 0;
          return (
            <motion.div
              key={t.key}
              animate={{ opacity: dim ? 0.35 : 1, y: dim ? 6 : 0 }}
              className={cn("relative overflow-hidden rounded-2xl border border-line bg-surface p-4")}
            >
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />
              <t.icon className="mb-3 size-5" style={{ color: t.color }} />
              <div className="font-display text-lg">{t.name}</div>
              <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mute">{t.files}</div>
              <p className="text-[13.5px] leading-relaxed text-ink/80">{t.rule}</p>
              <div className="mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ background: `${t.color}22`, color: t.color }}>
                Loaded: {t.load}
              </div>
            </motion.div>
          );
        })}
      </div>
    </WidgetFrame>
  );
}
