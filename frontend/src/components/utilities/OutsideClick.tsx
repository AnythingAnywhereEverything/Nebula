import { useEffect } from 'react';

export function useOutsideClick(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    function listener(e: PointerEvent) {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      handler();
    }

    document.addEventListener('pointerdown', listener);
    return () => document.removeEventListener('pointerdown', listener);
  }, [ref, handler]);
}
