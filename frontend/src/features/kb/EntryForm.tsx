import { useState } from "react";
import type { Entry, EntryInput, EntryKind } from "@/api/types";
import { SECTIONS } from "@/content/brief";
import { Button } from "@/ui/Button";
import { Segmented } from "@/ui/Segmented";
import { KINDS } from "./kinds";


/** Create or edit an entry. Topic is fixed when embedded in a topic page. */
export function EntryForm({
  initial,
  fixedTopic,
  busy,
  error,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Entry>;
  fixedTopic?: string;
  busy?: boolean;
  error?: string;
  submitLabel?: string;
  onSubmit: (input: EntryInput) => void;
  onCancel?: () => void;
}) {
  const [kind, setKind] = useState<EntryKind>(initial?.kind ?? "finding");
  const [topic, setTopic] = useState(fixedTopic ?? initial?.topic ?? SECTIONS[0]!.slug);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!body.trim()) return;
        onSubmit({ kind, topic, title: title.trim() || null, body: body.trim(), url: url.trim() || null });
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Kind" size="sm" value={kind} onChange={setKind} options={KINDS.map((k) => ({ value: k.value, label: k.label }))} />
        {fixedTopic ? null : (
          <select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic" className="h-9 rounded-[10px] border border-line bg-surface px-2.5 text-[13px]">
            {SECTIONS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.num} · {s.title}
              </option>
            ))}
          </select>
        )}
      </div>
      <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} placeholder="Title, e.g. Tiered memory cut my corrections…" />
      <textarea
        className="field min-h-28 resize-y leading-relaxed"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={10_000}
        placeholder={KINDS.find((k) => k.value === kind)?.hint}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) e.currentTarget.form?.requestSubmit();
        }}
      />
      {kind === "source" ? <input className="field" value={url} onChange={(e) => setUrl(e.target.value)} type="url" placeholder="https://…" /> : null}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] text-mute">{error ?? "⌘↵ to save"}</span>
        <div className="flex gap-2">
          {onCancel ? (
            <Button tone="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
          <Button type="submit" tone="solid" size="sm" disabled={busy || !body.trim()}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
