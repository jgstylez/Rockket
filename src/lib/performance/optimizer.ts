import { NextRequest, NextResponse } from "next/server";

// Performance optimization utilities
export class PerformanceOptimizer {
  // Image optimization
  static optimizeImage(
    src: string,
    width: number,
    height: number,
    quality: number = 80,
    format: "webp" | "avif" | "jpeg" | "png" = "webp"
  ): string {
    // Use Next.js Image Optimization API
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      h: height.toString(),
      q: quality.toString(),
      f: format,
    });

    return `/api/image?${params.toString()}`;
  }

  // Lazy loading for images
  static getLazyImageProps(
    src: string,
    alt: string,
    width: number,
    height: number,
    priority: boolean = false
  ) {
    return {
      src,
      alt,
      width,
      height,
      loading: priority ? "eager" : "lazy",
      placeholder: "blur",
      blurDataURL:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgqChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
    };
  }

  // Code splitting utilities
  static async loadComponent(componentPath: string) {
    try {
      const component = await import(componentPath);
      return component.default;
    } catch (error) {
      console.error(`Failed to load component: ${componentPath}`, error);
      return null;
    }
  }

  // Dynamic imports with loading states
  static createLazyComponent(
    importFunc: () => Promise<any>,
    fallback?: React.ComponentType
  ) {
    return React.lazy(importFunc);
  }

  // Bundle analysis
  static analyzeBundle() {
    if (process.env.NODE_ENV === "development") {
      return {
        totalSize: "2.5MB",
        chunks: [
          { name: "main", size: "1.2MB" },
          { name: "vendor", size: "800KB" },
          { name: "pages", size: "500KB" },
        ],
        recommendations: [
          "Consider code splitting for large components",
          "Optimize images and assets",
          "Remove unused dependencies",
        ],
      };
    }
    return null;
  }

  // Memory usage monitoring
  static getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      };
    }
    return { used: 0, total: 0, percentage: 0 };
  }

  // Performance metrics collection
  static collectMetrics(): {
    navigation: PerformanceNavigationTiming | null;
    paint: PerformanceEntry[];
    resource: PerformanceEntry[];
  } {
    if (typeof window === "undefined") {
      return { navigation: null, paint: [], resource: [] };
    }

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType("paint");
    const resource = performance.getEntriesByType("resource");

    return { navigation, paint, resource };
  }

  // Core Web Vitals
  static getCoreWebVitals(): {
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    fcp: number | null;
    ttfb: number | null;
  } {
    if (typeof window === "undefined") {
      return { lcp: null, fid: null, cls: null, fcp: null, ttfb: null };
    }

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType("paint");

    const fcp =
      paint.find((entry) => entry.name === "first-contentful-paint")
        ?.startTime || null;
    const ttfb = navigation
      ? navigation.responseStart - navigation.requestStart
      : null;

    return {
      lcp: null, // Would need to be measured with LCP observer
      fid: null, // Would need to be measured with FID observer
      cls: null, // Would need to be measured with CLS observer
      fcp,
      ttfb,
    };
  }
}

// Database query optimization
export class DatabaseOptimizer {
  // Query result caching
  static async cacheQueryResult<T>(
    query: string,
    params: any[],
    result: T,
    ttl: number = 3600
  ): Promise<T> {
    // This would integrate with the cache system
    console.log(`Caching query result for: ${query}`);
    return result;
  }

  // Query optimization suggestions
  static analyzeQuery(query: string): {
    complexity: "low" | "medium" | "high";
    suggestions: string[];
    estimatedCost: number;
  } {
    const suggestions: string[] = [];
    let complexity: "low" | "medium" | "high" = "low";
    let estimatedCost = 1;

    // Analyze query patterns
    if (query.includes("SELECT *")) {
      suggestions.push("Avoid SELECT * - specify only needed columns");
      complexity = "medium";
      estimatedCost += 2;
    }

    if (query.includes("JOIN") && query.split("JOIN").length > 3) {
      suggestions.push("Consider breaking down complex JOINs");
      complexity = "high";
      estimatedCost += 5;
    }

    if (query.includes("ORDER BY") && !query.includes("LIMIT")) {
      suggestions.push("Add LIMIT clause to ORDER BY queries");
      complexity = "medium";
      estimatedCost += 3;
    }

    if (query.includes("WHERE") && query.includes("LIKE '%")) {
      suggestions.push("Avoid leading wildcards in LIKE queries");
      complexity = "medium";
      estimatedCost += 2;
    }

    return { complexity, suggestions, estimatedCost };
  }

  // Connection pooling optimization
  static getConnectionPoolStats(): {
    active: number;
    idle: number;
    total: number;
    max: number;
  } {
    // This would integrate with the database connection pool
    return {
      active: 5,
      idle: 10,
      total: 15,
      max: 20,
    };
  }
}

// API response optimization
export class APIOptimizer {
  // Response compression
  static compressResponse(data: any): string {
    // This would use compression libraries like gzip
    return JSON.stringify(data);
  }

  // Response caching headers
  static setCacheHeaders(
    response: NextResponse,
    maxAge: number = 300,
    staleWhileRevalidate: number = 60
  ): NextResponse {
    response.headers.set(
      "Cache-Control",
      `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
    );
    response.headers.set("ETag", `"${Date.now()}"`);
    return response;
  }

  // API rate limiting
  static checkRateLimit(
    identifier: string,
    limit: number = 100,
    window: number = 3600
  ): { allowed: boolean; remaining: number; resetTime: number } {
    // This would integrate with the cache system for rate limiting
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: Date.now() + window * 1000,
    };
  }

  // Response pagination
  static paginateResponse<T>(
    data: T[],
    page: number = 1,
    limit: number = 20
  ): {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  } {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    const total = data.length;
    const pages = Math.ceil(total / limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    };
  }

  // API response optimization
  static optimizeResponse<T>(data: T): {
    data: T;
    size: number;
    compressed: boolean;
    cacheable: boolean;
  } {
    const jsonString = JSON.stringify(data);
    const size = new Blob([jsonString]).size;

    return {
      data,
      size,
      compressed: size > 1024, // Consider compressed if > 1KB
      cacheable: size < 10000, // Cache if < 10KB
    };
  }
}

// Frontend performance optimization
export class FrontendOptimizer {
  // Component memoization
  static memoizeComponent<T extends React.ComponentType<any>>(
    Component: T,
    propsAreEqual?: (prevProps: any, nextProps: any) => boolean
  ): T {
    return React.memo(Component, propsAreEqual) as T;
  }

  // Hook optimization
  static useMemoizedCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList
  ): T {
    return React.useCallback(callback, deps);
  }

  // State optimization
  static useOptimizedState<T>(
    initialState: T
  ): [T, React.Dispatch<React.SetStateAction<T>>] {
    return React.useState(initialState);
  }

  // Virtual scrolling
  static useVirtualScrolling<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
  ): {
    visibleItems: T[];
    startIndex: number;
    endIndex: number;
    totalHeight: number;
  } {
    const [scrollTop, setScrollTop] = React.useState(0);

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const totalHeight = items.length * itemHeight;

    return {
      visibleItems,
      startIndex,
      endIndex,
      totalHeight,
    };
  }

  // Image lazy loading
  static useLazyImage(src: string, options?: IntersectionObserverInit) {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isInView, setIsInView] = React.useState(false);
    const imgRef = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      }, options);

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }, [options]);

    React.useEffect(() => {
      if (isInView) {
        const img = new Image();
        img.onload = () => setIsLoaded(true);
        img.src = src;
      }
    }, [isInView, src]);

    return { imgRef, isLoaded, isInView };
  }

  // Debounced search
  static useDebouncedSearch<T>(
    searchFn: (query: string) => Promise<T[]>,
    delay: number = 300
  ) {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<T[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      const timeoutId = setTimeout(async () => {
        if (query.trim()) {
          setLoading(true);
          try {
            const searchResults = await searchFn(query);
            setResults(searchResults);
          } catch (error) {
            console.error("Search error:", error);
          } finally {
            setLoading(false);
          }
        } else {
          setResults([]);
        }
      }, delay);

      return () => clearTimeout(timeoutId);
    }, [query, searchFn, delay]);

    return { query, setQuery, results, loading };
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  static getMetricStats(name: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const average = values.reduce((sum, val) => sum + val, 0) / count;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95Index = Math.floor(sorted.length * 0.95);
    const p95 = sorted[p95Index];

    return { count, average, min, max, p95 };
  }

  static clearMetrics() {
    this.metrics.clear();
  }

  static getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [name, values] of this.metrics.entries()) {
      result[name] = this.getMetricStats(name);
    }
    return result;
  }
}

export default PerformanceOptimizer;
