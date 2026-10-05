import { ArrowRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import { SECTION_BY_SLUG } from "@/content/brief";
import { TAKEAWAYS } from "@/content/takeaways";
import { Emblem } from "@/features/map/MapParts";

/** The bar at the end of a topic: what it found, what to do, how long it takes. In the topic's hue. */
export function TakeawayBar({ slug }: { slug: string }) {
  const t = TAKEAWAYS[slug];
  const s = SECTION_BY_SLUG[slug];
  if (!t || !s) return null;
  return (
    <motion.aside
      aria-label={`Takeaway: ${s.title}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="my-16 rounded-panel border border-topic/25 bg-topic/[0.05] p-5 sm:p-6"
    >
      <div className="grid gap-x-10 gap-y-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="flex gap-4">
          <Emblem section={s} />
          <div>
            <div className="text-[13px] font-medium text-topic">What it found</div>
            <p className="mt-1 font-display text-[1.3rem] leading-snug tracking-tight">{t.found}</p>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-topic">What to do</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 text-[12.5px] text-mute ring-1 ring-line">
              <Clock className="size-3.5" aria-hidden /> {t.effort}
            </span>
          </div>
          <ul className="mt-2 space-y-2">
            {t.do.map((d) => (
              <li key={d} className="flex gap-2.5 text-[16px] leading-snug">
                <ArrowRight className="mt-[3px] size-4 shrink-0 text-topic" aria-hidden />
                {d}
              </li>
            ))}
          </ul>
          {t.skip ? <p className="mt-3 text-[13.5px] text-mute">{t.skip}</p> : null}
        </div>
      </div>
    </motion.aside>
  );
}
