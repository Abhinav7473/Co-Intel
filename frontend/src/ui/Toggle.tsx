import { motion } from "motion/react";
import { cn } from "@/utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  /** use the warning colour when "on" means risk */
  warn?: boolean;
  disabled?: boolean;
}

/** iOS-style switch: white knob with a real shadow, spring travel (Motion `layout`). */
export function Toggle({ checked, onChange, label, warn = false, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex h-[30px] w-[52px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-300 disabled:opacity-40",
        checked ? (warn ? "justify-end bg-warn" : "justify-end bg-accent") : "justify-start bg-ink/15",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 600, damping: 34 }}
        className="block size-6 rounded-full bg-white shadow-[0_1px_1px_rgb(0_0_0/0.08),0_2px_6px_rgb(0_0_0/0.2)]"
      />
    </button>
  );
}
