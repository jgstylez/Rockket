import { db } from "@/lib/db/client";

export interface AnalyticsEvent {
  id: string;
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  tenantId: string;
  timestamp: Date;
}

export interface EventProperties {
  [key: string]: any;
}

export class AnalyticsService {
  async trackEvent(
    event: string,
    properties: EventProperties = {},
    userId?: string,
    tenantId?: string,
    sessionId?: string
  ): Promise<void> {
    try {
      await db.analyticsEvent.create({
        data: {
          event,
          properties: JSON.stringify(properties),
          userId: userId || null,
          sessionId: sessionId || this.generateSessionId(),
          tenantId: tenantId || "",
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error("Analytics tracking error:", error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  async getEvents(
    tenantId: string,
    filters: {
      event?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    } = {}
  ): Promise<AnalyticsEvent[]> {
    const where: any = {
      tenantId,
    };

    if (filters.event) {
      where.event = filters.event;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) {
        where.timestamp.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.timestamp.lte = filters.endDate;
      }
    }

    const events = await db.analyticsEvent.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: filters.limit || 1000,
    });

    return events.map((event) => ({
      id: event.id,
      event: event.event,
      properties: JSON.parse(event.properties),
      userId: event.userId || undefined,
      sessionId: event.sessionId,
      tenantId: event.tenantId,
      timestamp: event.timestamp,
    }));
  }

  async getEventMetrics(
    tenantId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalEvents: number;
    uniqueUsers: number;
    uniqueSessions: number;
    topEvents: Array<{ event: string; count: number }>;
    eventsOverTime: Array<{ date: string; count: number }>;
  }> {
    const where: any = { tenantId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = startDate;
      }
      if (endDate) {
        where.timestamp.lte = endDate;
      }
    }

    // Get total events
    const totalEvents = await db.analyticsEvent.count({ where });

    // Get unique users
    const uniqueUsers = await db.analyticsEvent.findMany({
      where,
      select: { userId: true },
      distinct: ["userId"],
    });

    // Get unique sessions
    const uniqueSessions = await db.analyticsEvent.findMany({
      where,
      select: { sessionId: true },
      distinct: ["sessionId"],
    });

    // Get top events
    const eventCounts = await db.analyticsEvent.groupBy({
      by: ["event"],
      where,
      _count: { event: true },
      orderBy: { _count: { event: "desc" } },
      take: 10,
    });

    const topEvents = eventCounts.map((item) => ({
      event: item.event,
      count: item._count.event,
    }));

    // Get events over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const eventsOverTime = await db.analyticsEvent.groupBy({
      by: ["timestamp"],
      where: {
        ...where,
        timestamp: {
          gte: thirtyDaysAgo,
        },
      },
      _count: { event: true },
      orderBy: { timestamp: "asc" },
    });

    const eventsByDate = eventsOverTime.map((item) => ({
      date: item.timestamp.toISOString().split("T")[0],
      count: item._count.event,
    }));

    return {
      totalEvents,
      uniqueUsers: uniqueUsers.length,
      uniqueSessions: uniqueSessions.length,
      topEvents,
      eventsOverTime: eventsByDate,
    };
  }

  async getUserJourney(
    userId: string,
    tenantId: string,
    limit: number = 50
  ): Promise<AnalyticsEvent[]> {
    return this.getEvents(tenantId, { userId, limit });
  }

  async getSessionEvents(
    sessionId: string,
    tenantId: string
  ): Promise<AnalyticsEvent[]> {
    return this.getEvents(tenantId, { sessionId });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Predefined event types
export const ANALYTICS_EVENTS = {
  // User events
  USER_REGISTERED: "user_registered",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  USER_PROFILE_UPDATED: "user_profile_updated",

  // Application events
  APP_CREATED: "app_created",
  APP_UPDATED: "app_updated",
  APP_DELETED: "app_deleted",
  APP_DEPLOYED: "app_deployed",

  // Feature events
  FEATURE_USED: "feature_used",
  FEATURE_FLAG_EVALUATED: "feature_flag_evaluated",

  // Navigation events
  PAGE_VIEW: "page_view",
  NAVIGATION: "navigation",

  // Business events
  SUBSCRIPTION_CREATED: "subscription_created",
  SUBSCRIPTION_UPDATED: "subscription_updated",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",

  // Error events
  ERROR_OCCURRED: "error_occurred",
  API_ERROR: "api_error",
} as const;

export type AnalyticsEventType =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
