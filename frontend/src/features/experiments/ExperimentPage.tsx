import { useState } from "react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { RunInput } from "@/api/types";
import { METRICS, TEMPLATE_BY_KEY, TEMPLATES, type Metric } from "@/content/experiments";
import { useAddRun, useDeleteExperiment, useDeleteRun, useExperiment } from "@/hooks/useExperiments";
import { Page } from "@/shell/AppShell";
import { Button } from "@/ui/Button";
import { Panel } from "@/ui/Panel";
import { Segmented } from "@/ui/Segmented";
import { cn } from "@/utils/cn";
import { compareRuns, verdict } from "./compare";

const route = getRouteApi("/experiments/$id");
const fmt = (m: Metric, v: number) => (m === "cost" ? `$${v.toFixed(2)}` : m === "tokens" ? Math.round(v).toLocaleString() : v.toFixed(1));

export function ExperimentPage() {
  const { id } = route.useParams();
  const { data: exp } = useExperiment(id);
  const del = useDeleteExperiment();
  const navigate = useNavigate();
  if (!exp) return null;

  const template = TEMPLATE_BY_KEY[exp.template] ?? TEMPLATES.at(-1)!;
  const rows = compareRuns(exp.runs, template.metrics);

  return (
    <Page
      eyebrow={`Experiment · ${template.title}`}
      title={exp.title}
      lead={exp.hypothesis || undefined}
      actions={
        <Button tone="danger" icon={<Trash2 className="size-4" />} onClick={() => del.mutate(id, { onSuccess: () => navigate({ to: "/experiments" }) })}>
          Delete
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel className="p-6">
            <div className="mb-1 font-mono text-[12px] uppercase tracking-[0.14em] text-accent">Result so far</div>
            <p className="mb-6 font-display text-2xl leading-snug tracking-tight">{verdict(rows, exp.variant_b)}</p>
            <div className="mb-4 flex gap-4 text-[12.5px] text-mute">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-series-b" /> A · {exp.variant_a}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-accent" /> B · {exp.variant_b}
              </span>
            </div>
            <div className="space-y-5">
              {rows.map((r) => {
                const max = Math.max(r.a?.mean ?? 0, r.b?.mean ?? 0, 1e-9);
                const meta = METRICS[r.metric];
                return (
                  <div key={r.metric}>
                    <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                      <span>
                        {meta.label} <span className="text-mute">({meta.better} is better)</span>
                      </span>
                      {r.gain !== null ? (
                        <span className={cn("font-mono font-medium", r.gain >= 0 ? "text-accent" : "text-warn")}>
                          B {r.gain >= 0 ? "better" : "worse"} by {Math.abs(Math.round(r.gain * 100))}%
                        </span>
                      ) : (
                        <span className="text-mute">needs both</span>
                      )}
                    </div>
                    {(["a", "b"] as const).map((v) => {
                      const d = r[v];
                      return (
                        <div key={v} className="mb-1 grid grid-cols-[1fr_6rem] items-center gap-3">
                          <div className="h-4 rounded-[4px] bg-ink/[0.05]">
                            <motion.div
                              className={cn("h-full rounded-[4px]", v === "a" ? "bg-series-b" : "bg-accent")}
                              initial={{ width: 0 }}
                              animate={{ width: d ? `${(d.mean / max) * 100}%` : 0 }}
                              transition={{ type: "spring", stiffness: 120, damping: 20 }}
                            />
                          </div>
                          <span className="text-right font-mono text-[12.5px] tabular-nums">{d ? `${fmt(r.metric, d.mean)} · n=${d.n}` : "—"}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-6">
            <h2 className="mb-4 font-display text-xl tracking-tight">Runs</h2>
            {exp.runs.length === 0 ? <p className="text-mute">No runs yet. Log one with the form.</p> : <RunTable experimentId={id} metrics={template.metrics} />}
          </Panel>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <RunForm experimentId={id} metrics={template.metrics} labelA={exp.variant_a} labelB={exp.variant_b} qualityMeans={template.qualityMeans} />
          <Panel className="p-6">
            <h3 className="mb-3 font-medium">How to run it</h3>
            <ol className="space-y-2">
              {template.protocol.map((p, i) => (
                <li key={p} className="flex gap-3 text-[14px]">
                  <span className="font-mono text-accent">{i + 1}</span>
                  {p}
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </Page>
  );
}

function RunForm({ experimentId, metrics, labelA, labelB, qualityMeans }: { experimentId: string; metrics: Metric[]; labelA: string; labelB: string; qualityMeans?: string }) {
  const [variant, setVariant] = useState<"A" | "B">("A");
  const [values, setValues] = useState<Partial<Record<Metric, string>>>({});
  const [note, setNote] = useState("");
  const add = useAddRun(experimentId);
  const filled = metrics.some((m) => values[m]);

  const submit = () => {
    const num = (m: Metric) => (values[m] ? Number(values[m]) : null);
    const run: RunInput = {
      variant,
      tokens: num("tokens"),
      cost: num("cost"),
      minutes: num("minutes"),
      corrections: num("corrections"),
      quality: num("quality"),
      note: note.trim(),
    };
    add.mutate(run, {
      onSuccess: () => {
        setValues({});
        setNote("");
      },
    });
  };

  return (
    <Panel className="p-6">
      <h3 className="mb-4 font-medium">Log a run</h3>
      <Segmented
        label="Variant"
        value={variant}
        onChange={setVariant}
        options={[
          { value: "A", label: `A · ${labelA}`, dot: "var(--color-series-b)" },
          { value: "B", label: `B · ${labelB}`, dot: "var(--color-accent)" },
        ]}
      />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <label key={m} className={m === "quality" && qualityMeans ? "col-span-2" : undefined}>
            <span className="mb-1 block text-[12.5px] text-mute">
              {METRICS[m].label}
              {m === "quality" && qualityMeans ? ` — ${qualityMeans}` : ""}
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={m === "quality" ? 1 : 0}
              max={m === "quality" ? 5 : undefined}
              step={METRICS[m].step}
              value={values[m] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [m]: e.target.value }))}
              className="h-10 w-full rounded-[10px] border border-line bg-surface px-3 font-mono text-[14px] outline-none focus:border-accent"
            />
          </label>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={2000}
        placeholder="What happened (optional)"
        className="mt-3 min-h-16 w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[14px] outline-none focus:border-accent"
      />
      <Button tone="solid" className="mt-3 w-full justify-center" icon={<Plus className="size-4" />} disabled={!filled || add.isPending} onClick={submit}>
        Add run to {variant}
      </Button>
      {add.isError ? <p className="mt-2 text-[12.5px] text-warn">{add.error.message}</p> : null}
    </Panel>
  );
}

function RunTable({ experimentId, metrics }: { experimentId: string; metrics: Metric[] }) {
  const { data: exp } = useExperiment(experimentId);
  const del = useDeleteRun(experimentId);
  if (!exp) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-line text-left text-mute">
            <th className="py-2 pr-3 font-normal">Variant</th>
            {metrics.map((m) => (
              <th key={m} className="py-2 pr-3 text-right font-normal">
                {METRICS[m].label}
              </th>
            ))}
            <th className="py-2 font-normal">Note</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {exp.runs.map((r) => (
              <motion.tr key={r.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group border-b border-line last:border-0">
                <td className="py-2 pr-3">
                  <span className={cn("inline-block rounded-md px-1.5 font-mono", r.variant === "A" ? "bg-series-b/20" : "bg-accent-soft text-accent")}>{r.variant}</span>
                </td>
                {metrics.map((m) => (
                  <td key={m} className="py-2 pr-3 text-right font-mono tabular-nums">
                    {r[m] === null ? "—" : fmt(m, r[m])}
                  </td>
                ))}
                <td className="max-w-48 truncate py-2 text-mute">{r.note}</td>
                <td className="py-2 text-right">
                  <button type="button" aria-label="Delete run" onClick={() => del.mutate(r.id)} className="rounded p-1 text-mute opacity-0 transition hover:text-warn group-hover:opacity-100">
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
