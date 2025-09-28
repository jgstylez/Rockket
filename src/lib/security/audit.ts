import { db } from "@/lib/db/client";
import { SecurityEvent } from "./compliance";

export interface AuditLog {
  id: string;
  userId?: string;
  tenantId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
}

export class AuditService {
  async logEvent(event: SecurityEvent): Promise<void> {
    try {
      await db.content.create({
        data: {
          title: `Security Event - ${event.type}`,
          description: event.description,
          type: "security_event",
          content: JSON.stringify({
            eventType: event.type,
            severity: event.severity,
            userId: event.userId,
            data: event.data,
            ipAddress: event.ipAddress,
            userAgent: event.userAgent,
          }),
          tenantId: event.tenantId,
          userId: event.userId || null,
        },
      });
    } catch (error) {
      console.error("Failed to log security event:", error);
    }
  }

  async logAuditEvent(
    auditLog: Omit<AuditLog, "id" | "timestamp">
  ): Promise<void> {
    try {
      await db.content.create({
        data: {
          title: `Audit Log - ${auditLog.action}`,
          description: `User ${auditLog.userId || "system"} performed ${auditLog.action} on ${auditLog.resource}`,
          type: "audit_log",
          content: JSON.stringify({
            action: auditLog.action,
            resource: auditLog.resource,
            resourceId: auditLog.resourceId,
            details: auditLog.details,
            severity: auditLog.severity,
            ipAddress: auditLog.ipAddress,
            userAgent: auditLog.userAgent,
          }),
          tenantId: auditLog.tenantId,
          userId: auditLog.userId || null,
        },
      });
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }
  }

  async getAuditLogs(
    tenantId: string,
    filters: {
      userId?: string;
      action?: string;
      resource?: string;
      severity?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    } = {}
  ): Promise<AuditLog[]> {
    try {
      const where: any = {
        tenantId,
        type: "audit_log",
      };

      if (filters.userId) {
        where.userId = filters.userId;
      }

      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
          where.createdAt.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.createdAt.lte = filters.endDate;
        }
      }

      const logs = await db.content.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: filters.limit || 100,
      });

      return logs.map((log) => {
        const content = JSON.parse(log.content);
        return {
          id: log.id,
          userId: log.userId || undefined,
          tenantId: log.tenantId,
          action: content.action,
          resource: content.resource,
          resourceId: content.resourceId,
          details: content.details,
          ipAddress: content.ipAddress,
          userAgent: content.userAgent,
          timestamp: log.createdAt,
          severity: content.severity,
        };
      });
    } catch (error) {
      console.error("Failed to get audit logs:", error);
      return [];
    }
  }

  async getSecurityEvents(
    tenantId: string,
    filters: {
      type?: string;
      severity?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    } = {}
  ): Promise<SecurityEvent[]> {
    try {
      const where: any = {
        tenantId,
        type: "security_event",
      };

      if (filters.userId) {
        where.userId = filters.userId;
      }

      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
          where.createdAt.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.createdAt.lte = filters.endDate;
        }
      }

      const events = await db.content.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: filters.limit || 100,
      });

      return events.map((event) => {
        const content = JSON.parse(event.content);
        return {
          id: event.id,
          type: content.eventType,
          severity: content.severity,
          userId: content.userId,
          tenantId: event.tenantId,
          description: event.description,
          data: content.data,
          timestamp: event.createdAt,
          ipAddress: content.ipAddress,
          userAgent: content.userAgent,
        };
      });
    } catch (error) {
      console.error("Failed to get security events:", error);
      return [];
    }
  }

  async getAuditStats(
    tenantId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalEvents: number;
    eventsBySeverity: Record<string, number>;
    eventsByAction: Record<string, number>;
    eventsOverTime: Array<{ date: string; count: number }>;
  }> {
    try {
      const where: any = {
        tenantId,
        type: "audit_log",
      };

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt.gte = startDate;
        }
        if (endDate) {
          where.createdAt.lte = endDate;
        }
      }

      const logs = await db.content.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      const totalEvents = logs.length;
      const eventsBySeverity: Record<string, number> = {};
      const eventsByAction: Record<string, number> = {};

      logs.forEach((log) => {
        const content = JSON.parse(log.content);

        // Count by severity
        const severity = content.severity || "low";
        eventsBySeverity[severity] = (eventsBySeverity[severity] || 0) + 1;

        // Count by action
        const action = content.action || "unknown";
        eventsByAction[action] = (eventsByAction[action] || 0) + 1;
      });

      // Group by date
      const eventsByDate: Record<string, number> = {};
      logs.forEach((log) => {
        const date = log.createdAt.toISOString().split("T")[0];
        eventsByDate[date] = (eventsByDate[date] || 0) + 1;
      });

      const eventsOverTime = Object.entries(eventsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalEvents,
        eventsBySeverity,
        eventsByAction,
        eventsOverTime,
      };
    } catch (error) {
      console.error("Failed to get audit stats:", error);
      return {
        totalEvents: 0,
        eventsBySeverity: {},
        eventsByAction: {},
        eventsOverTime: [],
      };
    }
  }
}
