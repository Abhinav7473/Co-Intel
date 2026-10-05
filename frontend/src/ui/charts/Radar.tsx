import { motion } from "motion/react";

export interface RadarAxis {
  key: string;
  label: string;
}

/**
 * Radar of 0..100 scores. `current` is filled accent; `previous` (optional)
 * is a dashed orange outline so change over time is visible at a glance.
 */
export function Radar({
  axes,
  current,
  previous,
  size = 360,
}: {
  axes: RadarAxis[];
  current: Record<string, number>;
  previous?: Record<string, number>;
  size?: number;
}) {
  const c = 50;
  const R = 34;
  const n = axes.length;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * R * (v / 100), c + Math.sin(a) * R * (v / 100)] as const;
  };
  const poly = (scores: Record<string, number>) => axes.map((ax, i) => pt(i, scores[ax.key] ?? 0).join(",")).join(" ");

  return (
    <svg viewBox="0 0 100 100" width="100%" style={{ maxWidth: size }} role="img" aria-label="Scores by topic">
      {[25, 50, 75, 100].map((ring) => (
        <polygon key={ring} points={axes.map((_, i) => pt(i, ring).join(",")).join(" ")} fill="none" stroke="rgb(22 24 29 / 0.08)" strokeWidth="0.3" />
      ))}
      {axes.map((ax, i) => {
        const [x, y] = pt(i, 100);
        const [lx, ly] = pt(i, 122);
        return (
          <g key={ax.key}>
            <line x1={c} y1={c} x2={x} y2={y} stroke="rgb(22 24 29 / 0.08)" strokeWidth="0.3" />
            <text x={lx} y={ly} fontSize="3" textAnchor="middle" dominantBaseline="middle" fill="var(--color-mute)">
              {ax.label}
            </text>
          </g>
        );
      })}
      {previous ? (
        <polygon points={poly(previous)} fill="none" stroke="var(--color-series-b)" strokeWidth="0.6" strokeDasharray="1.5 1" />
      ) : null}
      <motion.polygon
        key={poly(current)}
        points={poly(current)}
        fill="rgb(0 114 178 / 0.16)"
        stroke="var(--color-accent)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ transformOrigin: "50% 50%" }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      />
    </svg>
  );
}
