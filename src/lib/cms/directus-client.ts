import {
  createDirectus,
  rest,
  authentication,
  readItems,
  createItem,
  updateItem,
  deleteItem,
} from "@directus/sdk";

// Directus types
interface DirectusSchema {
  directus_users: any[];
  directus_files: any[];
  directus_folders: any[];
  directus_roles: any[];
  directus_permissions: any[];
  directus_presets: any[];
  directus_revisions: any[];
  directus_sessions: any[];
  directus_settings: any[];
  directus_webhooks: any[];
  directus_flows: any[];
  directus_operations: any[];
  directus_notifications: any[];
  directus_panels: any[];
  directus_dashboards: any[];
  directus_shares: any[];
  directus_versions: any[];
  directus_migrations: any[];
  directus_snapshots: any[];
  directus_collections: any[];
  directus_fields: any[];
  directus_relations: any[];
  // Custom collections
  content_pages: any[];
  content_blocks: any[];
  media_files: any[];
  content_categories: any[];
  content_tags: any[];
}

class DirectusClient {
  private client: any;
  private isAuthenticated: boolean = false;

  constructor() {
    const directusUrl = process.env.DIRECTUS_URL || "http://localhost:8055";
    this.client = createDirectus<DirectusSchema>(directusUrl)
      .with(rest())
      .with(authentication());
  }

  async authenticate(email: string, password: string) {
    try {
      await this.client.login(email, password);
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error("Directus authentication failed:", error);
      return false;
    }
  }

  async logout() {
    try {
      await this.client.logout();
      this.isAuthenticated = false;
    } catch (error) {
      console.error("Directus logout failed:", error);
    }
  }

  // Content Pages
  async getContentPages(filters?: any) {
    try {
      return await (this.client.request as any)(
        (readItems as any)("content_pages", {
          fields: ["*"],
          filter: filters,
          sort: ["-date_created"],
        })
      );
    } catch (error) {
      console.error("Failed to fetch content pages:", error);
      return [];
    }
  }

  async getContentPage(id: string) {
    try {
      return await (this.client.request as any)(
        (readItems as any)("content_pages", {
          fields: ["*"],
          filter: { id: { _eq: id } },
        })
      );
    } catch (error) {
      console.error("Failed to fetch content page:", error);
      return null;
    }
  }

  async createContentPage(data: any) {
    try {
      return await (this.client.request as any)(
        (createItem as any)("content_pages", data)
      );
    } catch (error) {
      console.error("Failed to create content page:", error);
      throw error;
    }
  }

  async updateContentPage(id: string, data: any) {
    try {
      return await (this.client.request as any)(
        (updateItem as any)("content_pages", id, data)
      );
    } catch (error) {
      console.error("Failed to update content page:", error);
      throw error;
    }
  }

  async deleteContentPage(id: string) {
    try {
      return await (this.client.request as any)(
        (deleteItem as any)("content_pages", id)
      );
    } catch (error) {
      console.error("Failed to delete content page:", error);
      throw error;
    }
  }

  // Content Blocks
  async getContentBlocks(pageId?: string) {
    try {
      const filters = pageId ? { page_id: { _eq: pageId } } : {};
      return await (this.client.request as any)(
        (readItems as any)("content_blocks", {
          fields: ["*"],
          filter: filters,
          sort: ["sort"],
        })
      );
    } catch (error) {
      console.error("Failed to fetch content blocks:", error);
      return [];
    }
  }

  async createContentBlock(data: any) {
    try {
      return await (this.client.request as any)(
        (createItem as any)("content_blocks", data)
      );
    } catch (error) {
      console.error("Failed to create content block:", error);
      throw error;
    }
  }

  async updateContentBlock(id: string, data: any) {
    try {
      return await (this.client.request as any)(
        (updateItem as any)("content_blocks", id, data)
      );
    } catch (error) {
      console.error("Failed to update content block:", error);
      throw error;
    }
  }

  async deleteContentBlock(id: string) {
    try {
      return await (this.client.request as any)(
        (deleteItem as any)("content_blocks", id)
      );
    } catch (error) {
      console.error("Failed to delete content block:", error);
      throw error;
    }
  }

  // Media Files
  async getMediaFiles(filters?: any) {
    try {
      return await (this.client.request as any)(
        (readItems as any)("directus_files", {
          fields: ["*"],
          filter: filters,
          sort: ["-date_created"],
        })
      );
    } catch (error) {
      console.error("Failed to fetch media files:", error);
      return [];
    }
  }

  async uploadMediaFile(file: File, folderId?: string) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (folderId) {
        formData.append("folder", folderId);
      }

      const response = await fetch(`${process.env.DIRECTUS_URL}/files`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${this.client.getToken()}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Failed to upload media file:", error);
      throw error;
    }
  }

  // Categories and Tags
  async getCategories() {
    try {
      return await (this.client.request as any)(
        (readItems as any)("content_categories", {
          fields: ["*"],
          sort: ["name"],
        })
      );
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  }

  async getTags() {
    try {
      return await (this.client.request as any)(
        (readItems as any)("content_tags", {
          fields: ["*"],
          sort: ["name"],
        })
      );
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      return [];
    }
  }

  // Search
  async searchContent(query: string, type?: string) {
    try {
      const filters: any = {
        _or: [
          { title: { _icontains: query } },
          { content: { _icontains: query } },
          { excerpt: { _icontains: query } },
        ],
      };

      if (type) {
        filters.type = { _eq: type };
      }

      return await (this.client.request as any)(
        (readItems as any)("content_pages", {
          fields: ["*"],
          filter: filters,
          sort: ["-date_created"],
        })
      );
    } catch (error) {
      console.error("Failed to search content:", error);
      return [];
    }
  }

  // Collections and Fields
  async getCollections() {
    try {
      return await (this.client.request as any)(
        (readItems as any)("directus_collections", {
          fields: ["*"],
          filter: { collection: { _nstarts_with: "directus_" } },
        })
      );
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      return [];
    }
  }

  async getCollectionFields(collection: string) {
    try {
      return await (this.client.request as any)(
        (readItems as any)("directus_fields", {
          fields: ["*"],
          filter: { collection: { _eq: collection } },
        })
      );
    } catch (error) {
      console.error("Failed to fetch collection fields:", error);
      return [];
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${process.env.DIRECTUS_URL}/server/ping`);
      return response.ok;
    } catch (error) {
      console.error("Directus health check failed:", error);
      return false;
    }
  }

  // Get authentication status
  isLoggedIn() {
    return this.isAuthenticated;
  }

  // Get current user
  async getCurrentUser() {
    try {
      return await (this.client.request as any)(
        (readItems as any)("directus_users", {
          fields: ["*"],
          filter: { id: { _eq: this.client.getToken() } },
        })
      );
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }
}

// Export singleton instance
export const directusClient = new DirectusClient();
export default directusClient;
