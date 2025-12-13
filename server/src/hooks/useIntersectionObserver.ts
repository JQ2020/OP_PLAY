"use client";

import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options?: UseIntersectionObserverOptions
) {
  const { freezeOnceVisible = false, ...observerOptions } = options || {};
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Memoize options to prevent recreation
  const optionsRef = useRef(observerOptions);

  useEffect(() => {
    optionsRef.current = observerOptions;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already intersected and frozen, don't observe
    if (freezeOnceVisible && hasIntersected) return;

    const observer = new IntersectionObserver(([entry]) => {
      const isElementIntersecting = entry.isIntersecting;
      setIsIntersecting(isElementIntersecting);

      if (isElementIntersecting) {
        setHasIntersected(true);
        if (freezeOnceVisible) {
          observer.unobserve(element);
        }
      }
    }, optionsRef.current);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [freezeOnceVisible, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}
