import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { STUDIES } from "@/content/data";
import type { Study } from "@/content/types";
import { Chip, WidgetFrame } from "@/ui/Panel";
import { cn } from "@/utils/cn";

const STANCE: Record<Study["stance"], { label: string; color: string }> = {
  "less-is-more": { label: "Less is more", color: "#0072b2" },
  counterweight: { label: "Counterweight", color: "#0072b2" },
  pattern: { label: "Working pattern", color: "#0072b2" },
};

type Filter = "all" | Study["stance"];

export function EvidenceDeck() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<string | null>("context-rot");
  const shown = STUDIES.filter((s) => filter === "all" || s.stance === filter);

  return (
    <WidgetFrame title="Seven studies, one direction" hint="Filter by what each one argues; tap a card to read the finding.">
      <div className="mb-5 flex flex-wrap gap-2">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>
          All {STUDIES.length}
        </Chip>
        {(Object.keys(STANCE) as Study["stance"][]).map((k) => (
          <Chip key={k} active={filter === k} onClick={() => setFilter(k)} color={STANCE[k].color}>
            {STANCE[k].label}
          </Chip>
        ))}
      </div>

      <motion.div layout className="grid gap-3 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((s, i) => {
            const isOpen = open === s.key;
            const { color, label } = STANCE[s.stance];
            return (
              <motion.div
                layout
                key={s.key}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-4 transition-colors",
                  isOpen ? "border-line-strong bg-surface sm:col-span-2" : "border-line bg-surface hover:border-line-strong",
                )}
              >
                <span
                  aria-hidden
                  className="absolute -right-10 -top-10 size-32 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
                  style={{ background: color }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : s.key)}
                    aria-expanded={isOpen}
                    className="flex-1 text-left after:absolute after:inset-0 after:content-['']"
                  >
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color }}>
                      {String(i + 1).padStart(2, "0")} · {label}
                    </div>
                    <div className="mt-1 font-display text-lg font-medium">{s.name}</div>
                    <div className="text-[12.5px] text-mute">{s.org}</div>
                  </button>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 rounded-full border border-line p-1.5 text-mute transition hover:border-line-strong hover:text-ink"
                    aria-label={`Open ${s.name}`}
                  >
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative overflow-hidden"
                    >
                      <div className="pt-3 text-[13px] text-mute">{s.setting}</div>
                      <p className="pt-2 text-[15px] leading-relaxed text-ink/90">{s.finding}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </WidgetFrame>
  );
}
