import { useSyncExternalStore } from "react";

/**
 * Where the reader is, and which scenes they have already seen. Drives every "You are here" marker
 * (topic rail, map page, home map, mobile pill). A tiny external store read with useSyncExternalStore.
 * Visited scenes persist in localStorage as a per-viewer convenience; the site works without it.
 */
export interface Position {
  topic: string | null;
  scene: string | null;
}

const KEY = "wh.visited.v1";
const LAST = "wh.last.v1";

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private window or blocked storage: keep it in memory only */
  }
};

let position: Position = load<Position>(LAST, { topic: null, scene: null });
let visited: ReadonlySet<string> = new Set(load<string[]>(KEY, []));
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Called by the topic page as scenes cross the reading line. */
export function setPosition(topic: string, scene: string | null) {
  if (position.topic === topic && position.scene === scene) return;
  position = { topic, scene };
  save(LAST, position);
  if (scene && !visited.has(scene)) {
    visited = new Set(visited).add(scene);
    save(KEY, [...visited]);
  }
  emit();
}

export const usePosition = () => useSyncExternalStore(subscribe, () => position, () => position);
export const useVisited = () => useSyncExternalStore(subscribe, () => visited, () => visited);

/**
 * Ref callback for a topic's scene column: the scene crossing a line 40% down the viewport is
 * "here". IntersectionObserver, so nothing runs on scroll frames; cleans up when the node goes.
 */
const trackers = new Map<string, (el: HTMLElement | null) => (() => void) | undefined>();
export const trackScenes = (topic: string) => {
  // one stable callback per topic, so re-renders don't re-observe
  let t = trackers.get(topic);
  if (!t) trackers.set(topic, (t = (el) => observe(topic, el)));
  return t;
};

function observe(topic: string, el: HTMLElement | null) {
  if (!el) return;
  const hash = decodeURIComponent(location.hash.slice(1));
  setPosition(topic, hash && el.querySelector(`article[id="${CSS.escape(hash)}"]`) ? hash : null);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setPosition(topic, e.target.id);
    },
    { rootMargin: "-40% 0px -59% 0px" },
  );
  el.querySelectorAll("article[id]").forEach((a) => io.observe(a));
  return () => io.disconnect();
}
