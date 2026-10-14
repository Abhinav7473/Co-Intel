# Undergrad seminar: inventory, Kvale audit, bounds (2026-10-07)

Working document for redesigning the junior seminar. Not site copy. Skills used: `made-to-stick` (SUCCESs),
`teach` (knowledge vs skills, retrieval), `workshop-facilitation` (pacing), plus the site's own content rules.

## 1. What exists

**Full site (grad level).** 11 topics, 62 scenes: 9 stats, 17 widgets, the rest claims, comparisons and lists.
Each topic ends in a takeaway bar (found / do / effort / skip). Map with "You are here". Four tools (setup audit,
self-assessment, experiments, knowledge base) with no real users. ~40 cited sources.

| Topic | What a junior would meet | Evidence behind it | Junior relevance |
|---|---|---|---|
| 01 Workflow vs agent | Two questions: who steers, who keeps the notes | Anthropic essay (opinion) | Medium: good frame, abstract |
| 02 Organisation beats volume | Long chats get worse; restart with a note | Chroma (18 models, 306 Qs); Lost in the Middle; compaction study | **High** |
| 03 Memory & yes-man | Memory files; saved profiles make models agree | Index Sickness (n = 1); CHI 2026 (38 people); our GPT 5.6 Luna run | **High** (profiles), low (memory files) |
| 04 Skills | Save your standards, not tricks; scripts | SkillReducer (55k skills); Anthropic docs | Low–medium (rubric idea transfers) |
| 05 Connectors | Tool descriptions cost tokens; the leak triangle | Anthropic posts (vendor); Willison | Low |
| 06 Cost | Caching, the resent prefix | Anthropic docs; one developer's logs | Very low (flat plans) |
| 07 Local models | Local for data that can't leave | Guides (weak) | Very low |
| 08 Calibration | Felt faster, measured slower; learning with AI | METR (16 devs); Anthropic RCT (52 learners) | **High** |
| 09 Mistakes | Habits that backfire | Synthesis of the above | Medium |
| 10 Tensions | Where studies disagree | Synthesis | Medium (as the honest close) |
| 11 How it was built | The repo's own information system | This repo | Low for juniors |

**/intro (the first junior attempt).** 8 chapters over a 3D world (cards, blob, formations). One real habit
(temporary chat for feedback), one thin one (explain, don't delegate). No premise, no field intro, no wider close.
Owner's score: 0/10.

## 2. Kvale audit

Lens: Kvale & Brinkmann (2009, *InterViews*), adapted from interviewing to a seminar, where the room is the
interviewee. Quality characteristics as operationalised by Ivey, Field & Xiao (2026, arXiv 2604.05163); they found
**relevance to the research question the strongest predictor of response quality, and clarity not predictive**.
The adaptation to seminars is ours.

### The seven stages, as a seminar
| Kvale stage | Seminar equivalent | Site / intro today |
|---|---|---|
| Thematizing (why and what, before how) | One question the session answers, and its bounds | **Missing.** Built the how (widgets, 3D) first |
| Designing | Plan the session from the theme, with time | 62 scenes for 30 min; intro designed around visuals |
| Interviewing | The live session: questions, demo, room responses | Presenter talks; room watches |
| Transcribing | Capture what the room says | Nothing captured (mistakes poll exists, unused) |
| Analysing | Make sense of it, live | Not planned |
| Verifying | Do claims hold? Does the room read them as meant? | Claims verified ✓; never tested on a junior |
| Reporting | What they take away | Takeaway bars ✓ (grad); intro close is two cards |

### Quality characteristics, applied
| Characteristic (Kvale & Brinkmann) | Seminar reading | Score now | Note |
|---|---|---|---|
| Research-question relevance | Every beat serves the one question | 3/10 | Half the site is irrelevant to juniors (cost, local, connectors, build) |
| Specificity | Concrete examples over generalisations | 7/10 | Numbers and studies named; examples are developers and repos, not students |
| Clarity | Understandable | 7/10 | Copy is clear; jargon remains (tokens, prefix, MCP). Not predictive anyway |
| Spontaneity | The room adds beyond what was asked | 2/10 | Only the guess-then-reveal widget and the demo invite it |
| Self-reportedness (self-communicating) | Makes sense without the presenter | 4/10 | Needs a guide to decode; the intro has no premise to hang on |
| Response-length ratio (short questions, long answers) | Presenter talk vs room doing | 2/10 | Lecture-shaped |

### Validity
- **Craftsmanship:** good. Primary sources, honest labels (n = 1, anecdote, programming only), study named first.
- **Communicative:** untested. No junior has seen any of it.
- **Pragmatic (does it change what they do?):** weak for juniors. Actions assume memory files, connectors, APIs.

### Interviewer stance: deliberate naïveté
The presenter knows the field too well (*made-to-stick*: the curse of knowledge). Start from the juniors' world: a
chat app, an assignment due tonight, a design crit tomorrow. Not from context windows.

## 3. SUCCESs score (made-to-stick), the site as a junior seminar
| Trait | Score | Why |
|---|---|---|
| Simple | 3 | No one-sentence core; 11 topics |
| Unexpected | 6 | Real surprises exist (felt faster, measured slower; memory makes it agree) but they're buried |
| Concrete | 6 | Specific numbers; examples aren't from their life |
| Credible | 8 | Studies, CHI (their own field's venue), honest caveats |
| Emotional | 2 | No person, no stakes for them |
| Stories | 2 | The yes-man run is the only story, and it's ours |
| **Total** | **27/60** | Band 4–6: forgettable. Credibility carries it; simplicity and story sink it |

## 4. Bounds (revised 2026-10-07: the class is Claude Code on the web)
The owner clarified the class teaches juniors to use **Claude Code on the web** (claude.ai/code) and adopt modern
habits by feeling the time and tokens they save. Applied so far as wording only (2026-10-08); widening the content is an
open question for the owner. It could pull back in what section 4 below had cut: instruction files
(CLAUDE.md), skills that load on demand, fresh sessions vs `/compact`, subagents and fresh sessions as reviewers, plan
mode, parallel cloud sessions. Still out: connectors, API pricing, local models. The earlier chat-app bounds follow
for the record.

## 4a. Bounds as first drafted (chat apps)
**The question:** *When you use a chat assistant for school and design work, what can you control that measurably
changes the result, and what does the research say?*

**In:**
- The chat apps juniors already use (ChatGPT, Claude, Gemini, Copilot chat), for coursework, writing, design work, learning.
- Two levers. **What it sees:** chat length and residue, saved memory and profiles, what you paste. **What you hand
  over:** the thinking (explain vs do), and trusting the feeling of speed.
- Evidence with people or comparable conditions: Chroma, CHI 2026, METR, the Anthropic learning RCT. Our run only
  as a labelled anecdote.

**Out:** agents and coding agents, connectors/MCP, API cost and caching, local models, writing skills or memory
files, the site's build story, the four tools. They stay on the full site for anyone curious.

**Edge (decide):** saved instructions (Projects, custom GPTs) as the junior version of "save your criteria";
prompt-injection risk as one sentence, or nothing.

## 5. Habits from the big site to keep
- Premise before data: name the study, then the number, what it counts, what it means.
- Three depths: one idea on screen; one sentence behind a `+`; details and sources on request.
- Each fact once. Honest labels (anecdote, one study, programming only).
- Guide for anything interactive: what you're looking at, try, the point, where the numbers come from.
- Guess-then-reveal: the room predicts before the evidence lands (it worked on the stopwatch widget).
- Takeaway bar per section: found, do, effort, skip.
- A map and "You are here", and one hue per idea.
- Copy limits enforced by `make check-content`; primary sources only.

## 6. Sources for this audit
- Kvale, S. & Brinkmann, S. (2009). *InterViews*, 2nd ed. Sage. (Not read directly here; criteria via Ivey et al.)
- Ivey, J., Field, A. & Xiao, Z. (2026). What Makes a Good Response? arXiv:2604.05163. Table 1 and §1.
- Heath, C. & Heath, D. (2007). *Made to Stick*, via the `made-to-stick` skill.

## 7. Meta-analysis of /intro v3 (2026-10-09)
Viewed at 1440×900, read alongside the decisions log. Skills: `ponytail` (ultra: question the request),
`improve-codebase-architecture` + `codebase-design` (report in the session scratchpad, not the repo).

**Process.** Six rebuilds in three days (v1 3D opening → scroll world → restyle → v3 content → v4 re-scope → rollback),
two motion passes, ~24 skills installed. The visuals kept being rebuilt while the class's own subject (Claude Code on
the web) stayed an open question. The same pattern the owner scored 0/10: the how before the why.

**Content.**
- The class teaches Claude Code on the web; the proofs are about chat apps (Chroma = model inputs, CHI 2026 = saved
  chat profiles, our run = ChatGPT temporary/normal/project chats, METR = developers in Cursor). The page says
  "session" and "Claude Code", but the 3D card says "Saved memory about you", which describes a chat app's profile,
  not Claude Code. The hook ("What do you know about me?" in a Claude Code session) will answer from the repo, not a profile.
- No beat shows a Claude Code move on screen (new session, `/compact`, CLAUDE.md, plan mode), so "save time and
  tokens" is never demonstrated.
- Density: the rot panel has about 9 elements (guess, result, bars, word, twist lead, twist cards, word, practice,
  source); yes-man has about 11. One beat can't carry that in 3 minutes.
- Evidence: the yes-man result rests on one run per chat (5×5 not done); model unconfirmed.

**Presenting.**
- Chapters are 1.4–2.4 viewports tall; copy fills about half, so about 40% of the scroll is a near-empty 3D frame (dead air).
- Projector legibility: panel text 13–15px, sources 13px; the 3D is white-on-off-white with small painted labels.
- Interactions (guess buttons, copy, slider) need the presenter's mouse mid-talk; the room can't see the cursor well.

**Code (ponytail ultra).** About 830 of about 1,720 lines are the 3D backdrop. Dead `reduce` branches in World/Blob/Tokens;
`css()` and `EASE` duplicated; ~20 audience strings in Panels/World escape `check-content`; clutter → order
implemented four times off two independent numbers (ORDER, chaos); Flat + hairline is a second rendering of the scene.

## 8. Outside critique (reviewer agent, 2026-10-09): 3/10, SUCCESs 25/60
Skills read: made-to-stick, scroll-world-storytelling, impeccable (critique), teach, web-design-guidelines.
Top problems, worst first:
1. The spine is never shown: no screen puts one prompt next to two answers. The hook shows two different prompts (Panels:88 vs World:28).
2. Nothing on screen is Claude Code. The yes-man table reads "Temporary/Normal/Project chat". The memory card is a chat-app profile. "Be helpful, warm and friendly" is invented. talk-notes says type the hook into ChatGPT; the page says Claude Code.
3. Earned words are gamification that misfires. Scrolling past earns them. Rot fires two at once; chapter 5 earns none. The close's "three words, three tests" is false. "Hallucination" is already known to juniors.
4. Guesses are telegraphed by the rail labels and body copy, binary, and give no right/wrong feedback. That breaks the pretesting effect (Kornell, Hays & Bjork 2009).
5. The Chroma bars chart input size (the condition), not accuracy (the result). "Hallucination" rests on a GPT-vs-Claude vendor contrast. Chroma's fresh condition is curated text, not a student's note.
6. The yes-man rests on n = 1 (4 vs 5 vs 5), on a different text, in GPT. The live demo can go the wrong way.
7. Projector: panel text 13–17px; the rot reveal card is 1,126px tall in a 1,080px viewport; titles rest at 14% opacity; reading text is tilted.
8. The 3D is decoration and fights the evidence (Mayer: coherence, redundancy). The split view is cropped and its captions overlap; "Fix my frame." is a Figma request.
9. Pacing: 14 min before questions, two live LLM demos, three click interactions, PageDown lands mid-chapter.
10. The close fizzles into a grad-site link; the design question is a footnote.
Proposed rebuild: 6 beats, one viewport each. (1) Two real Claude Code screenshots, same prompt, 7 vs 4.
(2) The 3D exploded layers, relabelled to Claude Code's real parts (the only 3D beat). (3) Chroma accuracy chart with a
numeric guess, then a clip of a new session with a handoff note. (4) 5×5 Claude Code counts, then **sycophancy** (the one
earned word). (5) 50 vs 67, explain vs delegate. (6) A 60-second sketch: "the indicator that shows the session is stale
or flattering"; the beat-1 image returns. Take-home by QR code.
Medium ruling: a hybrid. A stepped page (one beat = one viewport, so native PageDown advances), recorded clips with an
optional live tab, and the full scroll page handed out afterwards.
Unverified by the reviewer: Chroma's exact figures; whether Claude Code on the web has per-user memory or `/context`; cold-load time.
