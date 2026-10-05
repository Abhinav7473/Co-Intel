import { useId, useMemo, type CSSProperties, type HTMLAttributes } from "react";
import { useElementSize } from "@/hooks/useElementSize";
import { cn } from "@/utils/cn";
import { refractionMap } from "@/utils/displacement";
import { supportsLiquidGlass } from "@/utils/env";

export interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  /** corner radius in px (use a big number for pills) */
  radius?: number;
  /** width of the refracting rim in px */
  bezel?: number;
  /** maximum pixel shift at the rim */
  refraction?: number;
  /** blur (std-dev px) applied before refraction; 0 = crystal clear */
  frost?: number;
  /** split R/G/B slightly at the rim like real glass dispersion */
  aberration?: boolean;
  /** extra saturation of what's seen through the glass */
  saturate?: number;
  /** fill colour/gradient layered on the glass */
  tint?: string;
}

/**
 * Refractive glass (iOS 26 "Liquid Glass"-style), not frosted glass.
 *
 * Chromium: the backdrop is warped through an SVG displacement map computed
 * for this element's exact size, so lines and colours behind the rim bend.
 * Elsewhere: graceful frosted fallback with the same rim lighting.
 */
export function LiquidGlass({
  radius = 28,
  bezel = 22,
  refraction = 26,
  frost = 1.2,
  aberration = true,
  saturate = 1.3,
  tint = "linear-gradient(160deg, rgb(255 255 255 / 0.62), rgb(255 255 255 / 0.34))",
  className,
  style,
  children,
  ...rest
}: LiquidGlassProps) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const filterId = `lg${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const ready = supportsLiquidGlass && size.width > 0 && size.height > 0;

  const map = useMemo(
    () =>
      ready
        ? refractionMap({ width: size.width, height: size.height, radius, bezel })
        : "",
    [ready, size.width, size.height, radius, bezel],
  );

  const glassStyle: CSSProperties = {
    borderRadius: radius,
    background: tint,
    ...(ready
      ? { backdropFilter: `url(#${filterId})` }
      : { backdropFilter: `blur(16px) saturate(${saturate})`, WebkitBackdropFilter: `blur(16px) saturate(${saturate})` }),
    ...style,
  };

  return (
    <div ref={ref} className={cn("glass-rim", className)} style={glassStyle} {...rest}>
      {ready && map ? (
        <svg aria-hidden width="0" height="0" className="pointer-events-none absolute">
          <filter
            id={filterId}
            x="0"
            y="0"
            width={size.width}
            height={size.height}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={frost} result="soft" />
            <feImage
              href={map}
              x="0"
              y="0"
              width={size.width}
              height={size.height}
              preserveAspectRatio="none"
              result="map"
            />
            {aberration ? (
              <>
                <Channel scale={refraction * 2} keep="r" />
                <Channel scale={refraction * 2 * 0.92} keep="g" />
                <Channel scale={refraction * 2 * 0.84} keep="b" />
                <feBlend in="ch-r" in2="ch-g" mode="screen" result="rg" />
                <feBlend in="rg" in2="ch-b" mode="screen" result="bent" />
              </>
            ) : (
              <feDisplacementMap
                in="soft"
                in2="map"
                scale={refraction * 2}
                xChannelSelector="R"
                yChannelSelector="G"
                result="bent"
              />
            )}
            <feColorMatrix in="bent" type="saturate" values={String(saturate)} />
          </filter>
        </svg>
      ) : null}
      {/* top sheen: the bright caustic band real glass catches */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          borderRadius: radius,
          background:
            "radial-gradient(120% 60% at 50% -10%, rgb(255 255 255 / 0.7), transparent 55%)",
        }}
      />
      {children}
    </div>
  );
}

const KEEP = {
  r: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  g: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  b: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
} as const;

function Channel({ scale, keep }: { scale: number; keep: keyof typeof KEEP }) {
  return (
    <>
      <feDisplacementMap
        in="soft"
        in2="map"
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
        result={`d-${keep}`}
      />
      <feColorMatrix in={`d-${keep}`} type="matrix" values={KEEP[keep]} result={`ch-${keep}`} />
    </>
  );
}
