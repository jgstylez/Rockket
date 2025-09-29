/**
 * Performance Monitor for Rockket Platform
 *
 * This module provides performance tracking and monitoring
 * for API endpoints, database queries, and user interactions.
 */

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private activeTimings: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): () => void {
    const start = performance.now();
    this.activeTimings.set(label, start);

    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
      this.activeTimings.delete(label);
    };
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(value);
  }

  getMetrics(label?: string): Record<string, any> {
    if (label) {
      const values = this.metrics.get(label) || [];
      return {
        [label]: {
          count: values.length,
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          p50: this.percentile(values, 0.5),
          p95: this.percentile(values, 0.95),
          p99: this.percentile(values, 0.99),
        },
      };
    }

    const result: Record<string, any> = {};
    this.metrics.forEach((values, key) => {
      result[key] = {
        count: values.length,
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        p50: this.percentile(values, 0.5),
        p95: this.percentile(values, 0.95),
        p99: this.percentile(values, 0.99),
      };
    });
    return result;
  }

  private percentile(values: number[], p: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index] || 0;
  }

  clearMetrics(label?: string): void {
    if (label) {
      this.metrics.delete(label);
    } else {
      this.metrics.clear();
    }
  }

  getActiveTimings(): Record<string, number> {
    const result: Record<string, number> = {};
    this.activeTimings.forEach((start, label) => {
      result[label] = performance.now() - start;
    });
    return result;
  }

  // Performance decorator
  static track<T extends any[], R>(
    fn: (...args: T) => R,
    label: string
  ): (...args: T) => R {
    return (...args: T): R => {
      const monitor = PerformanceMonitor.getInstance();
      const stopTiming = monitor.startTiming(label);
      try {
        const result = fn(...args);
        return result;
      } finally {
        stopTiming();
      }
    };
  }

  // Async performance decorator
  static trackAsync<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    label: string
  ): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
      const monitor = PerformanceMonitor.getInstance();
      const stopTiming = monitor.startTiming(label);
      try {
        const result = await fn(...args);
        return result;
      } finally {
        stopTiming();
      }
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Performance tracking utilities
export function trackPerformance<T extends any[], R>(
  fn: (...args: T) => R,
  label: string
): (...args: T) => R {
  return PerformanceMonitor.track(fn, label);
}

export function trackAsyncPerformance<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  label: string
): (...args: T) => Promise<R> {
  return PerformanceMonitor.trackAsync(fn, label);
}
