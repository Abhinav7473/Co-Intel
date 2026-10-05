import type { Run } from "@/api/types";
import { METRICS, type Metric } from "@/content/experiments";

export interface MetricComparison {
  metric: Metric;
  a: { mean: number; n: number } | null;
  b: { mean: number; n: number } | null;
  /** relative change B vs A, signed so positive = B is better */
  gain: number | null;
}

const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;

/** Mean per variant per metric; `gain` respects whether lower or higher is better. */
export function compareRuns(runs: Run[], metrics: Metric[]): MetricComparison[] {
  return metrics.map((m) => {
    const pick = (v: "A" | "B") => runs.filter((r) => r.variant === v && r[m] !== null).map((r) => r[m] as number);
    const xa = pick("A");
    const xb = pick("B");
    const a = xa.length ? { mean: mean(xa), n: xa.length } : null;
    const b = xb.length ? { mean: mean(xb), n: xb.length } : null;
    let gain: number | null = null;
    if (a && b && a.mean !== 0) {
      const rel = (b.mean - a.mean) / Math.abs(a.mean);
      gain = METRICS[m].better === "lower" ? -rel : rel;
    }
    return { metric: m, a, b, gain };
  });
}

/** One honest sentence about what the data does (and doesn't) say yet. */
export function verdict(rows: MetricComparison[], labelB: string): string {
  const both = rows.filter((r) => r.a && r.b);
  if (!both.length) return "Log runs for both variants to compare.";
  const minN = Math.min(...both.flatMap((r) => [r.a!.n, r.b!.n]));
  const wins = both.filter((r) => (r.gain ?? 0) > 0.05).length;
  const losses = both.filter((r) => (r.gain ?? 0) < -0.05).length;
  const lead = `${labelB} is better on ${wins} of ${both.length} metric${both.length === 1 ? "" : "s"}${losses ? `, worse on ${losses}` : ""}.`;
  return minN < 3 ? `${lead} Only ${minN} run${minN === 1 ? "" : "s"} per variant so far — treat as a hint, not a result.` : lead;
}
