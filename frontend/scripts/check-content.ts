/**
 * Enforces the copy limits in docs/content.md. Runs with Node's built-in type
 * stripping (no build step): `make check-content`.
 */
import { SECTIONS } from "../src/content/brief.ts";
import { SLIDES } from "../src/content/deck.ts";
import * as INTRO from "../src/content/intro.ts";
const { SCREENS, BEATS, WORDS } = INTRO;
import { TAKEAWAYS } from "../src/content/takeaways.ts";

const LIMITS = { lines: 4, columns: 3, line: 90, heading: 60, more: 220, details: 320 };
const problems: string[] = [];
const fail = (id: string, msg: string) => problems.push(`${id}: ${msg}`);
const len = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*/g, "").length;

const seen = new Set<string>();
for (const s of SLIDES) {
  if (seen.has(s.id)) fail(s.id, "duplicate id");
  seen.add(s.id);

  for (const d of s.details ?? []) if (len(d) > LIMITS.details) fail(s.id, `details paragraph ${len(d)} > ${LIMITS.details} chars`);

  if (s.kind === "statement" || s.kind === "list") {
    if (len(s.heading) > LIMITS.heading) fail(s.id, `heading ${len(s.heading)} > ${LIMITS.heading} chars`);
    if (s.lines.length > LIMITS.lines) fail(s.id, `${s.lines.length} lines > ${LIMITS.lines}`);
    for (const l of s.lines) {
      if (len(l.text) > LIMITS.line) fail(s.id, `line ${len(l.text)} > ${LIMITS.line} chars: "${l.text.slice(0, 40)}…"`);
      if (l.more && len(l.more) > LIMITS.more) fail(s.id, `more ${len(l.more)} > ${LIMITS.more} chars`);
    }
  }
  if (s.kind === "widget") {
    const g = s.guide;
    if (!g?.name.trim() || !g.shows.trim() || !g.try.trim() || !g.point.trim()) fail(s.id, "widget without a full guide (name, shows, try, point)");
    else {
      if (len(g.name) > 40) fail(s.id, `guide name ${len(g.name)} > 40 chars`);
      for (const k of ["shows", "try", "point"] as const) if (len(g[k]) > 170) fail(s.id, `guide ${k} ${len(g[k])} > 170 chars`);
      if (!g.data.length) fail(s.id, "guide must say where its numbers come from (data)");
      if (g.data.some((d) => d === "study" || d === "estimate") && !g.basis?.trim()) fail(s.id, "study/estimate widget must name its study up front (guide.basis)");
      if (g.basis && len(g.basis) > 240) fail(s.id, `guide basis ${len(g.basis)} > 240 chars`);
    }
  }
  if (s.kind === "compare") for (const c of s.columns) for (const l of c.lines) if (len(l) > LIMITS.line) fail(s.id, `column line > ${LIMITS.line} chars`);
  if (s.kind === "compare" && s.columns.length > LIMITS.columns) fail(s.id, `${s.columns.length} columns > ${LIMITS.columns}`);
  if (s.kind === "stat") {
    if (!s.source.trim()) fail(s.id, "stat without a source");
    if (!s.study.trim()) fail(s.id, "stat without a plain-language description of the study");
    if (!s.meaning.trim()) fail(s.id, "stat without a 'what it means' line");
    if (len(s.study) > 160) fail(s.id, `study ${len(s.study)} > 160 chars`);
    if (len(s.label) > 90) fail(s.id, `label ${len(s.label)} > 90 chars`);
    if (len(s.meaning) > 140) fail(s.id, `meaning ${len(s.meaning)} > 140 chars`);
    if (s.method && len(s.method) > 220) fail(s.id, `method ${len(s.method)} > 220 chars`);
  }
}

for (const sec of SECTIONS) {
  const t = TAKEAWAYS[sec.slug];
  if (!t) fail(sec.slug, "topic has no takeaway bar (content/takeaways.ts)");
  else {
    if (len(t.found) > 110) fail(sec.slug, `takeaway 'found' ${len(t.found)} > 110 chars`);
    if (t.do.length < 1 || t.do.length > 2) fail(sec.slug, "takeaway needs 1–2 actions");
    for (const d of t.do) if (len(d) > 90) fail(sec.slug, `takeaway action ${len(d)} > 90 chars`);
    if (len(t.effort) > 24) fail(sec.slug, `takeaway effort ${len(t.effort)} > 24 chars`);
    if (t.skip && len(t.skip) > 90) fail(sec.slug, `takeaway skip ${len(t.skip)} > 90 chars`);
  }
}

for (const sec of SECTIONS) {
  if (!SLIDES.some((s) => s.kind === "chapter" && s.chapter === sec.slug)) fail(sec.slug, "chapter has no chapter scene");
}

// the junior seminar: short beats, no preaching, no jargon, words earned before they're used
const PREACH = /\b(should|always|never|must|don't)\b/i;
const JARGON = /\b(context window|tokens?|LLMs?|prompt engineering|agents?|model weights)\b/i;
const strings = (v: unknown): string[] => (typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === "object" ? Object.values(v).flatMap(strings) : []);
for (const [name, value] of Object.entries(INTRO)) {
  for (const text of strings(value)) {
    if (PREACH.test(text)) fail(`intro.${name}`, `preaching word in "${text.slice(0, 50)}…"`);
    if (JARGON.test(text)) fail(`intro.${name}`, `jargon in "${text.slice(0, 50)}…"`);
  }
}
for (const b of BEATS) if (len(b) > 18) fail("intro.BEATS", `rail label "${b}" > 18 chars`);
for (const c of SCREENS) {
  if (len(c.title) > 60) fail(c.id, `intro title ${len(c.title)} > 60 chars`);
  if (len(c.body) > 170) fail(c.id, `intro body ${len(c.body)} > 170 chars`);
  // a word may appear only from the screen that reveals it onward
  const at = SCREENS.indexOf(c);
  for (const w of WORDS) if (at < SCREENS.findIndex((x) => x.id === w.revealIn) && `${c.title} ${c.body}`.toLowerCase().includes(w.word)) fail(c.id, `"${w.word}" used before it is earned`);
}

if (problems.length) {
  console.error(`check-content: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-content: ${SLIDES.length} scenes + ${SCREENS.length} intro screens OK`);
