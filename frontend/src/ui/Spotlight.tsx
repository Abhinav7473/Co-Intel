import type { HTMLAttributes, PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/utils/cn";

/**
 * Card with a soft light that follows the pointer (idea from Kokonut UI's
 * spotlight cards, MIT; rewritten with Motion values — no effects, no re-renders).
 */
export function Spotlight({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const glow = useMotionTemplate`radial-gradient(360px circle at ${x}px ${y}px, rgb(0 114 178 / 0.10), transparent 70%)`;

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(-400);
        y.set(-400);
      }}
      {...rest}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      {children}
    </div>
  );
}
