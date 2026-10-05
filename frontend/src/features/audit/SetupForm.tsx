import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Panel } from "@/ui/Panel";
import { Segmented } from "@/ui/Segmented";
import { Toggle } from "@/ui/Toggle";
import type { Server, Setup, Skill } from "./analyze";

const input = "w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[14px] outline-none transition placeholder:text-mute/70 focus:border-accent focus:ring-4 focus:ring-accent/10";

/** Everything the audit reads. Controlled: the parent owns `setup` and re-analyses on every change. */
export function SetupForm({ setup, onChange }: { setup: Setup; onChange: (s: Setup) => void }) {
  const set = <K extends keyof Setup>(k: K, v: Setup[K]) => onChange({ ...setup, [k]: v });
  const lines = setup.memory ? setup.memory.split("\n").length : 0;

  return (
    <div className="space-y-5">
      <Panel className="p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="memory" className="font-medium">
            Always-on memory file
          </label>
          <span className="font-mono text-[12px] text-mute">
            {lines} lines · ~{Math.ceil(setup.memory.length / 4).toLocaleString()} tok
          </span>
        </div>
        <p className="mb-3 text-[13px] text-mute">CLAUDE.md, AGENTS.md, .cursorrules, a project brief — whatever loads every turn. It stays in your database only.</p>
        <textarea
          id="memory"
          value={setup.memory}
          onChange={(e) => set("memory", e.target.value)}
          spellCheck={false}
          placeholder="Paste the file here…"
          className={`${input} min-h-64 resize-y font-mono text-[12.5px] leading-relaxed`}
        />
      </Panel>

      <Panel className="p-5">
        <ListHeader title="Skills" count={setup.skills.length} onAdd={() => set("skills", [...setup.skills, { name: "", description: "", body: "" }])} />
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {setup.skills.map((s, i) => (
              <motion.li key={i} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <SkillRow
                  skill={s}
                  onChange={(next) => set("skills", setup.skills.map((x, j) => (j === i ? next : x)))}
                  onRemove={() => set("skills", setup.skills.filter((_, j) => j !== i))}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </Panel>

      <Panel className="p-5">
        <ListHeader title="MCP servers / connectors" count={setup.servers.length} onAdd={() => set("servers", [...setup.servers, { name: "", tools: 10, scope: "global" }])} />
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {setup.servers.map((s, i) => (
              <motion.li key={i} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <ServerRow
                  server={s}
                  onChange={(next) => set("servers", setup.servers.map((x, j) => (j === i ? next : x)))}
                  onRemove={() => set("servers", setup.servers.filter((_, j) => j !== i))}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </Panel>

      <Panel className="p-5">
        <div className="mb-3 font-medium">In one session, can the assistant…</div>
        {(
          [
            ["private", "read private data (files, inbox, participant data)?"],
            ["untrusted", "read untrusted content (web pages, tickets, inbound email)?"],
            ["outbound", "send data out (email, post, write to a URL)?"],
          ] as const
        ).map(([k, label]) => (
          <div key={k} className="flex items-center justify-between gap-4 border-t border-line py-3 first:border-t-0">
            <span className="text-[14px]">{label}</span>
            <Toggle label={label} checked={setup.legs[k]} onChange={(v) => set("legs", { ...setup.legs, [k]: v })} warn />
          </div>
        ))}
      </Panel>
    </div>
  );
}

function ListHeader({ title, count, onAdd }: { title: string; count: number; onAdd: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="font-medium">
        {title} <span className="font-mono text-[12px] text-mute">{count}</span>
      </span>
      <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-[13px] text-accent transition hover:bg-accent-soft">
        <Plus className="size-3.5" /> Add
      </button>
    </div>
  );
}

function SkillRow({ skill, onChange, onRemove }: { skill: Skill; onChange: (s: Skill) => void; onRemove: () => void }) {
  return (
    <div className="space-y-2 rounded-[12px] bg-sunken p-3">
      <div className="flex gap-2">
        <input className={input} value={skill.name} onChange={(e) => onChange({ ...skill, name: e.target.value })} placeholder="Skill name" maxLength={80} />
        <RemoveButton onClick={onRemove} />
      </div>
      <input className={input} value={skill.description} onChange={(e) => onChange({ ...skill, description: e.target.value })} placeholder="Description (the routing line)" maxLength={1024} />
      <textarea
        className={`${input} min-h-16 font-mono text-[12px]`}
        value={skill.body}
        onChange={(e) => onChange({ ...skill, body: e.target.value })}
        placeholder="SKILL.md body (optional)"
      />
    </div>
  );
}

function ServerRow({ server, onChange, onRemove }: { server: Server; onChange: (s: Server) => void; onRemove: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[12px] bg-sunken p-2">
      <input className={`${input} min-w-32 flex-1`} value={server.name} onChange={(e) => onChange({ ...server, name: e.target.value })} placeholder="Server" maxLength={80} />
      <label className="flex items-center gap-1.5 text-[12px] text-mute">
        <input
          type="number"
          min={0}
          max={500}
          value={server.tools}
          onChange={(e) => onChange({ ...server, tools: Math.max(0, Math.min(500, Number(e.target.value) || 0)) })}
          className={`${input} w-20 text-right font-mono`}
        />
        tools
      </label>
      <Segmented
        label="Scope"
        size="sm"
        value={server.scope}
        onChange={(scope) => onChange({ ...server, scope })}
        options={[
          { value: "global", label: "Global" },
          { value: "project", label: "Project" },
        ]}
      />
      <RemoveButton onClick={onRemove} />
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Remove" className="shrink-0 rounded-[8px] p-2 text-mute transition hover:bg-warn-soft hover:text-warn">
      <X className="size-4" />
    </button>
  );
}
