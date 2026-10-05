import { Check } from "lucide-react";
import { motion } from "motion/react";
import { GUARDRAILS } from "@/content/data";
import { useChecklist, useToggleChecklist } from "@/hooks/useChecklist";
import { WidgetFrame } from "@/ui/Panel";
import { cn } from "@/utils/cn";

export function GuardrailChecklist() {
  const { data: done = new Set<string>() } = useChecklist();
  const toggle = useToggleChecklist();
  const n = GUARDRAILS.filter((g) => done.has(g.key)).length;
  const pct = n / GUARDRAILS.length;
  const C = 2 * Math.PI * 26;

  return (
    <WidgetFrame
      title="Habits you actually keep"
      hint="Tick what's already true for your setup. Saved."
      actions={
        <div className="relative size-16">
          <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgb(22 24 29 / 0.08)" strokeWidth="6" />
            <motion.circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="#0072b2"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              animate={{ strokeDashoffset: C * (1 - pct) }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[13px]">
            {n}/{GUARDRAILS.length}
          </span>
        </div>
      }
    >
      <ul className="space-y-2">
        {GUARDRAILS.map((g) => {
          const on = done.has(g.key);
          return (
            <li key={g.key}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle.mutate({ key: g.key, done: !on })}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition duration-300",
                  on ? "border-accent/35 bg-accent/[0.07]" : "border-line bg-surface hover:border-line-strong",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition duration-300 ease-spring",
                    on ? "scale-110 border-accent bg-accent text-canvas" : "border-line-strong",
                  )}
                >
                  {on ? <Check className="size-3.5" strokeWidth={3} /> : null}
                </span>
                <span className={cn("text-[14.5px] leading-relaxed", on ? "text-ink" : "text-ink/80")}>{g.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {toggle.isError ? <p className="mt-3 text-[12.5px] text-warn">{toggle.error.message}</p> : null}
    </WidgetFrame>
  );
}
