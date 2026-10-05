import { motion } from "motion/react";
import { ODYSSEUS } from "@/content/data";
import type { OdysseusFeature } from "@/content/types";
import { WidgetFrame } from "@/ui/Panel";

const VERDICT: Record<OdysseusFeature["verdict"], { label: string; color: string }> = {
  demo: { label: "Strong example", color: "#0072b2" },
  counter: { label: "Counterexample", color: "#a94400" },
  neutral: { label: "Supporting", color: "#5b616e" },
};

export function OdysseusGrid() {
  return (
    <WidgetFrame title="Odysseus, feature by feature" hint="What each part does, and where it lands relative to the workflow thesis.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ODYSSEUS.map((f, i) => {
          const v = VERDICT[f.verdict];
          return (
            <motion.div
              key={f.feature}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-4"
            >
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-1" style={{ background: v.color, boxShadow: `0 0 18px ${v.color}` }} />
              <div className="mb-2 inline-flex w-fit rounded-full px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ background: `${v.color}1f`, color: v.color }}>
                {v.label}
              </div>
              <div className="font-display text-lg">{f.feature}</div>
              <p className="mt-1 text-[13px] text-mute">{f.does}</p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/85">{f.fit}</p>
            </motion.div>
          );
        })}
      </div>
    </WidgetFrame>
  );
}
