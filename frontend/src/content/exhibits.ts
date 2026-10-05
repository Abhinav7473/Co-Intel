/**
 * Two real "build this site" specs written for AI site generators, quoted in short
 * excerpts and annotated. They are evidence for the mistakes topic: over-specified
 * prompts, invented data, borrowed assets, and an instruction that leaked into the copy.
 * Asset URLs are redacted; none of their media is used here.
 */
export interface Annotation {
  /** the quoted line(s) from the spec */
  quote: string;
  note: string;
  /** which finding or rule it illustrates */
  tag: string;
  /** topic that explains why, if any */
  topic?: string;
}

export interface Exhibit {
  key: string;
  title: string;
  summary: string;
  annotations: Annotation[];
}

export const EXHIBITS: Exhibit[] = [
  {
    key: "landing",
    title: "An AI-SaaS landing page spec",
    summary: "Plain HTML/CSS/JS, one viewport, video background. About 250 lines of instructions.",
    annotations: [
      {
        quote: "Text: `Trusted by 2000+ Enterprises`\n1. `fa-brands fa-microsoft`  2. `fa-brands fa-amazon`  3. `fa-brands fa-google`",
        note: "Real company logos next to an invented number imply endorsements that do not exist.",
        tag: "Invented claim",
      },
      {
        quote: "| % | 99.99 | % | 2 | Platform Uptime |\n| # | 2.4 | M | 1 | Context Windows |",
        note: "Round, perfect-looking stats for a product that does not exist. \"2.4M context windows\" measures nothing.",
        tag: "Fake-perfect numbers",
      },
      {
        quote: "BubbledotICG-FinePos via OnlineWebFonts CDN — do not use local Bubbledot files",
        note: "A commercial typeface loaded from a redistribution site. The licence is unknown.",
        tag: "Borrowed asset",
      },
      {
        quote: "Letter-spacing: -0.04em desktop; -0.08em ≤720px; -0.09em ≤420px\nLine-height 1.12 (1.05 / 1.04 on smaller breakpoints)",
        note: "Hundreds of pixel-exact instructions with no reason given. At that density, models drop instructions silently and favour the earliest ones.",
        tag: "Instruction density",
        topic: "evidence",
      },
    ],
  },
  {
    key: "archive",
    title: "A fashion-archive spec",
    summary: "React 19, Vite, Tailwind, GSAP and Motion. Cursor-scrubbed video, scroll-driven gallery.",
    annotations: [
      {
        quote:
          "Text content: \"When switching between videos near the center, do not reset currentTime to 0 abruptly. Add a small dead zone…\"",
        note: "A developer instruction became the visible hero copy. Directions and content lived in the same text, so one leaked into the other.",
        tag: "Instruction leaked into output",
        topic: "mistakes",
      },
      {
        quote: "LEFT video: https://d8j0…cloudfront.net/user_…/hf_2026…mp4",
        note: "Media hotlinked from someone else's generator storage. It can disappear, and its licence is unclear.",
        tag: "Borrowed asset",
      },
      {
        quote: "cursor: none · pointer-events-none on all overlaid UI · user-select: none",
        note: "A custom cursor and untouchable, unselectable text: accessibility traded for an effect.",
        tag: "Accessibility cost",
      },
      {
        quote: "CRITICAL: Only update currentTime when !video.seeking",
        note: "The genuinely useful line. Its idea, scrubbing between two states, is what the comparison on the home page adapts.",
        tag: "Worth keeping",
      },
    ],
  },
];
