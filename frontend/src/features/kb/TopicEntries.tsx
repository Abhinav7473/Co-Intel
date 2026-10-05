import { Link } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { useCreateEntry, useEntries } from "@/hooks/useEntries";
import { Panel } from "@/ui/Panel";
import { EntryCard } from "./EntryCard";
import { EntryForm } from "./EntryForm";

/** "Your knowledge" block at the end of a topic: the brief is the seed, this is yours. */
export function TopicEntries({ topic }: { topic: string }) {
  const { data: all = [] } = useEntries();
  const entries = all.filter((e) => e.topic === topic);
  const create = useCreateEntry();

  return (
    <section id="your-knowledge" className="scroll-mt-28 border-t border-line pt-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Your knowledge</div>
          <h2 className="font-display text-3xl tracking-tight">What you've found on this topic</h2>
        </div>
        <Link to="/kb" search={{ topic }} className="text-[13px] text-mute hover:text-ink">
          Open in knowledge base →
        </Link>
      </div>
      <Panel className="mb-5 p-5">
        <EntryForm
          key={entries.length} /* reset the form after each save */
          fixedTopic={topic}
          busy={create.isPending}
          error={create.isError ? create.error.message : undefined}
          submitLabel="Add"
          onSubmit={(input) => create.mutate(input)}
        />
      </Panel>
      <LayoutGroup>
        <ul className="grid gap-3 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {entries.map((e) => (
              <EntryCard key={e.id} entry={e} />
            ))}
          </AnimatePresence>
        </ul>
      </LayoutGroup>
    </section>
  );
}
