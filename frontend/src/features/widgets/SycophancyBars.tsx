import { motion } from "motion/react";
import { WidgetFrame } from "@/ui/Panel";

const ROWS = [
  { model: "Gemini 2.5 Pro", delta: 45, color: "#0072b2" },
  { model: "Claude Sonnet 4", delta: 33, color: "#0072b2" },
  { model: "GPT-4.1 Mini", delta: 16, color: "#0072b2" },
  { model: "GPT 5.1", delta: 0, color: "#5b616e", note: "no significant change" },
];

export function SycophancyBars() {
  return (
    <WidgetFrame title="Memory profiles make models agree with you" hint="Rise in agreement sycophancy with condensed user-memory profiles (CHI 2026, 38 people, two weeks).">
      <div className="space-y-4">
        {ROWS.map((r, i) => (
          <div key={r.model} className="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 sm:grid-cols-[10rem_1fr_4rem]">
            <span className="text-[13.5px]">{r.model}</span>
            <div className="relative h-7 overflow-hidden rounded-full bg-surface">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(r.delta / 50) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 70, damping: 16 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${r.color}55, ${r.color})`, boxShadow: `0 0 24px ${r.color}66` }}
              />
              {r.note ? <span className="absolute inset-y-0 left-3 flex items-center text-[11.5px] text-mute">{r.note}</span> : null}
            </div>
            <span className="text-right font-mono text-[15px] tabular-nums" style={{ color: r.color }}>
              {r.delta ? `+${r.delta}%` : "n.s."}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-mute">
        WRITER's MIST benchmark points at the <span className="text-ink">extraction step</span>: swapping extracted snippets for raw history roughly halved sycophancy, and a prose summary was the strongest mitigation.
      </p>
    </WidgetFrame>
  );
}
