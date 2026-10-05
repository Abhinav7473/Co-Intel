import { motion } from "motion/react";
import { WidgetFrame } from "@/ui/Panel";

/** Anthropic skill-formation RCT (2026): quiz without AI after learning a new Python library. */
const ROWS = [
  { label: "Learned by hand", detail: "no AI at all", lo: 0, hi: 67, text: "67%" },
  { label: "Learned with AI", detail: "average of everyone who had AI", lo: 0, hi: 50, text: "50%" },
  { label: "Let the AI do it", detail: "“fix it for me”, pasted the answer", lo: 0, hi: 40, text: "under 40%", weak: true },
  { label: "Asked the AI to explain", detail: "then wrote the code themselves", lo: 65, hi: 86, text: "65–86%" },
] as const;

export function LearningQuiz() {
  return (
    <WidgetFrame title="Quiz scores, by how people used the AI">
      <div className="space-y-4">
        {ROWS.map((r, i) => (
          <div key={r.label} className="grid grid-cols-[minmax(0,11rem)_1fr_5.5rem] items-center gap-3 text-[13.5px] sm:grid-cols-[14rem_1fr_5.5rem]">
            <span>
              <span className="block font-medium">{r.label}</span>
              <span className="block text-[12px] text-mute">{r.detail}</span>
            </span>
            <div className="relative h-5 rounded-full bg-sunken">
              <motion.div
                className="absolute inset-y-0 rounded-full"
                initial={{ opacity: 0, scaleX: 0.6 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                style={{
                  left: `${r.lo}%`,
                  width: `${r.hi - r.lo}%`,
                  transformOrigin: "left",
                  background: "weak" in r ? "repeating-linear-gradient(135deg, var(--color-warn) 0 6px, var(--color-warn-soft) 6px 12px)" : "var(--color-accent)",
                }}
              />
            </div>
            <span className={`text-right font-mono tabular-nums ${"weak" in r ? "text-warn" : "text-accent"}`}>{r.text}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-mute">
        A range bar means the study reports a range across several ways of using the AI, not one number. Scale: 0–100% on the quiz.
      </p>
    </WidgetFrame>
  );
}
