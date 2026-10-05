/**
 * Reads the repository's own files (CLAUDE.md, docs/, decision log, skills, code folders) and writes
 * src/content/build-facts.json for the "How this site was built" topic. Every number on that page comes
 * from here. Run with `make facts` after editing CLAUDE.md, docs/ or the decision log.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO = process.env.REPO ?? "..";
const OUT = "src/content/build-facts.json";
const read = (p: string) => readFileSync(join(REPO, p), "utf8");
const lineCount = (p: string) => read(p).trimEnd().split("\n").length;
const dirs = (p: string) =>
  readdirSync(join(REPO, p))
    .filter((d) => !d.startsWith("_") && statSync(join(REPO, p, d)).isDirectory())
    .sort();
const firstSentence = (s: string) => (s.match(/^.*?[.!?](\s|$)/)?.[0] ?? s).trim();
const squash = (s: string) => s.replace(/\s+/g, " ").trim();
const plain = (s: string) => s.replace(/\*\*([^*]+)\*\*/g, "$1");

// ── core: CLAUDE.md ─────────────────────────────────────────────────────────
const claude = read("CLAUDE.md");
const section = (title: string) => claude.split(/^## /m).find((b) => b.startsWith(title)) ?? "";
const bullets = (block: string) =>
  block
    .split("\n")
    .slice(1)
    .join("\n")
    .split(/^- /m)
    .slice(1)
    .map(squash);
const rules = bullets(section("Rules")).map((r) => firstSentence(plain(r)));
const docs = bullets(section("Where things are")).flatMap((b) => {
  const m = b.match(/^`([^`]+)` — (.*)$/);
  return m ? [{ path: m[1]!, lines: lineCount(m[1]!), purpose: m[2]! }] : [];
});

// ── archive: the decision log ───────────────────────────────────────────────
const logPath = "docs/decisions.md";
const decisions = read(logPath)
  .split(/^---$/m)
  .slice(1)
  .join("")
  .split(/\n(?=\d{4}-\d{2}-\d{2} — )/)
  .map((e) => e.trim())
  .filter((e) => /^\d{4}-\d{2}-\d{2} — /.test(e))
  .map((e) => {
    const date = e.slice(0, 10);
    const body = squash(e.slice(13));
    const italics = [...body.matchAll(/\*([^*]+)\*/g)].map((m) => m[1]!);
    const ownerQuote = italics.find((t) => /^(User|Owner)\b/.test(t));
    // "*User spec; reason*" = the owner asked for it, and the rest is the reason
    const spec = ownerQuote?.match(/^User spec[.;]?\s*(.*)$/);
    const why = spec?.[1] || italics.find((t) => t !== ownerQuote);
    const rejected = body.match(/\(Rejected: ([^)]*)\)/)?.[1];
    const text = squash(
      body
        .replace(/\*\*Reverted\.\*\*/g, "")
        .replace(/\*[^*]+\*/g, "")
        .replace(/\(Rejected: [^)]*\)/g, ""),
    );
    return {
      date,
      text,
      owner: spec ? "asked for this in the original spec." : ownerQuote ? squash(ownerQuote.replace(/^(User|Owner)[:;.]?\s*/, "")) : null,
      why: why ?? null,
      rejected: rejected ?? null,
      reverted: /\*\*Reverted\.\*\*/.test(body),
    };
  });

// ── skills ──────────────────────────────────────────────────────────────────
const lock = JSON.parse(read("skills-lock.json")) as { skills: Record<string, { source: string }> };
const skills = dirs(".claude/skills").flatMap((name) => {
  const p = `.claude/skills/${name}/SKILL.md`;
  if (!existsSync(join(REPO, p))) return [];
  const desc = read(p).match(/^description:\s*(.*)$/m)?.[1] ?? "";
  return [{ name, description: firstSentence(desc.replace(/^["']|["']$/g, "")), source: lock.skills[name]?.source ?? "written for this project" }];
});

// ── checks: Makefile targets that verify or regenerate things ───────────────
const make = read("Makefile");
const checks = ["lint", "check-content", "facts", "previews", "backup"].flatMap((t) => {
  const m = make.match(new RegExp(`^${t}:.*## (.*)$`, "m"));
  return m ? [{ name: `make ${t}`, what: m[1]! }] : [];
});

// ── the app's code ──────────────────────────────────────────────────────────
const tables = dirs("backend/app/features").flatMap((f) => {
  const p = `backend/app/features/${f}/models.py`;
  return existsSync(join(REPO, p)) ? [...read(p).matchAll(/__tablename__ = "([^"]+)"/g)].map((m) => m[1]!) : [];
});
const code = {
  content: readdirSync(join(REPO, "frontend/src/content"))
    .filter((f) => f.endsWith(".ts") && f !== "types.ts")
    .sort(),
  pages: dirs("frontend/src/features"),
  widgets: readdirSync(join(REPO, "frontend/src/features/widgets")).filter((f) => f.endsWith(".tsx") && f !== "index.tsx").length,
  api: dirs("backend/app/features"),
  tables,
};

const facts = {
  core: { path: "CLAUDE.md", lines: claude.trimEnd().split("\n").length, rules },
  docs,
  log: { path: logPath, lines: lineCount(logPath), decisions },
  skills,
  checks,
  code,
};
writeFileSync(OUT, `${JSON.stringify(facts, null, 2)}\n`);
console.log(
  `build-facts: ${rules.length} rules, ${docs.length} docs, ${decisions.length} decisions (${decisions.filter((d) => d.owner).length} from the owner), ${skills.length} skills, ${tables.length} tables`,
);
