import { useDeferredValue, useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { EntryKind } from "@/api/types";
import { SECTIONS } from "@/content/brief";
import { useCreateEntry, useEntries } from "@/hooks/useEntries";
import { Page } from "@/shell/AppShell";
import { Button } from "@/ui/Button";
import { Panel } from "@/ui/Panel";
import { Segmented } from "@/ui/Segmented";
import { EntryCard } from "./EntryCard";
import { EntryForm } from "./EntryForm";
import { KINDS } from "./kinds";

const route = getRouteApi("/kb");

export function KnowledgePage() {
  const { topic: topicParam } = route.useSearch();
  const navigate = route.useNavigate();
  const { data: entries = [] } = useEntries();
  const create = useCreateEntry();
  const [kind, setKind] = useState<EntryKind | "all">("all");
  const [query, setQuery] = useState("");
  const [composing, setComposing] = useState(entries.length === 0);
  const q = useDeferredValue(query.trim().toLowerCase());

  const shown = entries.filter(
    (e) =>
      (kind === "all" || e.kind === kind) &&
      (!topicParam || e.topic === topicParam) &&
      (!q || `${e.title ?? ""} ${e.body}`.toLowerCase().includes(q)),
  );
  const counts = new Map(KINDS.map((k) => [k.value, entries.filter((e) => e.kind === k.value).length]));

  return (
    <Page
      eyebrow="Knowledge base"
      title="What you know, filed by topic"
      lead="The brief is the seed. Your findings, sources, notes and open questions live here, and appear on each topic's page."
      actions={
        <Button tone="solid" icon={<Plus className="size-4" />} onClick={() => setComposing((v) => !v)}>
          New entry
        </Button>
      }
    >
      <AnimatePresence initial={false}>
        {composing ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Panel className="mb-8 p-6">
              <EntryForm
                key={entries.length}
                fixedTopic={undefined}
                initial={{ topic: topicParam }}
                busy={create.isPending}
                error={create.isError ? create.error.message : undefined}
                onCancel={() => setComposing(false)}
                onSubmit={(input) => create.mutate(input)}
              />
            </Panel>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Segmented
          label="Filter by kind"
          value={kind}
          onChange={setKind}
          options={[{ value: "all" as const, label: `All ${entries.length}` }, ...KINDS.map((k) => ({ value: k.value, label: `${k.label}s ${counts.get(k.value) ?? 0}` }))]}
        />
        <select
          aria-label="Filter by topic"
          value={topicParam ?? ""}
          onChange={(e) => navigate({ search: e.target.value ? { topic: e.target.value } : {} })}
          className="h-10 rounded-[12px] border border-line bg-surface px-3 text-[13px]"
        >
          <option value="">All topics</option>
          {SECTIONS.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.num} · {s.title}
            </option>
          ))}
        </select>
        <label className="relative ml-auto min-w-56 flex-1 sm:flex-none">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search entries"
            className="h-10 w-full rounded-[12px] border border-line bg-surface pl-9 pr-3 text-[14px] outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </label>
      </div>

      {shown.length === 0 ? (
        <Panel className="p-10 text-center text-mute">{entries.length ? "Nothing matches these filters." : "No entries yet. Add your first finding above."}</Panel>
      ) : (
        <LayoutGroup>
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((e) => (
                <EntryCard key={e.id} entry={e} showTopic />
              ))}
            </AnimatePresence>
          </ul>
        </LayoutGroup>
      )}
    </Page>
  );
}
