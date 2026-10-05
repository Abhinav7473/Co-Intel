import { Columns2, Hash, List, MousePointerClick, Quote, type LucideIcon } from "lucide-react";
import type { DataKind, Slide } from "./types";

type SceneKind = "statement" | "stat" | "compare" | "list" | "widget";

/** The five classes of scene. Used as a legend on the site map and in every topic's outline. */
export const SCENE_CLASSES: Record<SceneKind, { name: string; icon: LucideIcon; blurb: string }> = {
  statement: { name: "Claim", icon: Quote, blurb: "One idea in a few lines" },
  stat: { name: "Number", icon: Hash, blurb: "A study's result: what they did, what it counts, what it means" },
  compare: { name: "Comparison", icon: Columns2, blurb: "Two or three options side by side" },
  list: { name: "List", icon: List, blurb: "Steps, habits or open questions" },
  widget: { name: "Try it", icon: MousePointerClick, blurb: "Something to click, with a guide to reading it" },
};

/** Where a widget's numbers come from. */
export const DATA_KINDS: Record<DataKind, { label: string; means: string }> = {
  study: { label: "Measured by a study", means: "Your input doesn't change these numbers." },
  estimate: { label: "Estimate", means: "Built from one published measurement; your inputs change it." },
  yours: { label: "Your input", means: "What you enter changes what you see." },
  illustration: { label: "Diagram or example", means: "Shows how something works. Not data." },
  opinion: { label: "Our judgement", means: "A reading of a product, not a measurement." },
  codebase: { label: "From this repository", means: "Counted from the site's own files." },
};

export type OutlineScene = Extract<Slide, { kind: SceneKind }>;

export const isScene = (s: Slide): s is OutlineScene => s.kind in SCENE_CLASSES;

/** A short name for a scene, for outlines and the site map. */
export function sceneLabel(s: OutlineScene): string {
  switch (s.kind) {
    case "statement":
    case "list":
      return s.heading;
    case "stat":
      return `${s.value} — ${s.label}`;
    case "compare":
      return s.heading ?? s.columns.map((c) => c.title).join(" vs ");
    case "widget":
      return s.guide.name;
  }
}
