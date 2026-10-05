import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenText, ClipboardCheck, FlaskConical, Library, ScanSearch } from "lucide-react";
import { motion, useScroll } from "motion/react";
import { LiquidGlass } from "@/ui/LiquidGlass";
import { CONTAINER } from "./layout";

const NAV = [
  { to: "/", label: "Topics", icon: BookOpenText, match: (p: string) => p === "/" || p.startsWith("/topics") },
  { to: "/audit", label: "Audit", icon: ScanSearch, match: (p: string) => p.startsWith("/audit") },
  { to: "/assess", label: "Assess", icon: ClipboardCheck, match: (p: string) => p.startsWith("/assess") },
  { to: "/experiments", label: "Experiments", icon: FlaskConical, match: (p: string) => p.startsWith("/experiments") },
  { to: "/kb", label: "Knowledge", icon: Library, match: (p: string) => p.startsWith("/kb") },
] as const;

/**
 * The one bar every page shares. The active-page highlight is a single element
 * that slides between items (Motion `layoutId`); the hairline at the bottom
 * is page scroll progress (Motion `useScroll`), no React re-renders.
 */
export function TopBar({ extra }: { extra?: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { scrollYProgress } = useScroll();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-30" style={{ viewTransitionName: "topbar" }}>
      <div className={CONTAINER}>
        <LiquidGlass radius={16} bezel={14} refraction={18} frost={1.5} className="pointer-events-auto flex h-14 items-center gap-2 px-2.5">
          <Link to="/" className="relative z-10 flex shrink-0 items-center gap-2.5 rounded-xl px-2 py-1.5">
            <img src="/favicon.svg" alt="" width={28} height={28} className="size-7" />
            <span className="hidden text-[15px] font-semibold tracking-tight lg:inline">Workflow Habits</span>
          </Link>
          <nav aria-label="Main" className="relative z-10 ml-auto flex items-center gap-0.5">
            {NAV.map((n) => {
              const on = n.match(path);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  aria-current={on ? "page" : undefined}
                  className={`relative flex h-9 items-center gap-2 rounded-[10px] px-3 text-[13px] transition-colors ${on ? "text-ink" : "text-mute hover:text-ink"}`}
                >
                  {on ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-[10px] bg-surface shadow-[0_1px_2px_rgb(22_24_29/0.12),0_2px_8px_rgb(22_24_29/0.06)]"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  ) : null}
                  <n.icon className="relative size-4" />
                  <span className="relative hidden sm:inline">{n.label}</span>
                </Link>
              );
            })}
          </nav>
          {extra}
          <motion.span aria-hidden className="absolute inset-x-4 bottom-0 z-10 h-px origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
        </LiquidGlass>
      </div>
    </div>
  );
}
