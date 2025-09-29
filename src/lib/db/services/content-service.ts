/**
 * Content Service for Rockket Platform
 *
 * This service handles all content-related database operations
 * with tenant isolation and optimized queries.
 */

import { PrismaClient, Content } from "@prisma/client";
import { BaseService } from "./base-service";

export class ContentService extends BaseService<Content> {
  constructor(db: PrismaClient) {
    super(db, "content");
  }

  async findByTenant(
    tenantId: string,
    options: {
      type?: string;
      status?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    return this.findMany({
      where: {
        tenantId,
        ...(options.type && { type: options.type }),
        ...(options.status && { status: options.status }),
      },
      orderBy: { updatedAt: "desc" },
      take: options.limit || 20,
      skip: options.offset || 0,
    });
  }

  async findBySlug(tenantId: string, slug: string) {
    return this.findUnique({
      tenantId_slug: {
        tenantId,
        slug,
      },
    });
  }

  async findByType(
    tenantId: string,
    type: string,
    options: {
      status?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    return this.findMany({
      where: {
        tenantId,
        type,
        ...(options.status && { status: options.status }),
      },
      orderBy: { updatedAt: "desc" },
      take: options.limit || 20,
      skip: options.offset || 0,
    });
  }

  async searchContent(
    tenantId: string,
    searchTerm: string,
    options: {
      type?: string;
      status?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    return this.search({
      where: {
        tenantId,
        ...(options.type && { type: options.type }),
        ...(options.status && { status: options.status }),
      },
      searchFields: ["title", "content", "slug"],
      searchTerm,
      page: Math.floor((options.offset || 0) / (options.limit || 20)) + 1,
      limit: options.limit || 20,
    });
  }

  async getContentStats(tenantId: string) {
    const [total, published, draft, archived] = await Promise.all([
      this.count({ tenantId }),
      this.count({ tenantId, status: "published" }),
      this.count({ tenantId, status: "draft" }),
      this.count({ tenantId, status: "archived" }),
    ]);

    return {
      total,
      published,
      draft,
      archived,
    };
  }

  async getContentByType(tenantId: string) {
    return this.groupBy({
      by: ["type"],
      where: { tenantId },
      _count: {
        id: true,
      },
    });
  }

  async getRecentContent(tenantId: string, limit = 10) {
    return this.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  }

  async createContent(
    tenantId: string,
    data: {
      title: string;
      slug: string;
      content: string;
      type: string;
      status?: string;
      metadata?: any;
    }
  ) {
    return this.create({
      ...data,
      tenantId,
      status: data.status || "draft",
    });
  }

  async updateContent(tenantId: string, id: string, data: any) {
    return this.update({ id, tenantId }, { ...data, updatedAt: new Date() });
  }

  async deleteContent(tenantId: string, id: string) {
    return this.delete({ id, tenantId });
  }

  async publishContent(tenantId: string, id: string) {
    return this.update(
      { id, tenantId },
      { status: "published", publishedAt: new Date() }
    );
  }

  async unpublishContent(tenantId: string, id: string) {
    return this.update(
      { id, tenantId },
      { status: "draft", publishedAt: null }
    );
  }

  async archiveContent(tenantId: string, id: string) {
    return this.update(
      { id, tenantId },
      { status: "archived", archivedAt: new Date() }
    );
  }
}
