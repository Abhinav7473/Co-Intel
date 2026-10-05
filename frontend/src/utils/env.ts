interface UADataBrand {
  brand: string;
}

/**
 * Real refraction needs `backdrop-filter: url(#svg-filter)`, which only
 * Chromium renders. Safari/Firefox parse it but draw nothing, so feature
 * detection via CSS.supports lies — we sniff the engine instead.
 */
export const supportsLiquidGlass: boolean = (() => {
  if (typeof navigator === "undefined") return false;
  const brands = (navigator as Navigator & { userAgentData?: { brands: UADataBrand[] } })
    .userAgentData?.brands;
  return Boolean(brands?.some((b) => b.brand === "Chromium"));
})();
