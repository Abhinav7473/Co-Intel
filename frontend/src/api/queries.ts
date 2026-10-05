import { queryOptions } from "@tanstack/react-query";
import { api } from "./client";
import type { Assessment, BoardPin, ChecklistItem, Entry, Experiment, ExperimentSummary, PollSummary, SetupAudit, SetupAuditSummary } from "./types";

/** Query keys + fetchers in one place; route loaders prefetch these. */
export const queries = {
  entries: () => queryOptions({ queryKey: ["entries"] as const, queryFn: () => api<Entry[]>("/entries") }),
  setupAudits: () => queryOptions({ queryKey: ["setup-audits"] as const, queryFn: () => api<SetupAuditSummary[]>("/setup-audits") }),
  setupAudit: (id: string) => queryOptions({ queryKey: ["setup-audits", id] as const, queryFn: () => api<SetupAudit>(`/setup-audits/${id}`) }),
  assessments: () => queryOptions({ queryKey: ["assessments"] as const, queryFn: () => api<Assessment[]>("/assessments") }),
  experiments: () => queryOptions({ queryKey: ["experiments"] as const, queryFn: () => api<ExperimentSummary[]>("/experiments") }),
  experiment: (id: string) => queryOptions({ queryKey: ["experiments", id] as const, queryFn: () => api<Experiment>(`/experiments/${id}`) }),
  board: () => queryOptions({ queryKey: ["board"] as const, queryFn: () => api<BoardPin[]>("/board") }),
  checklist: () => queryOptions({ queryKey: ["checklist"] as const, queryFn: () => api<ChecklistItem[]>("/checklist") }),
  poll: () => queryOptions({ queryKey: ["poll"] as const, queryFn: () => api<PollSummary>("/audit/summary") }),
};
