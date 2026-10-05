# Design system

## Palette (`frontend/src/styles.css` → `@theme`) — one light theme
Chosen for reading and projecting: warm off-white canvas (less glare than pure white), near-black ink,
one accent. Colour-blind-safe pairs from Okabe-Ito.

| Token | Value | Use | Contrast on canvas |
|---|---|---|---|
| `canvas` / `surface` / `sunken` | #f6f5f1 / #fff / #eeece6 | page / cards / wells | — |
| `ink` | #16181d | text | 16.3 |
| `mute` | #5b616e | secondary text | 5.7 |
| `accent` (+`-soft`) | #0072b2 | links, active, series B | 4.75 |
| `warn` (+`-soft`) | #a94400 | risk only | 5.5 |
| `caution` (+`-soft`) | #7a5200 | "fix this" badges | 6.3 on soft |
| `series-b` | #e69f00 | series A in A/B charts; fill only, never text | 2.1 |
`line` / `line-strong` are ink at 10% / 22%. Okabe sky blue #56b4e9 is the third data colour (budget bar).

## Themes (one hue per site-map group)
`--color-t-{sees,feeds,costs,wrong,behind}` in a plain `:root` block (Tailwind drops unused `@theme` vars): Okabe blue,
bluish green, orange, reddish purple, slate, darkened to ≥ 4.75:1 on canvas. `hue(group)` (`brief.ts`) sets
`--color-topic` on a subtree; chrome uses `bg-/text-/border-topic` (topic header, scene markers, stat gradient, guides,
map blocks). Widgets keep `accent`/`series-b` so data colours never collide with a theme. Each topic has a Lucide emblem.

## Icon
`public/favicon.svg`: a context window as a grid of token cells, three in use (memory blue, one tool orange), the rest free.

## Geometry & type
Panels 20px · controls 12px · top bar 16px · switches are pills. Tokens: `rounded-panel`, `rounded-control`, `rounded-bar`
(new code uses these; ~40 older `rounded-[Npx]` values remain, see open-questions). `card` utility = white + hairline + soft
shadow. `field` utility = every text input/textarea (one definition in `styles.css`).
Fraunces (display), Inter (body; light weight for fine lines), JetBrains Mono (labels).

## Controls
- Range knob (`.range`): white 22px knob, hairline, soft shadow, accent halo on hover/focus, grows while dragged.
- Toggle: iOS-style, white knob with shadow, spring travel via Motion `layout`.
- Segmented: one highlight that slides between options (`layoutId`).

## Glass
`ui/LiquidGlass.tsx` — real refraction (SVG displacement map via `backdrop-filter: url()`), Chromium only, frosted
fallback elsewhere. Only on the top bar and the hero lens. Everything else is solid cards.

## Motion (library: `motion`)
| Feature | Where |
|---|---|
| View Transitions (router `defaultViewTransition` types) | between pages: `topic-next`/`topic-prev` slide, `enter-topic` rises, `page` fades |
| `useScroll` + `useTransform` (scroll-linked) | topic sub-scenes: rise / zoom / wipe / iris / push envelope per kind; top-bar progress line |
| `whileInView` + variants stagger | lines, columns, cards entering |
| `layoutId` | nav pill, segmented control, topic-rail marker |
| `layout` + `AnimatePresence popLayout` | knowledge-base lists, audit findings, experiment runs |
| `AnimatePresence custom={dir}` | assessment steps slide in the direction you move |
| `useMotionValue` + `useMotionTemplate` | `Spotlight` cards (pointer-following light, no re-renders) |
| `pathLength` | `Gauge` arc |
| `useMotionValue` + `useTransform` + `clip-path` | hero `ContextScrubber` (comparison slider, no re-render while scrubbing) |
Rule: scroll-linked motion is entry-only (finishes when the scene reaches 40% from the top); content you are
reading never fades. Never put `whileInView` on a clipped element (a fully clipped box never intersects).

## Hero (2026-10-05)
One orchestrated load: title words resolve from blur, the context window fills cell by cell in reading order
(`.cell-fill`, CSS, staggered by `--i`) while the free-token counters count down from 200k (Motion value, no re-render),
then the divider sweeps once. One hand-drawn underline on "what the model sees". Behind it: one bloom per theme hue under
a CSS-only `grain`. Ideas, not code, from SmoothUI (Focus Blur Resolve, Number Flow) and Componentry (Annotated Text);
their aurora/prism/dither backgrounds were skipped as generic.

## Borrowed ideas (MIT, rewritten without effects)
Kokonut UI: spotlight cards → `ui/Spotlight`. The scrubber adapts the cursor-scrub idea from a pasted generator spec (no assets used). Charts are our own small
`ui/charts` (Gauge, Bars, Radar); Bklit adoption is still a target (`docs/target.md`).

## Known AI-generated-design tells in the current build (audit 2026-10-04, via `frontend-design` + `design-taste-frontend`)
To remove in the redesign. Each is named in those skills as a default, not a choice. ✓ = removed so far.
- Warm cream canvas (#f6f5f1 ≈ the #F4F1EA cluster) + high-contrast serif display (Fraunces).
- ✓ One word accented in the headline (*Habits* in italic gradient). Gradient text remains on stat scenes.
- ALL-CAPS tracked mono eyebrow above nearly every heading (✓ hero and widget frames; still on tool pages and home sections).
- Section-number markers (01–10) on content that isn't a sequence; `A · B · C` meta strings; `→` appended to links.
- SaaS card kit: identical rounded white cards with the same soft shadow everywhere; 3-up equal card grids.
- Fade-and-slide-up on every section and hover lift on every card instead of one orchestrated moment.
- Inter as body default; monospace for small data labels; Lucide icons (taste skill prefers Phosphor/Tabler).
- ✓ Decorative SVG (flow paths) and the hero lens — replaced by the context scrubber (subject-specific).
