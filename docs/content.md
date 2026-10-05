# Content model

Source of truth for the research: the Claude Doc "AI Workflow Habits: Research Brief".
The site is audience material for a talk. Presenter notes live in `docs/talk-notes.md`, never in the site.

## Files (`frontend/src/content/`)
- `brief.ts` — `SECTIONS`: 10 topics (slug, num, title, kicker, related `tools`).
- `deck.ts` — `SLIDES`: scenes in topic order. Each topic page renders its scenes (except the `chapter` marker).
- `data.ts` — datasets the widgets render (studies, mistakes, guardrails, Odysseus, sources).
- `assessment.ts` — 18 questions (topic, options worth 0–3, `fix`); `scoreAnswers` → per-topic % and fixes.
- `experiments.ts` — metrics and templates (hypothesis, A/B labels, metrics, protocol).
- `tools.ts` — the four tools for nav, home and topic headers.
Audit rules live in code (`features/audit/analyze.ts`), each with the topic it cites.

## Scene kinds
`statement` · `stat` · `compare` · `list` · `widget` (+ `chapter` marker per topic).

## Access to information, in three depths
1. Scene: one idea, ≤ 4 short lines. 2. Line `more`: one sentence behind a `+`. 3. `details` + `sources`.
Each fact appears once. Do not restate a scene's lines in its details.

## Copy limits (enforced by `make check-content`)
≤ 4 lines per statement/list · ≤ 3 compare columns · line ≤ 90 chars · heading ≤ 60 · `more` ≤ 220 ·
details paragraph ≤ 320 · unique ids · every topic has a chapter scene · every stat names its source.

## Inline markup
`**bold**`, `*italic*`, `[label](https://url)` via `utils/inline.tsx`. Nothing else.
