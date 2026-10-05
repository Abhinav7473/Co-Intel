import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Pencil, Pin, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { Entry } from "@/api/types";
import { SECTION_BY_SLUG } from "@/content/brief";
import { useDeleteEntry, useUpdateEntry } from "@/hooks/useEntries";
import { cn } from "@/utils/cn";
import { EntryForm } from "./EntryForm";
import { KIND_BY_VALUE } from "./kinds";

const when = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

/** One entry. `layout` lets the list re-flow smoothly when filters change or items pin. */
export function EntryCard({ entry, showTopic }: { entry: Entry; showTopic?: boolean }) {
  const [editing, setEditing] = useState(false);
  const update = useUpdateEntry();
  const del = useDeleteEntry();
  const kind = KIND_BY_VALUE[entry.kind];
  const topic = SECTION_BY_SLUG[entry.topic];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
      className={cn("card group rounded-[16px] p-5", entry.pinned && "ring-1 ring-accent/40")}
    >
      {editing ? (
        <EntryForm
          initial={entry}
          busy={update.isPending}
          submitLabel="Update"
          onCancel={() => setEditing(false)}
          onSubmit={(input) => update.mutate({ id: entry.id, ...input }, { onSuccess: () => setEditing(false) })}
        />
      ) : (
        <>
          <div className="mb-2 flex items-center gap-2 text-[12px] text-mute">
            <kind.icon className="size-3.5 text-accent" />
            <span className="font-medium text-ink/80">{kind.label}</span>
            {showTopic && topic ? (
              <Link to="/topics/$slug" params={{ slug: topic.slug }} className="truncate hover:text-ink">
                · {topic.num} {topic.title}
              </Link>
            ) : null}
            <span className="ml-auto shrink-0">{when.format(new Date(entry.created_at))}</span>
          </div>
          {entry.title ? <h3 className="font-display text-lg leading-snug tracking-tight">{entry.title}</h3> : null}
          <p className="mt-1 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink/85">{entry.body}</p>
          {entry.url ? (
            <a href={entry.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[13px] text-accent hover:underline">
              {new URL(entry.url).hostname} <ArrowUpRight className="size-3" />
            </a>
          ) : null}
          <div className="mt-3 flex gap-1 opacity-60 transition group-hover:opacity-100">
            <IconButton label={entry.pinned ? "Unpin" : "Pin"} active={entry.pinned} onClick={() => update.mutate({ id: entry.id, pinned: !entry.pinned })}>
              <Pin className="size-3.5" />
            </IconButton>
            <IconButton label="Edit" onClick={() => setEditing(true)}>
              <Pencil className="size-3.5" />
            </IconButton>
            <IconButton label="Delete" danger onClick={() => window.confirm("Delete this entry? This can\u2019t be undone.") && del.mutate(entry.id)}>
              <Trash2 className="size-3.5" />
            </IconButton>
          </div>
        </>
      )}
    </motion.li>
  );
}

function IconButton({ label, active, danger, onClick, children }: { label: string; active?: boolean; danger?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "rounded-[8px] p-1.5 transition",
        danger ? "text-mute hover:bg-warn-soft hover:text-warn" : "text-mute hover:bg-ink/[0.06] hover:text-ink",
        active && "text-accent",
      )}
    >
      {children}
    </button>
  );
}
