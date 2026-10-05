import { useState } from "react";
import { motion } from "motion/react";
import { Chip, WidgetFrame } from "@/ui/Panel";
import { Slider } from "@/ui/Slider";
import { fmtTokens } from "@/utils/tones";

/** Anthropic: 5 servers / 58 tools ≈ 55k tokens up front → ~11k per server on average. */
const PER_SERVER = 55_000 / 5;
const WINDOW = 200_000;

/**
 * Up-front cost per mode. Tool search: Anthropic cut ~77k to ~8.7k (−85%). Code execution also presents
 * tools as files read on demand, so its up-front cost is about the same; its bigger saving is on data
 * (the example), which this bar does not show.
 */
const MODES = [
  {
    key: "all",
    label: "All definitions loaded",
    factor: 1,
    color: "#a94400",
    how: "Every tool's name, description and settings ride along with every message, used or not. You ask about one Slack thread; the AI still receives all 58.",
    example: `github.create_issue    Create an issue in a repository. Params: owner, repo, title, body, labels…
github.list_pull_requests    List pull requests. Params: owner, repo, state, sort…
slack.post_message    Post a message to a channel. Params: channel, text, thread_ts…
… 55 more, resent with every message`,
  },
  {
    key: "search",
    label: "Tool search (−85%)",
    factor: 0.15,
    color: "#0072b2",
    how: "Only a search tool (~500 tokens) is loaded up front. Asked to post a summary in #lab, the AI searches for 'slack' and just those tools load.",
    example: `search_tools("slack")
→ loads slack.post_message, slack.list_channels   (the other 56 stay out)`,
  },
  {
    key: "code",
    label: "Code execution",
    factor: 0.15,
    color: "#0072b2",
    how: "Tools become code the AI calls. To copy a meeting transcript from Google Drive into Salesforce it writes two lines; the transcript moves inside the code, never through the chat. Anthropic measured that task at ~150k tokens → ~2k.",
    example: `const t = (await gdrive.getDocument({ documentId: "abc123" })).content;
await salesforce.updateRecord({ objectType: "SalesMeeting", data: { Notes: t } });`,
  },
] as const;

export function ToolOverhead() {
  const [servers, setServers] = useState(5);
  const [mode, setMode] = useState<(typeof MODES)[number]["key"]>("all");
  const m = MODES.find((x) => x.key === mode)!;
  const tokens = servers * PER_SERVER * m.factor;
  const pct = Math.min(100, (tokens / WINDOW) * 100);

  return (
    <WidgetFrame title="The bill before your first message" hint="Estimate scaled from Anthropic's 5-server / 58-tool / ~55k-token measurement.">
      <Slider label="Connected MCP servers" value={servers} min={0} max={14} onChange={setServers} color={m.color} />
      <div className="mt-4 flex flex-wrap gap-2">
        {MODES.map((x) => (
          <Chip key={x.key} active={mode === x.key} onClick={() => setMode(x.key)} color={x.color}>
            {x.label}
          </Chip>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div>
          <motion.div key={`${mode}${servers}`} initial={{ scale: 0.9, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-6xl font-semibold tabular-nums" style={{ color: m.color }}>
            {fmtTokens(tokens)}
          </motion.div>
          <div className="text-[13px] text-mute">tokens of tool definitions, every session</div>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between font-mono text-[11px] text-mute">
            <span>context window (200k)</span>
            <span>{pct.toFixed(1)}% gone</span>
          </div>
          <div className="relative h-10 overflow-hidden rounded-xl border border-line bg-surface">
            <motion.div
              className="h-full"
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              style={{ background: `repeating-linear-gradient(135deg, ${m.color}cc 0 8px, ${m.color}88 8px 16px)` }}
            />
          </div>
          <p className="mt-2 text-[12.5px] text-mute">
            Anthropic has seen setups where definitions alone took <span className="text-ink">134k</span>.
          </p>
        </div>
      </div>

      {/* what this mode actually puts in front of the model */}
      <div className="mt-6 rounded-[12px] bg-sunken p-4">
        <p className="text-[14px] leading-relaxed">
          <span className="font-medium">{m.label.replace(/ \(.*\)$/, "")}:</span> {m.how}
          {mode === "code" ? " The catch: the code runs in a sandbox you now have to secure." : ""}
        </p>
        <pre className="mt-3 overflow-x-auto whitespace-pre rounded-[8px] bg-surface px-3 py-2.5 font-mono text-[12px] leading-relaxed text-ink/80">{m.example}</pre>
      </div>
    </WidgetFrame>
  );
}
