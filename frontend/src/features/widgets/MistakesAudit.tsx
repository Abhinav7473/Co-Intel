import { useState } from "react";
import { Check, Send } from "lucide-react";
import { motion } from "motion/react";
import { MISTAKES } from "@/content/data";
import { usePoll, useSubmitPoll } from "@/hooks/usePoll";
import { Button } from "@/ui/Button";
import { WidgetFrame } from "@/ui/Panel";
import { cn } from "@/utils/cn";

export function MistakesAudit() {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);
  const summary = usePoll();
  const submit = useSubmitPoll();
  const sent = submit.isSuccess;
  const responses = summary.data?.responses ?? 0;

  const flip = (key: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <WidgetFrame
      title="Which of these did you do this month?"
      hint={`${responses} anonymous response${responses === 1 ? "" : "s"} so far. Tap the text to see why it backfires.`}
      actions={
        <Button
          tone="solid"
          size="sm"
          icon={sent ? <Check className="size-3.5" /> : <Send className="size-3.5" />}
          disabled={sent || submit.isPending}
          onClick={() => submit.mutate([...picked])}
        >
          {sent ? "Submitted" : `Submit ${picked.size}`}
        </Button>
      }
    >
      <ol className="grid gap-2 lg:grid-cols-2">
        {MISTAKES.map((m, i) => {
          const on = picked.has(m.key);
          const n = summary.data?.counts[m.key] ?? 0;
          const share = responses ? n / responses : 0;
          const isOpen = open === m.key;
          return (
            <li
              key={m.key}
              className={cn(
                "relative overflow-hidden rounded-2xl border transition-colors duration-300",
                on ? "border-warn/45 bg-warn/[0.07]" : "border-line bg-surface",
              )}
            >
              {/* pooled answers as a background fill */}
              <motion.div
                aria-hidden
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/15 to-transparent"
                animate={{ width: `${share * 100}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              />
              <div className="relative flex items-start gap-3 p-3.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  aria-label={`I did: ${m.mistake}`}
                  disabled={sent}
                  onClick={() => flip(m.key)}
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition duration-300 ease-spring",
                    on ? "scale-110 border-warn bg-warn text-ink" : "border-line-strong hover:border-line-strong",
                  )}
                >
                  {on ? <Check className="size-3.5" strokeWidth={3} /> : null}
                </button>
                <button type="button" onClick={() => setOpen(isOpen ? null : m.key)} aria-expanded={isOpen} className="min-w-0 flex-1 text-left">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[14.5px]">
                      <span className="mr-2 font-mono text-[11px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                      {m.mistake}
                    </span>
                    {responses ? <span className="shrink-0 font-mono text-[12px] tabular-nums text-accent">{Math.round(share * 100)}%</span> : null}
                  </div>
                  <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden">
                    <div className="grid gap-3 pt-3 text-[13px] sm:grid-cols-3">
                      <Field label="Why it backfires" value={m.why} />
                      <Field label="Replace with" value={m.replace} accent />
                      <Field label="Evidence" value={m.evidence} />
                    </div>
                  </motion.div>
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      {submit.isError ? <p role="status" aria-live="polite" className="mt-3 text-[12.5px] text-warn">{submit.error.message}</p> : null}
    </WidgetFrame>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-mute">{label}</div>
      <div className={accent ? "text-accent" : "text-ink/85"}>{value}</div>
    </div>
  );
}
