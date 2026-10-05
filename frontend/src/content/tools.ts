import { ClipboardCheck, FlaskConical, Library, ScanSearch, type LucideIcon } from "lucide-react";
import type { ToolId } from "./types";

export interface ToolMeta {
  id: ToolId;
  to: "/audit" | "/assess" | "/experiments" | "/kb";
  label: string;
  verb: string;
  blurb: string;
  icon: LucideIcon;
}

/** The four things you can *do* here. Topics explain; tools apply it to your own setup. */
export const TOOLS: ToolMeta[] = [
  { id: "audit", to: "/audit", label: "Setup audit", verb: "Audit your setup", blurb: "Paste your memory file, skills and servers. Get findings, token budget and fixes.", icon: ScanSearch },
  { id: "assess", to: "/assess", label: "Self-assessment", verb: "Assess your habits", blurb: "18 questions across the topics. A score per topic and the fixes that apply to you.", icon: ClipboardCheck },
  { id: "experiments", to: "/experiments", label: "Experiments", verb: "Run an experiment", blurb: "Test the claims on your own work: A vs B, logged runs, compared results.", icon: FlaskConical },
  { id: "kb", to: "/kb", label: "Knowledge base", verb: "Add to the knowledge base", blurb: "Your findings, sources, notes and open questions, filed by topic.", icon: Library },
];

export const TOOL_BY_ID = Object.fromEntries(TOOLS.map((t) => [t.id, t])) as Record<ToolId, ToolMeta>;
