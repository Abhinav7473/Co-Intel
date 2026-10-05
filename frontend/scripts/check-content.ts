/**
 * Enforces the copy limits in docs/content.md. Runs with Node's built-in type
 * stripping (no build step): `make check-content`.
 */
import { SECTIONS } from "../src/content/brief.ts";
import { SLIDES } from "../src/content/deck.ts";

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
  if (s.kind === "compare" && s.columns.length > LIMITS.columns) fail(s.id, `${s.columns.length} columns > ${LIMITS.columns}`);
  if (s.kind === "stat" && !s.source.trim()) fail(s.id, "stat without a source");
}

for (const sec of SECTIONS) {
  if (!SLIDES.some((s) => s.kind === "chapter" && s.chapter === sec.slug)) fail(sec.slug, "chapter has no chapter scene");
}

if (problems.length) {
  console.error(`check-content: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-content: ${SLIDES.length} scenes OK`);
