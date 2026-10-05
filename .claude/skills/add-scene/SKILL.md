---
name: add-scene
description: Add or edit a scene (statement, stat, compare, list, widget) in the AI Workflow Habits website, or turn new brief text into scenes. Use when the user asks to add content, a slide/scene, a section, or a new interactive widget to the brief.
---

# Add a scene

1. Read `docs/content.md` (scene kinds, three depths of detail, copy limits). Read `docs/design.md` only if adding a widget.
2. Put copy in `frontend/src/content/deck.ts`, in topic order (a topic page shows its scenes in that order). One idea per scene:
   - the scene gets ≤ 4 short lines; a line's extra sentence goes in `more`;
   - long form and links go in `details` / `sources`, never restating the lines.
3. New topic → add it to `SECTIONS` in `content/brief.ts` (with related `tools`) and give it a `chapter` scene.
   Write for the audience; presenter notes go to `docs/talk-notes.md`, questions to `docs/open-questions.md`.
4. New widget → component in `features/widgets/`, register in `features/widgets/index.tsx`, add the id to
   `WidgetId` in `content/types.ts`. Wrap it in `WidgetFrame`. Colours via tokens only. No `useEffect`.
   If it saves data, add a backend feature + migration (`docs/architecture.md`).
5. Pick the transition by kind (see `docs/design.md` → Motion). Don't invent new ones per scene.
6. Run `make check-content` and `make lint`. Both must pass.
7. If a decision was made (a rule, a rejected option), append one line to `docs/decisions.md`.
