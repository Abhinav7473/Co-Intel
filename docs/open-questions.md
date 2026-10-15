# Open questions & gaps

Questions for Abhinav and known gaps. **Not** for the website: the site is audience material for the talk.
Answer inline; answered items move to `docs/decisions.md` (standing) and the history, and are deleted here.

## Next session: start here (handoff 2026-10-15)
1. **/intro is v7**: preface (hands up, premise "Demystifying the LLM space"), two failure modes, recap, thanks
   (17 screens). Brief: `docs/seminar/brief.md`. Run sheet with your opening script: `docs/talk-notes.md`. Ground
   truth: `make check-intro` (17 screens fit at 1080p, 720p and phone, PageDown lands on each, no console errors).
   Vercel deploy steps: `docs/dev-env.md`, "Deploy".
2. **Docs restructured:** `docs/decisions.md` is standing decisions only (relevance + durability); history, old talk
   versions, the v1–v5 audit and older questions are in `docs/archive/` (not loaded by default).
3. **Stack note:** your watch rebuilt `web-dev` after the dependency removal and `api-dev` stopped (known Compose 2.38
   quirk, `docs/dev-env.md`). `docker compose start api-dev` brings it back; /intro doesn't need it.

## Questions: junior seminar
- **`STAGE` vs `CONTAINER`:** /intro uses a full-width frame, which bends CLAUDE.md's "every page uses CONTAINER". Keep
  the exception for the projected talk, or go back to the 1240px container?
- **Length:** v7 runs about 16 minutes before questions (preface + recap add ~2). Is 15 a hard limit? If so, the
  toolkit or the second context-rot test (screens 9–11) is the place to cut.
- **Approve the brief?** `docs/seminar/brief.md` was drafted from chat, not written by you. Edit or approve.
- **The 5×5 yes-man runs** (protocol in `docs/archive/talk-notes-junior-v1-v5.md`, "Before class"): run in Claude Code
  on the on-screen rationale? Then the opening screen's "?" can become real answers.
- **Live moment:** which sample project do you open for `/context` on screen 4? A small public repo works best.
- **chrome-devtools-mcp:** it needs a project `.mcp.json` and runs through `npx` on the host, which the no-host-installs
  rule forbids. Run it in Docker instead, or keep `make check-intro` (Playwright) as the browser check?
- **Take-home link:** the site can now deploy to Vercel (frontend only, `docs/dev-env.md`). Which URL goes on the QR
  code, and should the public site show the tool pages (audit, assess, experiments, knowledge) or only the talk?

## Questions: grad site (full text in `docs/archive/open-questions-grad-2026-10-05.md`)
- 0. Reframe (2026-10-05): what does the lab actually take home?
- 1. Skills — why haven't we been using them?
- 2. What does the talk show from this site?
- 3. Your information system — what is it, concretely?
- 4. Should the site read the information system from the repo?
- 5. Audience and format
- 6. Visual assets
- 7. Preview images if the site goes public
- 8. Animation fixes — which to plan? (`improve-animations` audit, 2026-10-05)
- 9. Topic 11 says the tools have no users

## Gaps (known, not yet fixed)
- Script exhibit token counts are estimates (12-page draft ≈ 6k, 300-entry .bib ≈ 30k). Swap in a real draft's count if you demo it.
- Yes-man scene assumes GPT 5.6 Luna was the model in all three chats; correct the details line if not.
- Hero bloom/grain is subtle by design; check it reads on the projector, or raise the 18% in `HomePage.tsx` `Bloom`.
- Map "seen" counts any scene scrolled past the reading line, read or not. The 22 cross-link reasons (`links` in
  `brief.ts`) are my reading of how topics connect; check them before the talk.
- Theme hues are untested on the room's projector (orange and purple themes especially).
- No projector/mobile pass: verify at 1920×1080 and 1280×720 with the room's actual screen.
- Assessment questions and weights are mine, unvalidated.
- Audit rules are pattern matching; expect false positives on real files.
- Brief facts not re-verified (e.g. Ajax coverage was one day old).
- Charts are hand-built; `dataviz` skill / Bklit not applied yet.
- Redesign is partial: the hero is redone, the rest of the site still carries the tells listed in `docs/design.md`.
- One unexplained console error once: view transition aborted on first load.
- No CI; checks run only via `make lint`.
- Site-map squares and topic outlines link to `#scene-id`. Direct loads land correctly; in-app jumps couldn't be verified
  (the test browser pane was hidden, which aborts view transitions and pauses animation frames). Check in a real window.
- `build-facts.json` goes stale unless `make facts` is rerun after doc edits (no check enforces it).
- ~40 hard-coded radii (`rounded-[8|10|14|18px]`) and 12 font sizes (10–16px) outside the token set; migrate when touched.
- Inputs lack `name`/`autocomplete`; KB kind/search and the assessment step aren't in the URL (web-design-guidelines).
- Guidelines want Title Case buttons; the site uses sentence case on purpose (kept).
