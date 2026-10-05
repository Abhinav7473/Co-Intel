import { useState } from "react";
import { motion } from "motion/react";
import { Chip, WidgetFrame } from "@/ui/Panel";
import { Slider } from "@/ui/Slider";
import { fmtTokens } from "@/utils/tones";

/** Anthropic: 5 servers / 58 tools ≈ 55k tokens up front → ~11k per server on average. */
const PER_SERVER = 55_000 / 5;
const WINDOW = 200_000;

const MODES = [
  { key: "all", label: "All definitions loaded", factor: 1, color: "#a94400" },
  { key: "search", label: "Tool search (−85%)", factor: 0.15, color: "#0072b2" },
  { key: "code", label: "Code execution (−98.7%)", factor: 0.013, color: "#0072b2" },
] as const;

export function ToolOverhead() {
  const [servers, setServers] = useState(5);
  const [mode, setMode] = useState<(typeof MODES)[number]["key"]>("all");
  const m = MODES.find((x) => x.key === mode)!;
  const tokens = servers * PER_SERVER * m.factor;
  const pct = Math.min(100, (tokens / WINDOW) * 100);

  return (
    <WidgetFrame title="The bill before your first message" hint="Estimate scaled from Anthropic's 5-server / 58-tool / ~55k-token measurement.">
      <Slider label="Connected MCP servers" value={servers} min={0} max={14} onChange={setServers} color={m.color} />
      <div className="mt-4 flex flex-wrap gap-2">
        {MODES.map((x) => (
          <Chip key={x.key} active={mode === x.key} onClick={() => setMode(x.key)} color={x.color}>
            {x.label}
          </Chip>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div>
          <motion.div key={`${mode}${servers}`} initial={{ scale: 0.9, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-6xl font-semibold tabular-nums" style={{ color: m.color }}>
            {fmtTokens(tokens)}
          </motion.div>
          <div className="text-[13px] text-mute">tokens of tool definitions, every session</div>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between font-mono text-[11px] text-mute">
            <span>context window (200k)</span>
            <span>{pct.toFixed(1)}% gone</span>
          </div>
          <div className="relative h-10 overflow-hidden rounded-xl border border-line bg-surface">
            <motion.div
              className="h-full"
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              style={{ background: `repeating-linear-gradient(135deg, ${m.color}cc 0 8px, ${m.color}88 8px 16px)` }}
            />
          </div>
          <p className="mt-2 text-[12.5px] text-mute">
            Anthropic has seen setups where definitions alone took <span className="text-ink">134k</span>.
            {mode === "code" ? " Code execution also adds a sandbox you now have to secure." : ""}
          </p>
        </div>
      </div>
    </WidgetFrame>
  );
}
