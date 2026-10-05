import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  tone?: "solid" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
}

const TONES = {
  solid: "bg-ink text-canvas hover:bg-ink/85 shadow-[0_1px_2px_rgb(22_24_29/0.2)]",
  outline: "card text-ink hover:border-line-strong",
  ghost: "text-mute hover:bg-ink/[0.05] hover:text-ink",
  danger: "text-warn hover:bg-warn-soft",
} as const;

export function Button({ icon, tone = "outline", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-[12px] font-medium tracking-tight transition duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-sm",
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
