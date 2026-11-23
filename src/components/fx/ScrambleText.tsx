import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Text that "decrypts" once on load: random glyphs resolve left to right into the real text.
 * Idea from React Bits' DecryptedText, rewritten small: no dependencies, one interval, ~0.7s.
 *
 * Use it on monospace text only: in a proportional font the changing glyph widths make the line jitter.
 * Screen readers get the real text once; the animated copy is aria-hidden.
 */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#_';
const FRAMES = 16;
const FRAME_MS = 45;

/** Keep spaces and slashes so the line's shape is visible from the first frame. */
function scramble(text: string, revealed: number): string {
  return Array.from(text, (char, i) =>
    i < revealed || char === ' ' || char === '/' ? char : (GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? char),
  ).join('');
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export function ScrambleText({ text, className }: ScrambleTextProps) {
  const reduceMotion = useReducedMotion();
  // Start scrambled (unless motion is reduced) so the first paint doesn't flash the final text.
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? text : scramble(text, 0)));

  useEffect(() => {
    if (reduceMotion) {
      setShown(text);
      return;
    }
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      if (frame >= FRAMES) {
        window.clearInterval(id);
        setShown(text);
        return;
      }
      setShown(scramble(text, Math.floor((frame / FRAMES) * text.length)));
    }, FRAME_MS);
    return () => window.clearInterval(id);
  }, [text, reduceMotion]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
