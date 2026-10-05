import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Chip, WidgetFrame } from "@/ui/Panel";
import { Slider } from "@/ui/Slider";
import { Toggle } from "@/ui/Toggle";
import { fmtTokens, fmtUsd } from "@/utils/tones";

const READ = 0.1; // cache reads ≈ 10% of base input price
const WRITE = { "5m": 1.25, "1h": 2 } as const;

interface Turn {
  kind: "write" | "read";
  cost: number;
}

export function CacheCalculator() {
  const [prefix, setPrefix] = useState(30_000);
  const [turns, setTurns] = useState(40);
  const [price, setPrice] = useState(3);
  const [ttl, setTtl] = useState<keyof typeof WRITE>("5m");
  const [midEdit, setMidEdit] = useState(true);

  const { series, cached, uncached } = useMemo(() => {
    const base = (prefix / 1_000_000) * price;
    const editAt = midEdit ? Math.max(1, Math.floor(turns / 2)) : -1;
    const series: Turn[] = Array.from({ length: turns }, (_, i) =>
      i === 0 || i === editAt ? { kind: "write", cost: base * WRITE[ttl] } : { kind: "read", cost: base * READ },
    );
    return {
      series,
      cached: series.reduce((a, t) => a + t.cost, 0),
      uncached: base * turns,
    };
  }, [prefix, turns, price, ttl, midEdit]);

  const max = Math.max(...series.map((t) => t.cost));
  const saved = uncached > 0 ? 1 - cached / uncached : 0;

  return (
    <WidgetFrame title="What the prefix really costs" hint="Prefix tokens only (system prompt + memory + tools), resent each turn. Price is an editable assumption.">
      <div className="grid gap-5 sm:grid-cols-3">
        <Slider label="Prefix size" value={prefix} min={2_000} max={150_000} step={1_000} onChange={setPrefix} format={fmtTokens} />
        <Slider label="Turns in session" value={turns} min={2} max={120} onChange={setTurns} />
        <Slider label="Input price / Mtok" value={price} min={0.25} max={15} step={0.25} onChange={setPrice} format={(v) => `$${v.toFixed(2)}`} color="#0072b2" />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Chip active={ttl === "5m"} onClick={() => setTtl("5m")}>5-min cache · write 1.25×</Chip>
        <Chip active={ttl === "1h"} onClick={() => setTtl("1h")}>1-hour cache · write 2×</Chip>
        <label className="ml-auto flex items-center gap-3 text-[13px] text-mute">
          Edit CLAUDE.md mid-session
          <Toggle label="Edit memory mid-session" checked={midEdit} onChange={setMidEdit} warn />
        </label>
      </div>

      <div className="mt-6 flex h-28 items-end gap-[2px] rounded-2xl border border-line bg-sunken p-3" aria-hidden>
        {series.map((t, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm"
            initial={false}
            animate={{ height: `${Math.max(3, (t.cost / max) * 100)}%` }}
            style={{ background: t.kind === "write" ? "#a94400" : "#0072b2", opacity: t.kind === "write" ? 1 : 0.7 }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-4 font-mono text-[11px] text-mute">
        <span><span className="text-warn">■</span> cache write</span>
        <span><span className="text-accent">■</span> cache read</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Without caching" value={fmtUsd(uncached)} />
        <Stat label="With caching" value={fmtUsd(cached)} accent="#0072b2" />
        <Stat label="Saved" value={`${Math.round(saved * 100)}%`} accent="#0072b2" />
      </div>
    </WidgetFrame>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="text-[12px] uppercase tracking-[0.12em] text-mute">{label}</div>
      <div className="mt-1 font-display text-3xl tabular-nums" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}
