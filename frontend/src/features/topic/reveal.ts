import type { Variants } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Parent of staggered content: carries no visual change, only orchestrates children. */
export const STAGGER_PARENT: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

/** A staggered child: heading, lines, columns, list rows. */
export const ITEM: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
