import { SCREENS } from "@/content/intro";
import { STAGE } from "@/shell/layout";
import { cn } from "@/utils/cn";
import { conduct } from "./conductor";
import { Screen, Sources, Strip } from "./Panels";

/**
 * The junior seminar as a stepped talk: one full-screen section per screen, snapped on desktop (`[data-snap]` in
 * styles.css), so PageDown, Space or a clicker moves exactly one screen with native scroll. No site chrome here
 * (AppShell hides it); the context strip pinned to the bottom is the progress indicator. `--strip` is its height,
 * so screens and the source line keep clear of it.
 */
export function IntroPage() {
  return (
    <div ref={conduct} data-snap className="relative bg-surface [--strip:clamp(64px,8.6vh,96px)]">
      <main>
        {SCREENS.map((s, i) => (
          <section key={s.id} id={s.id} data-chapter aria-labelledby={`${s.id}-title`} className="relative flex min-h-svh snap-start flex-col">
            <div className={cn(STAGE, "flex flex-1 flex-col justify-center pb-[calc(var(--strip)+7vh)] pt-[7vh]")}>
              <Screen s={s} i={i} />
            </div>
            <Sources id={s.id} />
          </section>
        ))}
      </main>
      <Strip />
    </div>
  );
}
