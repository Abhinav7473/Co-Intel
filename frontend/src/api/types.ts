/** Mirrors the FastAPI response models (each backend feature has a schemas.py). */
import type { Report, Setup } from "@/features/audit/analyze";

export type EntryKind = "note" | "finding" | "source" | "question";

export interface Entry {
  id: string;
  topic: string;
  kind: EntryKind;
  title: string | null;
  body: string;
  url: string | null;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface EntryInput {
  topic: string;
  kind: EntryKind;
  title?: string | null;
  body: string;
  url?: string | null;
}

export interface SetupAuditSummary {
  id: string;
  label: string;
  score: number;
  created_at: string;
}

export interface SetupAudit extends SetupAuditSummary {
  setup: Setup;
  report: Report;
}

export interface Assessment {
  id: string;
  answers: Record<string, number>;
  scores: Record<string, number>;
  overall: number;
  created_at: string;
}

export interface Run {
  id: string;
  variant: "A" | "B";
  tokens: number | null;
  cost: number | null;
  minutes: number | null;
  corrections: number | null;
  quality: number | null;
  note: string;
  created_at: string;
}

export type RunInput = Omit<Run, "id" | "created_at">;

export interface ExperimentSummary {
  id: string;
  title: string;
  template: string;
  variant_a: string;
  variant_b: string;
  created_at: string;
  run_count: number;
}

export interface Experiment {
  id: string;
  title: string;
  template: string;
  hypothesis: string;
  variant_a: string;
  variant_b: string;
  created_at: string;
  runs: Run[];
}

export interface BoardPin {
  key: string;
  label: string;
  /** 0 = you own the control flow, 1 = the model does */
  control: number;
  /** 0 = you own the memory (readable), 1 = the system does (extracted) */
  memory: number;
}

export interface ChecklistItem {
  key: string;
  done: boolean;
}

export interface PollSummary {
  responses: number;
  counts: Record<string, number>;
}
