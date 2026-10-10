import { Exploded } from "@lucasmarkes/hairline/react";

/**
 * The 2D twin of the one 3D beat, for visitors who asked for reduced motion and browsers without WebGL:
 * Hairline's `Exploded`, an app window in four layers (lucasmarkes/hairline, MIT), drawn in the site's
 * own hairline palette. It moves only when pointed at; given `play` (no WebGL, motion allowed) it walks
 * through its layers on its own. Hairline itself rests `play` under reduced motion.
 */
export function Flat({ play = false }: { play?: boolean }) {
  return (
    <div className="hairline-site mx-auto flex h-full w-full max-w-[560px] items-center">
      <Exploded
        intensity={0.7}
        play={play}
        theme="light"
        label="Claude Code's inputs taken apart into four layers: your message, the session so far, your project's notes, and its own instructions."
      />
    </div>
  );
}
