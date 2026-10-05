import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { SECTION_BY_SLUG } from "@/content/brief";
import { EXHIBITS } from "@/content/exhibits";
import { Segmented } from "@/ui/Segmented";
import { WidgetFrame } from "@/ui/Panel";
import { cn } from "@/utils/cn";

const TAG_TONE: Record<string, string> = {
  "Worth keeping": "bg-accent-soft text-accent",
  "Instruction leaked into output": "bg-warn-soft text-warn",
  "Invented claim": "bg-warn-soft text-warn",
};

/** Two real generator specs, quoted and annotated against the research. */
export function SpecExhibit() {
  const [key, setKey] = useState(EXHIBITS[0]!.key);
  const ex = EXHIBITS.find((e) => e.key === key)!;

  return (
    <WidgetFrame
      title="Exhibit: two vibe-coding specs"
      hint="Real prompts written for AI site generators. Excerpts quoted as written; asset links redacted."
      actions={<Segmented label="Choose a spec" size="sm" value={key} onChange={setKey} options={EXHIBITS.map((e) => ({ value: e.key, label: e.title.replace(/^An? /, "") }))} />}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={ex.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: "easeOut" }}>
          <p className="mb-5 text-[14px] text-mute">{ex.summary}</p>
          <ol className="divide-y divide-line border-y border-line">
            {ex.annotations.map((a) => {
              const topic = a.topic ? SECTION_BY_SLUG[a.topic] : undefined;
              return (
                <li key={a.quote} className="grid gap-3 py-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-8">
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-[10px] bg-sunken px-4 py-3 font-mono text-[12.5px] leading-relaxed text-ink/85">{a.quote}</pre>
                  <div>
                    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium", TAG_TONE[a.tag] ?? "bg-caution-soft text-caution")}>{a.tag}</span>
                    <p className="mt-2 text-[15px] leading-relaxed">{a.note}</p>
                    {topic ? (
                      <Link to="/topics/$slug" params={{ slug: topic.slug }} className="mt-1 inline-block text-[13px] text-accent underline-offset-4 hover:underline">
                        Why: {topic.title}
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.div>
      </AnimatePresence>
    </WidgetFrame>
  );
}
