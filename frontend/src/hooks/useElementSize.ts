import { useCallback, useState } from "react";

export interface Size {
  width: number;
  height: number;
}

/**
 * Measures an element with a ResizeObserver attached through a ref callback
 * (React 19 runs the returned cleanup on detach) — no effect needed.
 */
export function useElementSize<T extends Element>() {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry?.borderBoxSize[0];
      if (!box) return;
      const width = Math.round(box.inlineSize);
      const height = Math.round(box.blockSize);
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}
