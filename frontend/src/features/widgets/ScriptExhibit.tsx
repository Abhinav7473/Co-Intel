import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Segmented } from "@/ui/Segmented";
import { WidgetFrame } from "@/ui/Panel";
import { cn } from "@/utils/cn";

/**
 * One job (check that every citation in a draft exists in the reference list), two runs.
 * Token counts are estimates: a 12-page draft at ~500 tokens a page, a 300-entry refs.bib at ~100 tokens an entry.
 */
type Who = "you" | "ai" | "computer";
interface Step {
  who: Who;
  what: string;
  /** what lands in the chat, shown as code when it's a command or output */
  shown?: string;
  tokens: number;
}

const RUNS: Record<"read" | "script", { label: string; steps: Step[]; note: string }> = {
  read: {
    label: "AI reads and compares",
    steps: [
      { who: "you", what: "Ask", shown: "Check every citation in draft.md is in refs.bib.", tokens: 20 },
      { who: "ai", what: "Reads the whole draft into the chat (12 pages)", tokens: 6_000 },
      { who: "ai", what: "Reads the whole reference list into the chat (300 entries)", tokens: 30_000 },
      { who: "ai", what: "Compares the two lists itself and writes its answer", tokens: 800 },
    ],
    note: "Both files now sit in the chat and are resent with every later message. A long list compared by eye is where models slip, and the next run may come out differently.",
  },
  script: {
    label: "AI runs the skill's script",
    steps: [
      { who: "you", what: "Ask", shown: "Check every citation in draft.md is in refs.bib.", tokens: 20 },
      { who: "ai", what: "The request matches a skill; its instructions load", shown: "To check citations, run scripts/check_cites.py <draft> <bib>.", tokens: 400 },
      { who: "ai", what: "Sends one command", shown: "python scripts/check_cites.py draft.md refs.bib", tokens: 30 },
      { who: "computer", what: "Runs the script outside the chat; only what it prints comes back", shown: "2 cited keys not in refs.bib: smith2024, lee2023a", tokens: 25 },
      { who: "ai", what: "Tells you which two to fix", tokens: 60 },
    ],
    note: "The draft, the 300 entries and the script's own code never enter the chat. Same files in, same answer out, every time.",
  },
};

const total = (k: keyof typeof RUNS) => RUNS[k].steps.reduce((a, s) => a + s.tokens, 0);
const MAX = total("read");
const fmt = (n: number) => n.toLocaleString("en-US");

const WHO: Record<Who, { label: string; cls: string }> = {
  you: { label: "You", cls: "bg-sunken text-ink" },
  ai: { label: "AI", cls: "bg-accent-soft text-accent" },
  computer: { label: "Computer", cls: "bg-caution-soft text-caution" },
};

const SCRIPT = `import re, sys

draft = open(sys.argv[1]).read()
bib = open(sys.argv[2]).read()

cited = set(re.findall(r"\\[@([\\w:-]+)", draft))   # [@smith2024]
known = set(re.findall(r"@\\w+\\{([^,]+),", bib))    # @article{smith2024,
missing = sorted(cited - known)

if missing:
    print(f"{len(missing)} cited keys not in refs.bib: " + ", ".join(missing))
else:
    print("All citations found.")`;

export function ScriptExhibit() {
  const [run, setRun] = useState<keyof typeof RUNS>("read");
  const [code, setCode] = useState(false);
  const r = RUNS[run];
  const sums = r.steps.map((_, i) => r.steps.slice(0, i + 1).reduce((a, x) => a + x.tokens, 0));

  return (
    <WidgetFrame
      title="Checking citations, two ways"
      hint="Tokens are what enters the chat at each step. Estimates for a 12-page draft and a 300-entry reference list."
      actions={
        <Segmented
          label="Choose a run"
          size="sm"
          value={run}
          onChange={setRun}
          options={[
            { value: "read", label: "Without a script" },
            { value: "script", label: "With a script" },
          ]}
        />
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.ol key={run} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16, ease: "easeOut" }} className="divide-y divide-line border-y border-line">
          {r.steps.map((s, i) => {
            return (
              <li key={s.what} className="grid gap-x-4 gap-y-2 py-3.5 sm:grid-cols-[5.5rem_minmax(0,1fr)_6.5rem] sm:items-start">
                <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-[12px] font-medium", WHO[s.who].cls)}>{WHO[s.who].label}</span>
                <div className="min-w-0">
                  <div className="text-[15px]">{s.what}</div>
                  {s.shown ? <code className="mt-1.5 block overflow-x-auto whitespace-pre-wrap rounded-[8px] bg-sunken px-3 py-2 font-mono text-[12.5px] text-ink/85">{s.shown}</code> : null}
                </div>
                <div className="text-[13px] tabular-nums sm:text-right">
                  <span className="font-medium">+{fmt(s.tokens)}</span>
                  <span className="block text-[12px] text-mute">{fmt(sums[i]!)} so far</span>
                </div>
              </li>
            );
          })}
        </motion.ol>
      </AnimatePresence>

      <div className="mt-6 grid gap-2">
        {(Object.keys(RUNS) as (keyof typeof RUNS)[]).map((k) => (
          <div key={k} className="grid grid-cols-[9.5rem_1fr_5rem] items-center gap-3 text-[13px] sm:grid-cols-[13rem_1fr_6rem]">
            <span className={k === run ? "font-medium" : "text-mute"}>{RUNS[k].label}</span>
            <span className="h-3 overflow-hidden rounded-full bg-ink/[0.06]">
              <motion.span
                className={cn("block h-full rounded-full", k === "read" ? "bg-warn" : "bg-accent")}
                initial={false}
                animate={{ width: `${Math.max(0.6, (total(k) / MAX) * 100)}%`, opacity: k === run ? 1 : 0.45 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              />
            </span>
            <span className="text-right tabular-nums">{fmt(total(k))}</span>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-[12px] bg-sunken p-4 text-[14px] leading-relaxed">
        <span className="font-medium">Why so much less?</span> The AI doesn't copy the script into the chat. It sends one command, the computer runs the code,
        and only the printed line comes back. {r.note}
      </p>

      <button type="button" onClick={() => setCode((v) => !v)} aria-expanded={code} className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-mute transition-colors hover:text-ink">
        <ChevronDown className={cn("size-4 transition-transform duration-200", code && "rotate-180")} />
        {code ? "Hide the script" : "See the script (13 lines, never sent to the AI)"}
      </button>
      <AnimatePresence initial={false}>
        {code ? (
          <motion.pre
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mt-2 overflow-hidden rounded-[12px] bg-ink font-mono text-[12.5px] leading-relaxed text-canvas"
          >
            <code className="block overflow-x-auto p-4">{SCRIPT}</code>
          </motion.pre>
        ) : null}
      </AnimatePresence>
    </WidgetFrame>
  );
}
