/**
 * The API without a server: the same routes as the FastAPI backend, answered from this browser's localStorage.
 * Used when the site is built with VITE_BACKEND=local (the static Vercel deploy). Each viewer sees only their own
 * data, and the mistakes poll counts only this browser's answers. Storage can be unavailable (private window,
 * blocked site data); then the data lives in memory until the tab closes.
 */
import { ApiError } from "./client";
import type { Assessment, BoardPin, ChecklistItem, Entry, Experiment, ExperimentSummary, PollSummary, Run, SetupAudit, SetupAuditSummary } from "./types";

interface Db {
  entries: Entry[];
  setupAudits: SetupAudit[];
  assessments: Assessment[];
  experiments: Experiment[];
  board: BoardPin[];
  checklist: ChecklistItem[];
  poll: string[][];
}

const KEY = "co-intel:db:v1";
const empty = (): Db => ({ entries: [], setupAudits: [], assessments: [], experiments: [], board: [], checklist: [], poll: [] });
let memory: Db | null = null;

function load(): Db {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? { ...empty(), ...(JSON.parse(raw) as Partial<Db>) } : empty();
  } catch {
    memory = empty();
  }
  return memory;
}

function save(db: Db) {
  memory = db;
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* storage full or blocked: keep the in-memory copy */
  }
}

/** Same caps as the backend (`MAX_*` in each router). */
function ensureCapacity(rows: readonly unknown[], cap: number) {
  if (rows.length >= cap) throw new ApiError(409, `Limit of ${cap} reached`);
}

function find<T extends { id: string }>(rows: T[], id: string, what: string): T {
  const row = rows.find((r) => r.id === id);
  if (!row) throw new ApiError(404, `${what} not found`);
  return row;
}

const now = () => new Date().toISOString();
const newest = <T extends { created_at: string }>(a: T, b: T) => b.created_at.localeCompare(a.created_at);
const summary = ({ id, label, score, created_at }: SetupAudit): SetupAuditSummary => ({ id, label, score, created_at });
const expSummary = ({ id, title, template, variant_a, variant_b, created_at, runs }: Experiment): ExperimentSummary => ({
  id, title, template, variant_a, variant_b, created_at, run_count: runs.length,
});

function pollSummary(db: Db): PollSummary {
  const counts: Record<string, number> = {};
  for (const answer of db.poll) for (const key of answer) counts[key] = (counts[key] ?? 0) + 1;
  return { responses: db.poll.length, counts };
}

/** Dispatch one request, shaped like the backend's response (204 → undefined). */
export function localApi(path: string, init: RequestInit = {}): unknown {
  const method = (init.method ?? "GET").toUpperCase();
  const body: Record<string, unknown> = typeof init.body === "string" ? (JSON.parse(init.body) as Record<string, unknown>) : {};
  const [resource = "", id = "", sub = "", subId = ""] = path.replace(/\?.*$/, "").split("/").filter(Boolean);
  const db = load();
  const route = resource === "audit" && id === "summary" ? `${method} /audit/summary` : `${method} /${resource}${id ? "/:id" : ""}${sub ? `/${sub}` : ""}${subId ? "/:sub" : ""}`;

  switch (route) {
    case "GET /entries":
      return [...db.entries].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updated_at.localeCompare(a.updated_at));
    case "POST /entries": {
      ensureCapacity(db.entries, 5000);
      const at = now();
      const entry = { title: null, url: null, ...body, id: crypto.randomUUID(), pinned: false, created_at: at, updated_at: at } as Entry;
      save({ ...db, entries: [...db.entries, entry] });
      return entry;
    }
    case "PATCH /entries/:id": {
      const entry = { ...find(db.entries, id, "Entry"), ...body, updated_at: now() } as Entry;
      save({ ...db, entries: db.entries.map((e) => (e.id === id ? entry : e)) });
      return entry;
    }
    case "DELETE /entries/:id":
      find(db.entries, id, "Entry");
      save({ ...db, entries: db.entries.filter((e) => e.id !== id) });
      return undefined;

    case "GET /setup-audits":
      return [...db.setupAudits].sort(newest).slice(0, 200).map(summary);
    case "POST /setup-audits": {
      ensureCapacity(db.setupAudits, 500);
      const { label, setup, report } = body as Pick<SetupAudit, "label" | "setup" | "report">;
      const audit: SetupAudit = { id: crypto.randomUUID(), label, setup, report, score: report.score, created_at: now() };
      save({ ...db, setupAudits: [...db.setupAudits, audit] });
      return audit;
    }
    case "GET /setup-audits/:id":
      return find(db.setupAudits, id, "Audit");
    case "DELETE /setup-audits/:id":
      find(db.setupAudits, id, "Audit");
      save({ ...db, setupAudits: db.setupAudits.filter((a) => a.id !== id) });
      return undefined;

    case "GET /assessments":
      return [...db.assessments].sort(newest).slice(0, 100);
    case "POST /assessments": {
      ensureCapacity(db.assessments, 500);
      const row = { ...body, id: crypto.randomUUID(), created_at: now() } as Assessment;
      save({ ...db, assessments: [...db.assessments, row] });
      return row;
    }
    case "DELETE /assessments/:id":
      find(db.assessments, id, "Assessment");
      save({ ...db, assessments: db.assessments.filter((a) => a.id !== id) });
      return undefined;

    case "GET /experiments":
      return [...db.experiments].sort(newest).map(expSummary);
    case "POST /experiments": {
      ensureCapacity(db.experiments, 200);
      const exp: Experiment = { ...(body as Omit<Experiment, "id" | "created_at" | "runs">), id: crypto.randomUUID(), created_at: now(), runs: [] };
      save({ ...db, experiments: [...db.experiments, exp] });
      return exp;
    }
    case "GET /experiments/:id":
      return find(db.experiments, id, "Experiment");
    case "DELETE /experiments/:id":
      find(db.experiments, id, "Experiment");
      save({ ...db, experiments: db.experiments.filter((e) => e.id !== id) });
      return undefined;
    case "POST /experiments/:id/runs": {
      const exp = find(db.experiments, id, "Experiment");
      ensureCapacity(exp.runs, 500);
      const run = { note: "", ...body, id: crypto.randomUUID(), created_at: now() } as Run;
      save({ ...db, experiments: db.experiments.map((e) => (e.id === id ? { ...e, runs: [...e.runs, run] } : e)) });
      return run;
    }
    case "DELETE /experiments/:id/runs/:sub": {
      const exp = find(db.experiments, id, "Experiment");
      find(exp.runs, subId, "Run");
      save({ ...db, experiments: db.experiments.map((e) => (e.id === id ? { ...e, runs: e.runs.filter((r) => r.id !== subId) } : e)) });
      return undefined;
    }

    case "GET /board":
      return [...db.board].sort((a, b) => a.key.localeCompare(b.key));
    case "PUT /board/:id": {
      const exists = db.board.some((p) => p.key === id);
      if (!exists && db.board.length >= 24) throw new ApiError(409, "Board is full");
      const pin = { ...(body as Omit<BoardPin, "key">), key: id };
      save({ ...db, board: exists ? db.board.map((p) => (p.key === id ? pin : p)) : [...db.board, pin] });
      return pin;
    }
    case "DELETE /board":
      save({ ...db, board: [] });
      return undefined;

    case "GET /checklist":
      return db.checklist;
    case "PUT /checklist/:id": {
      const exists = db.checklist.some((i) => i.key === id);
      if (!exists && db.checklist.length >= 50) throw new ApiError(409, "Checklist is full");
      const item: ChecklistItem = { key: id, done: Boolean(body.done) };
      save({ ...db, checklist: exists ? db.checklist.map((i) => (i.key === id ? item : i)) : [...db.checklist, item] });
      return item;
    }

    case "GET /audit/summary":
      return pollSummary(db);
    case "POST /audit": {
      const next = { ...db, poll: [...db.poll, (body.mistakes as string[]) ?? []] };
      save(next);
      return pollSummary(next);
    }
  }
  throw new ApiError(404, "Not found");
}
