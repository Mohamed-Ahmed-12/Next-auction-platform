"use client";

import { useState, useEffect } from "react";

// Define standard breakpoints (matching Tailwind's defaults)
const breakpoints = {
  isMobile: "(max-width: 767px)",
  isTablet: "(min-width: 768px) and (max-width: 1023px)",
  isDesktop: "(min-width: 1024px)",
};

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    // Create media query lists
    const mobileQuery = window.matchMedia(breakpoints.isMobile);
    const tabletQuery = window.matchMedia(breakpoints.isTablet);
    const desktopQuery = window.matchMedia(breakpoints.isDesktop);

    // Update function
    const updateBreakpoints = () => {
      setBreakpoint({
        isMobile: mobileQuery.matches,
        isTablet: tabletQuery.matches,
        isDesktop: desktopQuery.matches,
      });
    };

    // Initial check
    updateBreakpoints();

    // Listen for changes
    mobileQuery.addEventListener("change", updateBreakpoints);
    tabletQuery.addEventListener("change", updateBreakpoints);
    desktopQuery.addEventListener("change", updateBreakpoints);

    return () => {
      mobileQuery.removeEventListener("change", updateBreakpoints);
      tabletQuery.removeEventListener("change", updateBreakpoints);
      desktopQuery.removeEventListener("change", updateBreakpoints);
    };
  }, []);

  return breakpoint;
}