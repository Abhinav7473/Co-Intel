/** The whole palette: one accent, one warning. Everything else is greyscale. */
export const ACCENT = "#0072b2";
export const WARN = "#a94400";
export const MUTE = "#5b616e";
/** second data series (A/B comparisons). Fill only: too light for text. */
export const SERIES_B = "#e69f00";

export const fmtTokens = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k` : `${Math.round(n)}`;

export const fmtUsd = (n: number) =>
  n < 1 ? `$${n.toFixed(3)}` : `$${n.toFixed(2)}`;

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
