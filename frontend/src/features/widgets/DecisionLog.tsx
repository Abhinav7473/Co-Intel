import { useState } from "react";
import facts from "@/content/build-facts.json";
import { Button } from "@/ui/Button";
import { Code } from "@/ui/Code";
import { Chip, WidgetFrame } from "@/ui/Panel";

type Decision = (typeof facts.log.decisions)[number];

const ALL = facts.log.decisions;
const FILTERS = [
  { key: "all", label: "All", test: () => true },
  { key: "owner", label: "From the owner", test: (d: Decision) => d.owner !== null },
  { key: "rejected", label: "Rejected or reverted", test: (d: Decision) => d.rejected !== null || d.reverted },
] as const;
const PAGE = 8;

/** The repo's append-only decision log (docs/decisions.md), read at build time by `make facts`. */
export function DecisionLog() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [all, setAll] = useState(false);
  const f = FILTERS.find((x) => x.key === filter)!;
  const shown = ALL.filter(f.test);
  const visible = all ? shown : shown.slice(0, PAGE);

  return (
    <WidgetFrame title="The decision log, oldest first">
      <div className="mb-6 grid grid-cols-3 divide-x divide-line rounded-[12px] border border-line text-center">
        {FILTERS.map((x) => (
          <div key={x.key} className="p-3">
            <div className="font-display text-3xl tabular-nums">{ALL.filter(x.test).length}</div>
            <div className="text-[12px] text-mute">{x.key === "all" ? "decisions" : x.label.toLowerCase()}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((x) => (
          <Chip key={x.key} active={filter === x.key} onClick={() => setFilter(x.key)}>
            {x.label}
          </Chip>
        ))}
      </div>

      <ol className="relative space-y-5 border-l border-line pl-5">
        {visible.map((d, i) => (
          <li key={`${d.date}-${i}`} className="relative">
            <span className={`absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full ring-4 ring-surface ${d.owner ? "bg-accent" : "bg-ink/25"}`} />
            <div className="font-mono text-[11.5px] text-mute">{d.date}</div>
            <p className="text-[14.5px] leading-snug">
              <Code text={d.text} />
              {d.reverted ? <span className="ml-2 rounded-md bg-warn-soft px-1.5 text-[12px] font-medium text-warn">reverted</span> : null}
            </p>
            {d.owner ? (
              <p className="mt-1 border-l-2 border-accent pl-3 text-[13.5px] italic text-ink/80">
                Owner: <Code text={d.owner} />
              </p>
            ) : d.why ? (
              <p className="mt-1 text-[13px] text-mute">
                Why: <Code text={d.why} />
              </p>
            ) : null}
            {d.rejected ? (
              <p className="mt-1 text-[13px] text-mute">
                <span className="text-warn">Rejected:</span> <Code text={d.rejected} />
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      {shown.length > PAGE ? (
        <Button size="sm" tone="ghost" className="mt-5" onClick={() => setAll((v) => !v)}>
          {all ? "Show fewer" : `Show all ${shown.length}`}
        </Button>
      ) : null}
    </WidgetFrame>
  );
}
