import { useDeferredValue, useMemo, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { RotateCcw, Save, Sparkles } from "lucide-react";
import { useSaveSetupAudit, useSetupAudits } from "@/hooks/useSetupAudits";
import { Page } from "@/shell/AppShell";
import { Button } from "@/ui/Button";
import { Panel } from "@/ui/Panel";
import { analyze, EMPTY_SETUP, SAMPLE_SETUP, type Setup } from "./analyze";
import { ReportView } from "./ReportView";
import { SetupForm } from "./SetupForm";

const when = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export function AuditPage() {
  // "Edit as new audit" from a saved report passes its setup through history state.
  const carried = useRouterState({ select: (s) => s.location.state.setup });
  const [setup, setSetup] = useState<Setup>(carried ?? EMPTY_SETUP);
  const [label, setLabel] = useState("");
  const deferred = useDeferredValue(setup); // typing stays smooth on big files
  const report = useMemo(() => analyze(deferred), [deferred]);
  const save = useSaveSetupAudit();
  const navigate = useNavigate();
  const { data: history = [] } = useSetupAudits();
  const empty = !setup.memory.trim() && !setup.skills.length && !setup.servers.length;

  return (
    <Page
      eyebrow="Setup audit"
      title="Dissect your setup"
      lead="Paste what your assistant loads. Every rule comes from a finding in the topics; each result links to the why."
      actions={
        <>
          <Button icon={<Sparkles className="size-4" />} onClick={() => setSetup(SAMPLE_SETUP)}>
            Load a messy example
          </Button>
          <Button tone="ghost" icon={<RotateCcw className="size-4" />} onClick={() => setSetup(EMPTY_SETUP)} disabled={empty}>
            Clear
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SetupForm setup={setup} onChange={setSetup} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ReportView report={report} emptyHint="Paste a memory file, add a skill or a server, or load the example. The report updates as you type." />
          {!empty ? (
            <Panel className="mt-5 flex flex-wrap items-center gap-2 p-4">
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                maxLength={80}
                placeholder="Label, e.g. laptop, October…"
                className="h-10 min-w-0 flex-1 rounded-[10px] border border-line bg-surface px-3 text-[14px] outline-none focus:border-accent"
              />
              <Button
                tone="solid"
                icon={<Save className="size-4" />}
                disabled={save.isPending}
                onClick={() =>
                  save.mutate(
                    { label: label.trim() || "Untitled setup", setup, report: analyze(setup) },
                    { onSuccess: (a) => navigate({ to: "/audit/$id", params: { id: a.id } }) },
                  )
                }
              >
                Save report
              </Button>
              {save.isError ? <span role="status" aria-live="polite" className="w-full text-[12.5px] text-warn">{save.error.message}</span> : null}
            </Panel>
          ) : null}
        </div>
      </div>

      {history.length ? (
        <section className="mt-16">
          <h2 className="mb-4 font-display text-2xl tracking-tight">Saved audits</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((a) => (
              <li key={a.id}>
                <Link to="/audit/$id" params={{ id: a.id }} className="card flex items-center justify-between gap-3 rounded-[14px] p-4 transition hover:border-line-strong">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{a.label}</span>
                    <span className="text-[12px] text-mute">{when.format(new Date(a.created_at))}</span>
                  </span>
                  <span className={`font-display text-2xl tabular-nums ${a.score < 60 ? "text-warn" : "text-accent"}`}>{a.score}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Page>
  );
}

declare module "@tanstack/react-router" {
  interface HistoryState {
    setup?: Setup;
  }
}
