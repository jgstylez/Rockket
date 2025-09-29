"use client";

import { useEffect, useState } from "react";

// Hook for detecting mobile devices
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}

// Hook for detecting touch devices
export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

// Responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  mobileCols?: 1 | 2;
  tabletCols?: 2 | 3;
  desktopCols?: 3 | 4 | 5 | 6;
}

export function ResponsiveGrid({
  children,
  className = "",
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
}: ResponsiveGridProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6",
  };

  const mobileClass = gridClasses[mobileCols];
  const tabletClass = gridClasses[tabletCols];
  const desktopClass = gridClasses[desktopCols];

  return (
    <div
      className={`grid gap-4 ${mobileClass} ${tabletClass} ${desktopClass} ${className}`}
    >
      {children}
    </div>
  );
}

// Mobile-optimized card component
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MobileCard({
  children,
  className = "",
  onClick,
}: MobileCardProps) {
  const isTouch = useIsTouch();

  return (
    <div
      className={`
        bg-white rounded-lg border shadow-sm transition-all duration-200
        ${isTouch ? "active:scale-95" : "hover:shadow-md"}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Mobile-friendly button component
interface MobileButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function MobileButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
}: MobileButtonProps) {
  const isTouch = useIsTouch();

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-ring",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const touchClasses = isTouch ? "active:scale-95" : "";
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${touchClasses} ${widthClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Mobile-optimized text component
interface MobileTextProps {
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "muted" | "accent";
}

export function MobileText({
  children,
  className = "",
  size = "base",
  weight = "normal",
  color = "primary",
}: MobileTextProps) {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colorClasses = {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    muted: "text-gray-500",
    accent: "text-primary",
  };

  return (
    <span
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}

// Mobile-optimized spacing utilities
export const mobileSpacing = {
  container: "px-4 sm:px-6 lg:px-8",
  section: "py-8 sm:py-12 lg:py-16",
  card: "p-4 sm:p-6",
  button: "px-4 py-2 sm:px-6 sm:py-3",
  input: "px-3 py-2 sm:px-4 sm:py-3",
};

// Mobile-optimized breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Mobile-optimized typography
export const mobileTypography = {
  h1: "text-2xl sm:text-3xl lg:text-4xl font-bold",
  h2: "text-xl sm:text-2xl lg:text-3xl font-semibold",
  h3: "text-lg sm:text-xl lg:text-2xl font-semibold",
  h4: "text-base sm:text-lg lg:text-xl font-medium",
  body: "text-sm sm:text-base",
  caption: "text-xs sm:text-sm",
};
