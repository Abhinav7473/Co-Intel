export type WidgetId =
  | "control-memory-board"
  | "evidence-deck"
  | "memory-tiers"
  | "sycophancy-bars"
  | "skill-levels"
  | "tool-overhead"
  | "trifecta"
  | "cache-calculator"
  | "guardrail-checklist"
  | "odysseus-grid"
  | "perception-gap"
  | "mistakes-audit"
  | "spec-exhibit"
  | "learning-quiz"
  | "info-system"
  | "decision-log";

export type ToolId = "audit" | "assess" | "experiments" | "kb";

/** A topic of the brief. Each one is its own page; the landing page links them all. */
export interface Section {
  slug: string;
  num: string;
  title: string;
  /** one-line hook, shown on the hub card and the topic header */
  kicker: string;
  /** tools that put this topic into practice */
  tools: ToolId[];
  /** category on the site map (`GROUPS` in brief.ts) */
  group: GroupId;
}

export type GroupId = "sees" | "feeds" | "costs" | "wrong" | "behind";

/** Where a widget's numbers come from. Shown as a badge so nobody mistakes a diagram for data. */
export type DataKind = "study" | "estimate" | "yours" | "illustration" | "opinion" | "codebase";

/** Every widget scene says, in plain words, what it shows, what to do, and why it matters. */
export interface WidgetGuide {
  /** short name for outlines and the site map */
  name: string;
  shows: string;
  try: string;
  point: string;
  data: DataKind[];
}

export type Transition = "fade" | "push" | "rise" | "zoom" | "wipe" | "iris";

/** A line that can carry more, revealed only when the viewer asks. */
export interface Line {
  text: string;
  more?: string;
}

interface SlideBase {
  id: string;
  /** chapter slug, or "intro" / "end" */
  chapter: string;
  transition?: Transition;
  /** the long form: shown in the Details sheet, never on the slide */
  details?: string[];
  sources?: SourceLink[];
}

export type Slide = SlideBase &
  (
    | { kind: "title" }
    | { kind: "chapter" }
    | { kind: "statement"; heading: string; lines: Line[] }
    | {
        kind: "stat";
        /** what the study did, in one plain sentence (shown first, so the number has a meaning) */
        study: string;
        value: string;
        /** what the number counts */
        label: string;
        /** what it means for the reader */
        meaning: string;
        source: string;
      }
    | { kind: "compare"; heading?: string; columns: { title: string; lines: string[]; emphasis?: boolean }[] }
    | { kind: "list"; heading: string; lines: Line[]; numbered?: boolean }
    | { kind: "widget"; widget: WidgetId; guide: WidgetGuide }
    | { kind: "end" }
  );

export interface Study {
  key: string;
  name: string;
  href: string;
  org: string;
  setting: string;
  finding: string;
  stance: "less-is-more" | "counterweight" | "pattern";
}

export interface Mistake {
  key: string;
  mistake: string;
  why: string;
  replace: string;
  evidence: string;
}

export interface Guardrail {
  key: string;
  text: string;
}

export interface OdysseusFeature {
  feature: string;
  does: string;
  fit: string;
  verdict: "demo" | "counter" | "neutral";
}

export interface SourceLink {
  label: string;
  href: string;
}
