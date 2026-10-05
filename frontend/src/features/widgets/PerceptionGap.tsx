import { useState } from "react";
import { motion } from "motion/react";
import { WidgetFrame } from "@/ui/Panel";
import { Slider } from "@/ui/Slider";

/** Axis = change in task time. Negative = faster. */
const MIN = -60;
const MAX = 60;
const pos = (v: number) => `${((v - MIN) / (MAX - MIN)) * 100}%`;

const SKILL = [
  { label: "Hand-coded", lo: 67, hi: 67, color: "#0072b2" },
  { label: "AI group (avg)", lo: 50, hi: 50, color: "#0072b2" },
  { label: "Delegation / “fix it for me”", lo: 0, hi: 40, color: "#a94400", under: true },
  { label: "AI used for explanation", lo: 65, hi: 86, color: "#0072b2" },
];

export function PerceptionGap() {
  const [feel, setFeel] = useState(20);
  const gap = Math.abs(19 + feel);

  return (
    <WidgetFrame title="Feeling vs. measurement" hint="How much faster do you feel with AI? METR's developers said ~20%.">
      <Slider label="I feel faster by" value={feel} min={-20} max={60} onChange={setFeel} format={(v) => `${v > 0 ? "+" : ""}${v}%`} color="#0072b2" />

      <div className="relative mt-10 h-24">
        <div className="absolute inset-x-0 top-10 h-px bg-ink/20" />
        <div className="absolute top-10 h-3 -translate-y-1/2 rounded-full bg-warn/25" style={{ left: pos(2), width: `calc(${pos(39)} - ${pos(2)})` }} title="95% CI" />
        <div className="absolute top-10 h-8 w-px -translate-y-1/2 bg-ink/30" style={{ left: pos(0) }} />
        <span className="absolute top-[3.6rem] -translate-x-1/2 font-mono text-[10.5px] text-mute" style={{ left: pos(0) }}>
          no change
        </span>
        <Marker at={-feel} color="#0072b2" label={`you: ${feel > 0 ? `${feel}% faster` : `${-feel}% slower`}`} up />
        <Marker at={19} color="#a94400" label="measured: 19% slower" />
        <span className="absolute bottom-0 left-0 font-mono text-[10.5px] text-mute">← faster</span>
        <span className="absolute bottom-0 right-0 font-mono text-[10.5px] text-mute">slower →</span>
      </div>

      <div className="mt-2 text-center">
        <span className="font-display text-4xl tabular-nums text-accent">{gap}</span>
        <span className="ml-2 text-mute">point gap between feeling and stopwatch</span>
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <div className="mb-4 text-[13px] text-mute">Anthropic skill-formation RCT — follow-up quiz score</div>
        <div className="space-y-3">
          {SKILL.map((s, i) => (
            <div key={s.label} className="grid grid-cols-[10rem_1fr_4rem] items-center gap-3 text-[13px] sm:grid-cols-[13rem_1fr_4rem]">
              <span>{s.label}</span>
              <div className="relative h-5 rounded-full bg-surface">
                <motion.div
                  className="absolute inset-y-0 rounded-full"
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    left: `${s.lo === s.hi ? 0 : s.lo}%`,
                    width: `${s.hi - (s.lo === s.hi ? 0 : s.lo)}%`,
                    transformOrigin: "left",
                    background: s.under ? `repeating-linear-gradient(135deg, ${s.color} 0 6px, ${s.color}66 6px 12px)` : s.color,
                  }}
                />
              </div>
              <span className="text-right font-mono tabular-nums" style={{ color: s.color }}>
                {s.under ? "<40%" : s.lo === s.hi ? `${s.lo}%` : `${s.lo}–${s.hi}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </WidgetFrame>
  );
}

function Marker({ at, color, label, up }: { at: number; color: string; label: string; up?: boolean }) {
  return (
    <motion.div className="absolute top-10" animate={{ left: pos(Math.max(MIN, Math.min(MAX, at))) }} transition={{ type: "spring", stiffness: 200, damping: 22 }}>
      <span className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: color, boxShadow: `0 0 16px ${color}` }} />
      <span
        className={`absolute -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-medium ${up ? "-top-9" : "top-4"}`}
        style={{ background: `${color}26`, color }}
      >
        {label}
      </span>
    </motion.div>
  );
}
