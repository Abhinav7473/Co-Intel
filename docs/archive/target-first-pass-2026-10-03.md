# Target, first-pass plan (archive)

## Original plan (first pass)
1. **Scroll-linked chapters**: chapter scenes use `useScroll({ target, offset })` + `useTransform` so the numeral,
   title and rule move with scroll position (reversible), instead of a one-shot reveal.
2. **Charts via Bklit**: replace hand-rolled bars in `SycophancyBars`, `PerceptionGap`, `MistakesAudit`
   (pooled results) with Bklit `bar`; `GuardrailChecklist` ring → Bklit `ring`; `ToolOverhead` window bar → `gauge`.
   Install into `ui/charts/`, strip effects, map colours to tokens.
3. **Evidence deck** → spotlight-card interaction (pointer-tracked highlight), ported without effects.
4. **Audit**: run MotionScore on the page; budget = no layout-triggering animations, LCP < 2.5 s.

