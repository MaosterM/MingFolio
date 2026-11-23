import type { Transition } from 'motion/react';

/**
 * The one transition used by every Motion animation.
 * Mirrors --dur-snap and --ease-snap-curve in tokens.css. Motion needs numbers, not CSS variables,
 * so this is the single place those values are repeated in JavaScript.
 */
export const SNAP: Transition = {
  duration: 0.12,
  ease: [0.2, 0, 0, 1],
};
