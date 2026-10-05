import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

/** A white card on the canvas. Big surfaces stay solid: glass is for small things on top. */
export function Panel({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card rounded-[20px]", className)} {...rest}>
      {children}
    </div>
  );
}

/** Frame for an interactive piece: eyebrow, title, hint, actions on the right. */
export function WidgetFrame({
  title,
  hint,
  actions,
  children,
  className,
}: {
  title: string;
  hint?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Panel className={cn("p-5 sm:p-8", className)}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-display text-xl font-medium tracking-tight sm:text-2xl">{title}</h4>
          {hint ? <p className="mt-1 max-w-2xl text-[13.5px] text-mute">{hint}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </Panel>
  );
}

/** Toggle chip (multi-select filters). Single choice → use `Segmented`. */
export function Chip({
  active,
  onClick,
  children,
  color,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-[10px] border px-3 text-[12.5px] font-medium transition duration-200",
        active ? "border-ink bg-ink text-canvas" : "border-line bg-surface text-mute hover:border-line-strong hover:text-ink",
      )}
    >
      {color ? <span className="size-2 rounded-full" style={{ background: color }} /> : null}
      {children}
    </button>
  );
}
