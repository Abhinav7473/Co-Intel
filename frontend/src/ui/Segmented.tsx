import { useId } from "react";
import { LayoutGroup, motion } from "motion/react";
import { cn } from "@/utils/cn";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** optional colour dot (data series) */
  dot?: string;
}

/**
 * Segmented control. The selected highlight is one element that slides
 * between options (Motion `layoutId`), instead of each option fading.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const group = useId();
  return (
    <LayoutGroup id={group}>
      <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-[12px] bg-sunken p-1">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.value)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-[9px] font-medium transition-colors",
                size === "sm" ? "h-7 px-2.5 text-[12px]" : "h-8 px-3 text-[13px]",
                on ? "text-ink" : "text-mute hover:text-ink",
              )}
            >
              {on ? (
                <motion.span
                  layoutId="seg"
                  className="absolute inset-0 rounded-[9px] bg-surface shadow-[0_1px_2px_rgb(22_24_29/0.12),0_2px_6px_rgb(22_24_29/0.06)]"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              ) : null}
              {o.dot ? <span className="relative size-2 rounded-full" style={{ background: o.dot }} /> : null}
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
