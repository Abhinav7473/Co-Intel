import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Copy, Trash2 } from "lucide-react";
import { useDeleteSetupAudit, useSetupAudit, useSetupAudits } from "@/hooks/useSetupAudits";
import { Page } from "@/shell/AppShell";
import { Button } from "@/ui/Button";
import { Panel } from "@/ui/Panel";
import { ReportView } from "./ReportView";

const route = getRouteApi("/audit/$id");
const when = new Intl.DateTimeFormat(undefined, { dateStyle: "long", timeStyle: "short" });

export function AuditDetailPage() {
  const { id } = route.useParams();
  const { data: audit } = useSetupAudit(id);
  const { data: history = [] } = useSetupAudits();
  const del = useDeleteSetupAudit();
  const navigate = useNavigate();
  if (!audit) return null;

  // previous = the audit saved just before this one
  const idx = history.findIndex((a) => a.id === id);
  const previous = idx >= 0 ? history[idx + 1] : undefined;

  return (
    <Page
      eyebrow={`Saved audit · ${when.format(new Date(audit.created_at))}`}
      title={audit.label}
      actions={
        <>
          <Button icon={<Copy className="size-4" />} onClick={() => navigate({ to: "/audit", state: { setup: audit.setup } })}>
            Edit as new audit
          </Button>
          <Button tone="danger" icon={<Trash2 className="size-4" />} onClick={() => window.confirm("Delete this saved audit? This can\u2019t be undone.") && del.mutate(id, { onSuccess: () => navigate({ to: "/audit" }) })}>
            Delete
          </Button>
        </>
      }
    >
      {previous ? <Comparison current={audit.report.score} previousId={previous.id} previousLabel={previous.label} previousScore={previous.score} currentRules={audit.report.findings.map((f) => f.rule)} /> : null}
      <div className="max-w-3xl">
        <ReportView report={audit.report} />
      </div>
    </Page>
  );
}

function Comparison({ current, previousId, previousLabel, previousScore, currentRules }: { current: number; previousId: string; previousLabel: string; previousScore: number; currentRules: string[] }) {
  const { data: prev } = useSetupAudit(previousId);
  const delta = current - previousScore;
  const prevIssues = new Set(prev?.report.findings.filter((f) => f.severity === "risk" || f.severity === "warn").map((f) => f.rule) ?? []);
  const resolved = [...prevIssues].filter((r) => !currentRules.includes(r));

  return (
    <Panel className="mb-6 flex max-w-3xl flex-wrap items-center gap-6 p-5">
      <div className={`flex items-center gap-1 font-display text-3xl tabular-nums ${delta >= 0 ? "text-accent" : "text-warn"}`}>
        {delta >= 0 ? <ArrowUpRight className="size-6" /> : <ArrowDownRight className="size-6" />}
        {delta >= 0 ? "+" : ""}
        {delta}
      </div>
      <div className="min-w-0 flex-1 text-[14px]">
        <div>
          vs{" "}
          <Link to="/audit/$id" params={{ id: previousId }} className="font-medium hover:underline">
            {previousLabel}
          </Link>{" "}
          ({previousScore})
        </div>
        <div className="text-mute">{resolved.length ? `Resolved since then: ${resolved.join(", ")}` : "No earlier issues resolved yet."}</div>
      </div>
    </Panel>
  );
}
