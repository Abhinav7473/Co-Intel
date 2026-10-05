# Target (set 2026-10-03)

**Goal:** a scrolling website where each idea gets its own screen and moves with the scroll, not one that
merely fades in once. Charts look designed, not hand-rolled. Still one animation engine and one theme.

## Libraries — verdicts
| Library | What it is | Verdict |
|---|---|---|
| **Motion** (motion.dev) | MIT. Already our engine (`motion@14`). Scroll-linked values (`useScroll`/`useTransform`), layout animations, springs, `AnimatePresence`. Paid tier (Motion+) adds Motion UI components and an AI kit; free MotionScore audits performance. | **Keep, use more of it.** We only use `whileInView`; move chapter scenes to scroll-linked progress. |
| **Bklit UI** (bklit.com) | MIT, ~1.7k★. Composable charts (bar, ring, gauge, funnel, radar, heatmap, sankey…) installed as source via the shadcn registry. Built on visx 4 (alpha), d3, `motion` 12, Base UI, NumberFlow. | **Adopt selectively** for charts: `bar`, `ring`, `gauge`. Source must be ported: `bar-chart.tsx` has 3 effects, `ring-chart.tsx` 2 (`gauge.tsx` and `bar.tsx` have none). visx 4 is alpha: pin exactly. |
| **Kokonut UI** (kokonutui.com) | MIT. 46 free components (Tailwind + shadcn + Motion): text effects (shimmer, sliced, swoosh, glitch, matrix), backgrounds (beams, paths, flow field), cards (spotlight, flip, stack), morphic navbar. | **Borrow ideas, port code.** 26/46 use `useEffect` or Next.js imports (`next/image`). Its "liquid glass card" is turbulence noise, not refraction — keep ours. Candidates: `spotlight-cards` (evidence deck), `sliced-text`/`shimmer-text` (chapter titles), `background-paths` (hero). |
| **anime.js v4** | Modular (~24 KB total), timelines, scroll observer, draggable, SVG morph/line-draw, text splitting. No official React bindings. | **Reject.** A second animation engine duplicates Motion; React use needs effect wiring we ban. Motion's `pathLength` covers line drawing. |

## Status (2026-10-03, second pass)
Done: light theme by measured contrast · topic hub + page per topic · view-transition types between topics ·
scroll-linked sub-scenes · spotlight cards · flow paths · four tools (audit, assessment, experiments, knowledge base).
Charts are our own small set (`ui/charts`), not Bklit yet.

Still open, in order:
1. **Bklit charts** for the experiment comparison and assessment history (time series of scores).
2. **Mobile pass**: topic rail becomes a top sheet; audit form/report stack with a sticky score.
3. **MotionScore audit** of the home and topic pages.
4. **Export**: audit report and assessment result as Markdown, so they can go back into the Claude Doc.
5. **Seed editing**: let knowledge-base entries be promoted into scene `details` (today content edits are code).

## Original plan (first pass)
1. **Scroll-linked chapters**: chapter scenes use `useScroll({ target, offset })` + `useTransform` so the numeral,
   title and rule move with scroll position (reversible), instead of a one-shot reveal.
2. **Charts via Bklit**: replace hand-rolled bars in `SycophancyBars`, `PerceptionGap`, `MistakesAudit`
   (pooled results) with Bklit `bar`; `GuardrailChecklist` ring → Bklit `ring`; `ToolOverhead` window bar → `gauge`.
   Install into `ui/charts/`, strip effects, map colours to tokens.
3. **Evidence deck** → spotlight-card interaction (pointer-tracked highlight), ported without effects.
4. **Audit**: run MotionScore on the page; budget = no layout-triggering animations, LCP < 2.5 s.

## Acceptance
- `make lint` and `make check-content` pass; no `useEffect` in our tree (copied code included).
- Only `--color-accent` / `--color-warn` hues on screen.
- Scrolling is native everywhere; nothing intercepts wheel or keys.
