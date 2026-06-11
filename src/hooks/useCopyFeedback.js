import { useEffect, useState } from "react";

/**
 * Shared "Copied!" feedback state that resets after a delay.
 * The timeout is cleared on unmount so no setState fires on an
 * unmounted component.
 *
 * @param {number} [resetAfterMs=2000] - How long the copied state lasts.
 * @returns {[boolean, () => void]} The copied flag and a trigger function.
 */
export function useCopyFeedback(resetAfterMs = 2000) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), resetAfterMs);
    return () => clearTimeout(timer);
  }, [copied, resetAfterMs]);

  return [copied, () => setCopied(true)];
}
