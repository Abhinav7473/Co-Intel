import { useId } from "react";
import { cn } from "@/utils/cn";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  /** fill colour of the travelled part of the track */
  color?: string;
  className?: string;
}

/** Native range input (keyboard + a11y for free) with a proper knob (see `.range` in styles.css). */
export function Slider({ label, value, min, max, step = 1, onChange, format, color = "var(--color-accent)", className }: SliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <label htmlFor={id} className="text-mute">
          {label}
        </label>
        <output htmlFor={id} className="font-mono font-medium tabular-nums text-ink">
          {format ? format(value) : value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range w-full"
        style={{ background: `linear-gradient(90deg, ${color} 0%, ${color} ${pct}%, rgb(22 24 29 / 0.1) ${pct}%)` }}
      />
    </div>
  );
}
