import type { ComponentType } from "react";
import type { WidgetId } from "@/content/types";
import { CacheCalculator } from "./CacheCalculator";
import { ControlMemoryBoard } from "./ControlMemoryBoard";
import { DecisionLog } from "./DecisionLog";
import { EvidenceDeck } from "./EvidenceDeck";
import { GuardrailChecklist } from "./GuardrailChecklist";
import { InfoSystem } from "./InfoSystem";
import { LearningQuiz } from "./LearningQuiz";
import { MemoryTiers } from "./MemoryTiers";
import { MistakesAudit } from "./MistakesAudit";
import { OdysseusGrid } from "./OdysseusGrid";
import { PerceptionGap } from "./PerceptionGap";
import { ScriptExhibit } from "./ScriptExhibit";
import { SkillLevels } from "./SkillLevels";
import { SpecExhibit } from "./SpecExhibit";
import { SycophancyBars } from "./SycophancyBars";
import { ToolOverhead } from "./ToolOverhead";
import { Trifecta } from "./Trifecta";

/** Content blocks reference widgets by id; this is the only place they're wired. */
export const WIDGETS: Record<WidgetId, ComponentType> = {
  "control-memory-board": ControlMemoryBoard,
  "evidence-deck": EvidenceDeck,
  "memory-tiers": MemoryTiers,
  "sycophancy-bars": SycophancyBars,
  "skill-levels": SkillLevels,
  "tool-overhead": ToolOverhead,
  trifecta: Trifecta,
  "cache-calculator": CacheCalculator,
  "guardrail-checklist": GuardrailChecklist,
  "odysseus-grid": OdysseusGrid,
  "perception-gap": PerceptionGap,
  "mistakes-audit": MistakesAudit,
  "spec-exhibit": SpecExhibit,
  "learning-quiz": LearningQuiz,
  "info-system": InfoSystem,
  "decision-log": DecisionLog,
  "script-exhibit": ScriptExhibit,
};
