/**
 * Base Database Service for Rockket Platform
 *
 * This module provides a foundation for all database services
 * with common CRUD operations and query optimization.
 */

import { PrismaClient } from "@prisma/client";

export abstract class BaseService<T> {
  protected db: PrismaClient;
  protected model: string;

  constructor(db: PrismaClient, model: string) {
    this.db = db;
    this.model = model;
  }

  async findMany(options: {
    where?: any;
    include?: any;
    orderBy?: any;
    take?: number;
    skip?: number;
  }) {
    return this.db[this.model].findMany(options);
  }

  async findUnique(where: any, include?: any) {
    return this.db[this.model].findUnique({
      where,
      include,
    });
  }

  async findFirst(where: any, include?: any) {
    return this.db[this.model].findFirst({
      where,
      include,
    });
  }

  async create(data: any) {
    return this.db[this.model].create({ data });
  }

  async createMany(data: any[]) {
    return this.db[this.model].createMany({ data });
  }

  async update(where: any, data: any) {
    return this.db[this.model].update({
      where,
      data,
    });
  }

  async updateMany(where: any, data: any) {
    return this.db[this.model].updateMany({
      where,
      data,
    });
  }

  async upsert(where: any, create: any, update: any) {
    return this.db[this.model].upsert({
      where,
      create,
      update,
    });
  }

  async delete(where: any) {
    return this.db[this.model].delete({ where });
  }

  async deleteMany(where: any) {
    return this.db[this.model].deleteMany({ where });
  }

  async count(where?: any) {
    return this.db[this.model].count({ where });
  }

  async aggregate(aggregate: any) {
    return this.db[this.model].aggregate(aggregate);
  }

  async groupBy(groupBy: any) {
    return this.db[this.model].groupBy(groupBy);
  }

  // Pagination helper
  async findManyPaginated(options: {
    where?: any;
    include?: any;
    orderBy?: any;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 20, ...queryOptions } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.findMany({
        ...queryOptions,
        take: limit,
        skip,
      }),
      this.count(queryOptions.where),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Search helper
  async search(options: {
    where?: any;
    include?: any;
    orderBy?: any;
    searchFields: string[];
    searchTerm: string;
    page?: number;
    limit?: number;
  }) {
    const { searchFields, searchTerm, ...queryOptions } = options;

    // Build search conditions
    const searchConditions = searchFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));

    const searchWhere = {
      ...queryOptions.where,
      OR: searchConditions,
    };

    return this.findManyPaginated({
      ...queryOptions,
      where: searchWhere,
    });
  }
}
