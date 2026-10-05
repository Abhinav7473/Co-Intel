/**
 * Build-time link previews for every source the site cites.
 * Reads each page's Open Graph tags (open-graph-scraper), downloads the publisher's own
 * preview image into public/previews/, and writes src/content/previews.json.
 * Runs in the web-dev container: `make previews`. Re-run when sources change.
 * Images are stored locally (never hotlinked) so the CSP holds and nothing breaks later.
 */
import { createHash } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import ogs from "open-graph-scraper";
import { SOURCES } from "../src/content/data.ts";
import { SLIDES } from "../src/content/deck.ts";

interface Preview {
  site: string;
  title?: string;
  image?: string;
}

const OUT_DIR = "public/previews";
const MANIFEST = "src/content/previews.json";
const MAX_BYTES = 1_500_000;
const GENERIC = /arxiv-logo|og-default|\/logo[.-]/i; // site logos tell the reader nothing

const urls = [
  ...new Set([
    ...SOURCES.flatMap((g) => g.links.map((l) => l.href)),
    ...SLIDES.flatMap((s) => (s.sources ?? []).map((l) => l.href)),
  ]),
].sort();

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const siteOf = (u: string) => new URL(u).hostname.replace(/^www\./, "");

async function download(src: string, page: string): Promise<string | undefined> {
  const abs = new URL(src, page).toString();
  if (GENERIC.test(abs)) return undefined;
  const res = await fetch(abs, { headers: { "User-Agent": "Mozilla/5.0 (link preview)" }, signal: AbortSignal.timeout(15_000) });
  const type = (res.headers.get("content-type") ?? "").split(";")[0]!.trim();
  const ext = EXT[type];
  if (!res.ok || !ext) return undefined;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength > MAX_BYTES) return undefined;
  const name = `${createHash("sha1").update(page).digest("hex").slice(0, 12)}.${ext}`;
  writeFileSync(`${OUT_DIR}/${name}`, buf);
  return `/previews/${name}`;
}

async function preview(url: string): Promise<[string, Preview]> {
  const fallback: Preview = { site: siteOf(url) };
  try {
    const { result } = await ogs({ url, timeout: 15, fetchOptions: { headers: { "user-agent": "Mozilla/5.0 (link preview)" } } });
    const img = result.ogImage?.[0]?.url;
    return [
      url,
      {
        site: result.ogSiteName ?? fallback.site,
        title: result.ogTitle,
        image: img ? await download(img, url).catch(() => undefined) : undefined,
      },
    ];
  } catch {
    return [url, fallback];
  }
}

mkdirSync(OUT_DIR, { recursive: true });
const entries: [string, Preview][] = [];
for (let i = 0; i < urls.length; i += 6) entries.push(...(await Promise.all(urls.slice(i, i + 6).map(preview))));
writeFileSync(MANIFEST, JSON.stringify(Object.fromEntries(entries), null, 2) + "\n");
const withImage = entries.filter(([, p]) => p.image).length;
console.log(`fetch-previews: ${entries.length} sources, ${withImage} with images → ${MANIFEST}`);
