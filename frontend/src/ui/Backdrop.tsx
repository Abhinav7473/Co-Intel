/**
 * The page backdrop: off-white canvas, two faint fields of the accent, a fine
 * grid. Quiet on purpose (it sits behind reading), but with enough structure
 * for the glass to have something to bend.
 */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-canvas">
      <div
        className="absolute -left-[15%] -top-[25%] h-[70vmax] w-[70vmax] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(0 114 178 / 0.10), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-[30%] -right-[20%] h-[65vmax] w-[65vmax] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(230 159 0 / 0.08), transparent 70%)" }}
      />
      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
    </div>
  );
}
