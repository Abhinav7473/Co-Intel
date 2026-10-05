import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Save, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ASSESSED_TOPICS, QUESTIONS, scoreAnswers, SHORT_LABEL } from "@/content/assessment";
import { SECTION_BY_SLUG } from "@/content/brief";
import { useAssessments, useDeleteAssessment, useSaveAssessment } from "@/hooks/useAssessments";
import { Page } from "@/shell/AppShell";
import { Button } from "@/ui/Button";
import { Gauge } from "@/ui/charts/Gauge";
import { Radar } from "@/ui/charts/Radar";
import { Panel } from "@/ui/Panel";
import { cn } from "@/utils/cn";

const STEPS = [...ASSESSED_TOPICS, "results"] as const;
const when = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

export function AssessPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [nav, setNav] = useState({ step: 0, dir: 1 });
  const { data: history = [] } = useAssessments();
  const save = useSaveAssessment();
  const del = useDeleteAssessment();

  const go = (step: number) => setNav({ step: Math.max(0, Math.min(STEPS.length - 1, step)), dir: step > nav.step ? 1 : -1 });
  const topic = STEPS[nav.step]!;
  const answered = Object.keys(answers).length;
  const result = scoreAnswers(answers);
  const previous = history[0];

  return (
    <Page
      eyebrow="Self-assessment"
      title="How do you actually work?"
      lead={`${QUESTIONS.length} questions across ${ASSESSED_TOPICS.length} topics. Answer honestly; nothing is shared. Each low score comes with the specific fix and the topic that explains it.`}
    >
      {/* progress: one segment per topic, click to jump */}
      <div className="mb-8 flex gap-1.5">
        {STEPS.map((t, i) => {
          const qs = QUESTIONS.filter((q) => q.topic === t);
          const done = t === "results" ? answered === QUESTIONS.length : qs.every((q) => answers[q.key] !== undefined);
          return (
            <button key={t} type="button" onClick={() => go(i)} aria-label={t === "results" ? "Results" : SECTION_BY_SLUG[t]?.title} className="group flex-1 py-2">
              <span className={cn("block h-1.5 rounded-full transition-colors", i === nav.step ? "bg-ink" : done ? "bg-accent" : "bg-ink/10 group-hover:bg-ink/20")} />
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={nav.dir} initial={false}>
          <motion.div
            key={topic}
            custom={nav.dir}
            initial={{ opacity: 0, x: nav.dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: nav.dir * -60 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {topic === "results" ? (
              <Results
                result={result}
                previous={previous?.scores}
                complete={answered === QUESTIONS.length}
                saving={save.isPending}
                saved={save.isSuccess}
                onSave={() => save.mutate({ answers, scores: result.scores, overall: result.overall })}
                onRestart={() => {
                  setAnswers({});
                  save.reset();
                  go(0);
                }}
              />
            ) : (
              <TopicStep topic={topic} answers={answers} onAnswer={(k, v) => setAnswers((a) => ({ ...a, [k]: v }))} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button tone="ghost" icon={<ArrowLeft className="size-4" />} disabled={nav.step === 0} onClick={() => go(nav.step - 1)}>
          Back
        </Button>
        <span className="font-mono text-[12px] text-mute">
          {answered}/{QUESTIONS.length} answered
        </span>
        {topic !== "results" ? (
          <Button tone="solid" onClick={() => go(nav.step + 1)}>
            {nav.step === STEPS.length - 2 ? "See results" : "Next"} <ArrowRight className="size-4" />
          </Button>
        ) : (
          <span />
        )}
      </div>

      {history.length ? (
        <section className="mt-16">
          <h2 className="mb-4 font-display text-2xl tracking-tight">Your previous results</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {history.map((a, i) => {
              const older = history[i + 1];
              const delta = older ? a.overall - older.overall : null;
              return (
                <li key={a.id} className="card group flex items-center justify-between rounded-[14px] p-4">
                  <span>
                    <span className="block font-display text-2xl tabular-nums">{a.overall}</span>
                    <span className="text-[12px] text-mute">{when.format(new Date(a.created_at))}</span>
                  </span>
                  {delta !== null ? <span className={cn("font-mono text-[13px]", delta >= 0 ? "text-accent" : "text-warn")}>{delta >= 0 ? `+${delta}` : delta}</span> : null}
                  <button type="button" aria-label="Delete result" onClick={() => window.confirm("Delete this result? This can\u2019t be undone.") && del.mutate(a.id)} className="rounded-[8px] p-1.5 text-mute opacity-0 transition hover:text-warn group-hover:opacity-100">
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </Page>
  );
}

function TopicStep({ topic, answers, onAnswer }: { topic: string; answers: Record<string, number>; onAnswer: (key: string, idx: number) => void }) {
  const section = SECTION_BY_SLUG[topic];
  return (
    <div>
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-mono text-[13px] text-accent">{section?.num}</span>
        <h2 className="font-display text-3xl tracking-tight">{section?.title}</h2>
      </div>
      <div className="space-y-6">
        {QUESTIONS.filter((q) => q.topic === topic).map((q) => (
          <fieldset key={q.key}>
            <legend className="mb-3 text-lg">{q.prompt}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((o, i) => {
                const on = answers[q.key] === i;
                return (
                  <motion.button
                    key={o.label}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onAnswer(q.key, i)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 rounded-[14px] border p-4 text-left text-[15px] transition-colors",
                      on ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-line-strong",
                    )}
                  >
                    <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition", on ? "border-accent bg-accent text-white" : "border-ink/25")}>
                      {on ? <Check className="size-3" strokeWidth={3} /> : null}
                    </span>
                    {o.label}
                  </motion.button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

function Results({
  result,
  previous,
  complete,
  saving,
  saved,
  onSave,
  onRestart,
}: {
  result: ReturnType<typeof scoreAnswers>;
  previous?: Record<string, number>;
  complete: boolean;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  onRestart: () => void;
}) {
  const axes = ASSESSED_TOPICS.map((t) => ({ key: t, label: SHORT_LABEL[t] ?? t }));
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Panel className="flex flex-col items-center p-6">
        <Gauge value={result.overall} label="Overall" warnBelow={50} size={160} />
        <Radar axes={axes} current={result.scores} previous={previous} />
        {previous ? <p className="mt-2 text-[12px] text-mute">Dashed orange: your last saved result.</p> : null}
        <div className="mt-4 flex gap-2">
          <Button tone="solid" icon={saved ? <Check className="size-4" /> : <Save className="size-4" />} disabled={!complete || saving || saved} onClick={onSave}>
            {saved ? "Saved" : complete ? "Save result" : "Answer all to save"}
          </Button>
          <Button tone="ghost" icon={<RotateCcw className="size-4" />} onClick={onRestart}>
            Start over
          </Button>
        </div>
      </Panel>
      <div>
        <h3 className="mb-3 font-display text-2xl tracking-tight">{result.fixes.length ? `${result.fixes.length} things to change` : "No weak spots in what you answered"}</h3>
        <ul className="space-y-2">
          {result.fixes.map((q) => {
            const s = SECTION_BY_SLUG[q.topic];
            return (
              <li key={q.key} className="card rounded-[14px] p-4">
                <div className="text-[13px] text-mute">{q.prompt}</div>
                <div className="mt-1 text-[15px]">{q.fix}</div>
                {s ? (
                  <Link to="/topics/$slug" params={{ slug: s.slug }} className="mt-2 inline-block text-[13px] text-accent hover:underline">
                    Why · {s.num} {s.title} →
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
