import { useSyncExternalStore } from "react";

/**
 * Native-scroll conductor for the /intro world (adapted from build-threejs-scroll-worlds'
 * scroll-conductor.js). Document scroll is the only source of truth: each chapter's centre is an
 * anchor, and scrollY becomes a fractional chapter value (2.35 = 35% from chapter 2 to 3).
 * The rail reads the active screen; `goTo` jumps to a screen's anchor.
 */
export const rig = { exact: 0, anchors: [] as number[] };

let active = 0;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l));
/** Index of the chapter currently being read; re-renders only when it changes. */
export const useActiveChapter = () => useSyncExternalStore(subscribe, () => active, () => active);

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Ref callback for the story root: measures `[data-chapter]` sections and follows scroll. */
export function conduct(root: HTMLElement | null) {
  if (!root) return;
  const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
  const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);

  const measure = () => {
    const max = maxScroll();
    rig.anchors = sections.map((el, i) => {
      if (i === 0) return 0;
      if (i === sections.length - 1) return max;
      const top = el.getBoundingClientRect().top + scrollY;
      return clamp(top + el.offsetHeight / 2 - innerHeight / 2, 0, max);
    });
    for (let i = 1; i < rig.anchors.length; i++) rig.anchors[i] = Math.max(rig.anchors[i]!, rig.anchors[i - 1]! + 1);
  };

  const read = () => {
    const y = clamp(scrollY, 0, maxScroll());
    const a = rig.anchors;
    let p = a.length - 1;
    for (let i = 0; i < a.length - 1; i++) {
      if (y <= a[i + 1]!) {
        p = i + clamp((y - a[i]!) / Math.max(1, a[i + 1]! - a[i]!), 0, 1);
        break;
      }
    }
    rig.exact = p;
    const now = Math.round(p);
    if (now !== active) {
      active = now;
      listeners.forEach((l) => l());
    }
  };

  const remeasure = () => {
    measure();
    read();
  };
  remeasure();
  addEventListener("scroll", read, { passive: true });
  addEventListener("resize", remeasure, { passive: true });
  const ro = new ResizeObserver(remeasure);
  sections.forEach((s) => ro.observe(s));
  void document.fonts.ready.then(remeasure);
  return () => {
    removeEventListener("scroll", read);
    removeEventListener("resize", remeasure);
    ro.disconnect();
  };
}

/** Scroll to a chapter's anchor (rail clicks). Native smooth scroll; instant under reduced motion. */
export function goTo(i: number, reduce: boolean) {
  const y = rig.anchors[i];
  if (y !== undefined) scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}
