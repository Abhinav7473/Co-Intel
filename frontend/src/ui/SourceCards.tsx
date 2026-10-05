import type { SourceLink } from "@/content/types";
import PREVIEWS from "@/content/previews.json";
import { cn } from "@/utils/cn";

interface Preview {
  site: string;
  title?: string;
  image?: string;
}

const previews = PREVIEWS as Record<string, Preview | undefined>;

/**
 * Sources as preview cards: the publisher's own preview image (downloaded at build
 * time by `make previews`), or a plain title card when the page has none (e.g. arXiv).
 * Our label stays the headline; the page's own title is the subtitle.
 */
export function SourceCards({ sources, compact }: { sources: SourceLink[]; compact?: boolean }) {
  return (
    <ul className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3")}>
      {sources.map((s) => {
        const p = previews[s.href] ?? { site: new URL(s.href).hostname.replace(/^www\./, "") };
        return (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex h-full flex-col overflow-hidden rounded-[14px] transition-[border-color] duration-150 hover:border-line-strong"
            >
              {p.image ? (
                <img src={p.image} alt="" width={1200} height={630} loading="lazy" decoding="async" className="aspect-[1.91/1] w-full border-b border-line bg-sunken object-cover" />
              ) : (
                <div className="flex aspect-[1.91/1] w-full items-end border-b border-line bg-sunken p-4">
                  <span className="font-display text-xl leading-tight text-ink/70">{p.site}</span>
                </div>
              )}
              <span className="flex flex-1 flex-col gap-1 p-3.5">
                <span className="text-[14px] font-medium leading-snug group-hover:underline">{s.label}</span>
                <span className="line-clamp-1 text-[12.5px] text-mute">{p.title && p.title !== s.label ? `${p.site} · ${p.title}` : p.site}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
