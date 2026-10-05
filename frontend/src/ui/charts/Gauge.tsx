import { motion } from "motion/react";

interface GaugeProps {
  /** 0..100 */
  value: number;
  label?: string;
  size?: number;
  /** below this the arc turns warn-coloured */
  warnBelow?: number;
  /** text in the centre; defaults to the value */
  center?: string;
}

/** 270° arc gauge. The arc draws with Motion's `pathLength`, so value changes animate. */
export function Gauge({ value, label, size = 140, warnBelow, center }: GaugeProps) {
  const r = 42;
  const v = Math.max(0, Math.min(100, value)) / 100;
  const arc = describeArc(50, 50, r, 225, 225 + 270);
  const color = warnBelow !== undefined && value < warnBelow ? "var(--color-warn)" : "var(--color-accent)";

  return (
    <figure className="relative inline-flex flex-col items-center" style={{ width: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`${label ?? "Score"}: ${Math.round(value)} of 100`}>
        <path d={arc} fill="none" stroke="rgb(22 24 29 / 0.08)" strokeWidth="9" strokeLinecap="round" />
        <motion.path
          d={arc}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: v }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        />
      </svg>
      <div className="absolute inset-x-0 top-[38%] text-center">
        <motion.div
          key={Math.round(value)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-[clamp(1.6rem,4vw,2.25rem)] font-semibold leading-none tabular-nums"
          style={{ color }}
        >
          {center ?? Math.round(value)}
        </motion.div>
      </div>
      {label ? <figcaption className="-mt-3 text-[12px] text-mute">{label}</figcaption> : null}
    </figure>
  );
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Clockwise arc from `start` to `end` degrees (0° = 12 o'clock), so pathLength fills left → right. */
function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}
