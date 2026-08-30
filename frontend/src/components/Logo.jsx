import React from "react";

/**
 * NR Global Nexus brand logo — always shows the full lockup
 * (icon + "NR GLOBAL NEXUS" wordmark) on every breakpoint.
 *
 * variant: "dark" (default, light bg) | "light" (dark bg, inverted PNG)
 * size:    "sm" | "md" | "lg"
 */
const SIZE_CLASSES = {
  sm: "h-9 md:h-10 lg:h-11",       // 36 / 40 / 44
  md: "h-11 md:h-[52px] lg:h-14",  // 44 / 52 / 56
  lg: "h-12 md:h-[60px] lg:h-[68px]", // 48 / 60 / 68
};

export const Logo = ({ variant = "dark", size = "md", className = "" }) => {
  const src = variant === "light" ? "/brand/nr-logo-light-600.png" : "/brand/nr-logo-600.png";
  const srcSet =
    variant === "light"
      ? "/brand/nr-logo-light-400.png 1x, /brand/nr-logo-light-600.png 1.5x, /brand/nr-logo-light-1200.png 2x"
      : "/brand/nr-logo-400.png 1x, /brand/nr-logo-600.png 1.5x, /brand/nr-logo-1200.png 2x";

  return (
    <a
      href="/"
      data-testid="brand-logo"
      className={`inline-flex items-center ${className}`}
      aria-label="NR Global Nexus — Home"
    >
      <img
        src={src}
        srcSet={srcSet}
        alt="NR Global Nexus"
        className={`block select-none w-auto ${SIZE_CLASSES[size] || SIZE_CLASSES.md}`}
        draggable={false}
        decoding="async"
        loading="eager"
      />
    </a>
  );
};

export default Logo;
