import { motion } from "motion/react";
import { cn } from "@/utils/cn";

export interface BarDatum {
  label: string;
  value: number;
  /** draw a range instead of a single bar (e.g. 65–86%) */
  range?: [number, number];
  /** text shown at the end of the row; defaults to the value */
  display?: string;
  tone?: "accent" | "warn" | "mute" | "series-b";
  /** hatched = "less than" / uncertain */
  hatched?: boolean;
  note?: string;
}

const FILL = {
  accent: "var(--color-accent)",
  warn: "var(--color-warn)",
  mute: "rgb(22 24 29 / 0.28)",
  "series-b": "var(--color-series-b)",
} as const;

/** Horizontal bars with labels left and values right. Animates in when scrolled into view. */
export function Bars({ data, max, labelWidth = "10rem", className }: { data: BarDatum[]; max: number; labelWidth?: string; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {data.map((d, i) => {
        const [lo, hi] = d.range ?? [0, d.value];
        const fill = FILL[d.tone ?? "accent"];
        return (
          <div key={d.label} className="grid items-center gap-3 text-[13.5px]" style={{ gridTemplateColumns: `${labelWidth} 1fr 4.5rem` }}>
            <span className="truncate">{d.label}</span>
            <div className="relative h-6 rounded-[6px] bg-ink/[0.05]">
              <motion.div
                className="absolute inset-y-0 rounded-[6px]"
                style={{
                  left: `${(lo / max) * 100}%`,
                  width: `${((hi - lo) / max) * 100}%`,
                  transformOrigin: "left",
                  background: d.hatched ? `repeating-linear-gradient(135deg, ${fill} 0 5px, transparent 5px 10px)` : fill,
                  border: d.hatched ? `1px solid ${fill}` : undefined,
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 80, damping: 18 }}
              />
              {d.note ? <span className="absolute inset-y-0 left-2 flex items-center text-[11.5px] text-mute">{d.note}</span> : null}
            </div>
            <span className="text-right font-mono font-medium tabular-nums">{d.display ?? d.value}</span>
          </div>
        );
      })}
    </div>
  );
}
