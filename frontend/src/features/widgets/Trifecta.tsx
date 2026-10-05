import { useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { WidgetFrame } from "@/ui/Panel";
import { Toggle } from "@/ui/Toggle";

const LEGS = [
  { key: "private", name: "Private data", eg: "participant data connector, Drive, email inbox", cx: 150, cy: 120, color: "#0072b2" },
  { key: "untrusted", name: "Untrusted content", eg: "web fetch, public tickets, inbound email", cx: 250, cy: 120, color: "#0072b2" },
  { key: "outbound", name: "A way out", eg: "send email, post, write to a public URL", cx: 200, cy: 205, color: "#0072b2" },
] as const;

type Leg = (typeof LEGS)[number]["key"];

export function Trifecta() {
  const [on, setOn] = useState<Record<Leg, boolean>>({ private: true, untrusted: true, outbound: false });
  const count = Object.values(on).filter(Boolean).length;
  const lethal = count === 3;

  return (
    <WidgetFrame title="Break one leg" hint="Switch on the capabilities your session has. All three together can be prompt-injected into leaking.">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          {LEGS.map((l) => (
            <div key={l.key} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-3.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-medium">
                  <span className="size-2.5 rounded-full" style={{ background: l.color, boxShadow: `0 0 12px ${l.color}` }} />
                  {l.name}
                </div>
                <div className="truncate text-[12.5px] text-mute">{l.eg}</div>
              </div>
              <Toggle
                label={l.name}
                checked={on[l.key]}
                warn={lethal}
                onChange={(v) => setOn((s) => ({ ...s, [l.key]: v }))}
              />
            </div>
          ))}
        </div>

        <div className="relative">
          <svg viewBox="0 0 400 320" className="w-full" role="img" aria-label={`${count} of 3 trifecta legs active`}>
            <defs>
              <filter id="tri-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
            </defs>
            <g style={{ mixBlendMode: "screen" }}>
              {LEGS.map((l) => (
                <motion.circle
                  key={l.key}
                  cx={l.cx}
                  cy={l.cy}
                  r={88}
                  animate={{ fillOpacity: on[l.key] ? 0.42 : 0.04, strokeOpacity: on[l.key] ? 0.9 : 0.25 }}
                  fill={l.color}
                  stroke={l.color}
                  strokeWidth={1.5}
                />
              ))}
            </g>
            <AnimatePresence>
              {lethal ? (
                <motion.circle
                  cx={200}
                  cy={150}
                  r={34}
                  fill="#a94400"
                  filter="url(#tri-glow)"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: [0.6, 1, 0.6], scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { repeat: 2, duration: 1.4 } }}
                />
              ) : null}
            </AnimatePresence>
          </svg>
          <AnimatePresence mode="wait">
            <motion.div
              key={lethal ? "bad" : "ok"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`mx-auto -mt-2 flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium ${lethal ? "bg-warn/20 text-warn" : "bg-accent/15 text-accent"}`}
            >
              {lethal ? <ShieldAlert className="size-4" /> : <ShieldCheck className="size-4" />}
              {lethal ? "Lethal trifecta: exfiltration is possible" : `${3 - count} leg${3 - count === 1 ? "" : "s"} broken — keep it that way`}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <p className="mt-5 text-[13px] text-mute">
        Practical rule: a connector that reads participant data and a web-fetch tool should not share a session with anything that can post or email.
      </p>
    </WidgetFrame>
  );
}
