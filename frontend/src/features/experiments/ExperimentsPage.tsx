import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, FlaskConical } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SECTION_BY_SLUG } from "@/content/brief";
import { TEMPLATES, type Template } from "@/content/experiments";
import { useCreateExperiment, useExperiments } from "@/hooks/useExperiments";
import { Page } from "@/shell/AppShell";
import { Button } from "@/ui/Button";
import { Panel } from "@/ui/Panel";
import { Spotlight } from "@/ui/Spotlight";

const input = "w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[14px] outline-none focus:border-accent focus:ring-4 focus:ring-accent/10";

export function ExperimentsPage() {
  const { data: experiments = [] } = useExperiments();
  const [picked, setPicked] = useState<Template | null>(null);

  return (
    <Page
      eyebrow="Experiments"
      title="Test the claims on your own work"
      lead="The topics cite other people's studies. These templates turn each claim into an A/B you can run in an afternoon. Log every run; the comparison updates as you go."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <Spotlight key={t.key} className="card rounded-[18px]">
            <button type="button" onClick={() => setPicked(t)} className="relative flex h-full w-full flex-col p-5 text-left">
              <span className="mb-2 text-[12px] text-mute">{SECTION_BY_SLUG[t.topic]?.title}</span>
              <span className="font-display text-xl tracking-tight">{t.title}</span>
              <span className="mt-2 flex-1 text-[13.5px] text-mute">{t.hypothesis || "Define your own A and B."}</span>
              <span className="mt-4 flex items-center gap-2 text-[12.5px]">
                <span className="rounded-md bg-series-b/20 px-2 py-0.5">A · {t.a}</span>
                <span className="rounded-md bg-accent-soft px-2 py-0.5 text-accent">B · {t.b}</span>
              </span>
            </button>
          </Spotlight>
        ))}
      </div>

      <AnimatePresence>{picked ? <CreateForm key={picked.key} template={picked} onCancel={() => setPicked(null)} /> : null}</AnimatePresence>

      <section className="mt-14">
        <h2 className="mb-4 font-display text-2xl tracking-tight">Your experiments</h2>
        {experiments.length === 0 ? (
          <Panel className="p-8 text-center text-mute">None yet. Pick a template above.</Panel>
        ) : (
          <ul className="grid gap-2 md:grid-cols-2">
            {experiments.map((e) => (
              <li key={e.id}>
                <Link to="/experiments/$id" params={{ id: e.id }} className="card group flex items-center gap-4 rounded-[14px] p-4 transition hover:border-line-strong">
                  <FlaskConical className="size-5 text-accent" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{e.title}</span>
                    <span className="text-[12.5px] text-mute">
                      {e.variant_a} vs {e.variant_b} · {e.run_count} run{e.run_count === 1 ? "" : "s"}
                    </span>
                  </span>
                  <ArrowRight className="size-4 text-mute transition group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Page>
  );
}

function CreateForm({ template, onCancel }: { template: Template; onCancel: () => void }) {
  const [title, setTitle] = useState(template.title);
  const [hypothesis, setHypothesis] = useState(template.hypothesis);
  const [a, setA] = useState(template.a);
  const [b, setB] = useState(template.b);
  const create = useCreateExperiment();
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="mt-6">
      <Panel className="p-6">
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate(
              { title, template: template.key, hypothesis, variant_a: a, variant_b: b },
              { onSuccess: (exp) => navigate({ to: "/experiments/$id", params: { id: exp.id } }) },
            );
          }}
        >
          <label className="md:col-span-2">
            <span className="mb-1 block text-[13px] text-mute">Title</span>
            <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-[13px] text-mute">Hypothesis</span>
            <textarea className={`${input} min-h-20`} value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} maxLength={2000} />
          </label>
          <label>
            <span className="mb-1 block text-[13px] text-mute">Variant A</span>
            <input className={input} value={a} onChange={(e) => setA(e.target.value)} maxLength={60} required />
          </label>
          <label>
            <span className="mb-1 block text-[13px] text-mute">Variant B</span>
            <input className={input} value={b} onChange={(e) => setB(e.target.value)} maxLength={60} required />
          </label>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button tone="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" tone="solid" disabled={create.isPending}>
              Create experiment
            </Button>
          </div>
          {create.isError ? <p className="text-[12.5px] text-warn md:col-span-2">{create.error.message}</p> : null}
        </form>
      </Panel>
    </motion.div>
  );
}
