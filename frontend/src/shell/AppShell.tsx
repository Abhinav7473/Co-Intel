import type { ReactNode } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { Backdrop } from "@/ui/Backdrop";
import { cn } from "@/utils/cn";
import { CONTAINER } from "./layout";
import { TopBar } from "./TopBar";

export function AppShell() {
  return (
    <>
      <a href="#content" className="sr-only z-50 rounded-[10px] bg-ink px-4 py-2 text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Backdrop />
      <TopBar />
      {/* named so view transitions can animate page content separately from the bar */}
      <div id="content" tabIndex={-1} className="outline-none" style={{ viewTransitionName: "main" }}>
        <Outlet />
      </div>
    </>
  );
}

/** Standard page frame for tool pages: eyebrow, title, lead, then content. */
export function Page({
  eyebrow,
  title,
  lead,
  actions,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn(CONTAINER, "pb-28 pt-32", className)}>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <div className="mb-3 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">{eyebrow}</div>
          <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">{title}</h1>
          {lead ? <p className="mt-4 text-lg leading-relaxed text-mute">{lead}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </header>
      {children}
    </main>
  );
}

export function NotFound() {
  return (
    <Page eyebrow="404" title="That page doesn't exist.">
      <Link to="/" className="text-accent hover:underline">
        Back to the topics →
      </Link>
    </Page>
  );
}
