import { BookMarked, CircleHelp, Lightbulb, StickyNote, type LucideIcon } from "lucide-react";
import type { EntryKind } from "@/api/types";

export const KINDS: { value: EntryKind; label: string; icon: LucideIcon; hint: string }[] = [
  { value: "finding", label: "Finding", icon: Lightbulb, hint: "Something you observed or measured" },
  { value: "source", label: "Source", icon: BookMarked, hint: "A paper, post or doc worth keeping" },
  { value: "question", label: "Question", icon: CircleHelp, hint: "Something still open" },
  { value: "note", label: "Note", icon: StickyNote, hint: "Anything else" },
];

export const KIND_BY_VALUE = Object.fromEntries(KINDS.map((k) => [k.value, k])) as Record<EntryKind, (typeof KINDS)[number]>;
