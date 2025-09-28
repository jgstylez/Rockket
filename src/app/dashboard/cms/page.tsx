"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Image,
  Video,
  Code,
} from "lucide-react";

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  authorId: string;
  tags: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentBlock {
  id: string;
  type: string;
  content: Record<string, any>;
  order: number;
  styles?: Record<string, any>;
}

export default function CMSPage() {
  const { user, tenant } = useAuth();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cms/pages");
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages);
      }
    } catch (error) {
      console.error("Failed to load pages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPage = async () => {
    const title = prompt("Enter page title:");
    if (!title) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    try {
      const response = await fetch("/api/cms/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description: "",
          content: [],
          tags: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPages((prev) => [data.page, ...prev]);
        setSelectedPage(data.page);
        setShowEditor(true);
      }
    } catch (error) {
      console.error("Failed to create page:", error);
    }
  };

  const deletePage = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const response = await fetch(`/api/cms/pages/${pageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPages((prev) => prev.filter((page) => page.id !== pageId));
        if (selectedPage?.id === pageId) {
          setSelectedPage(null);
          setShowEditor(false);
        }
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  const publishPage = async (pageId: string) => {
    try {
      const response = await fetch(`/api/cms/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "published",
        }),
      });

      if (response.ok) {
        setPages((prev) =>
          prev.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  status: "published" as const,
                  publishedAt: new Date().toISOString(),
                }
              : page
          )
        );
      }
    } catch (error) {
      console.error("Failed to publish page:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "code":
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Rockket</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={createPage}>
              <Plus className="h-4 w-4 mr-2" />
              New Page
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Content Management</h1>
            <p className="text-muted-foreground">
              Create and manage your website content with our powerful CMS.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p>Loading pages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pages List */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">
                      Pages ({pages.length})
                    </h2>
                  </div>
                  <div className="divide-y">
                    {pages.length === 0 ? (
                      <div className="p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">
                          No Pages Yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first page to get started with content
                          management.
                        </p>
                        <Button onClick={createPage}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Page
                        </Button>
                      </div>
                    ) : (
                      pages.map((page) => (
                        <div
                          key={page.id}
                          className="p-6 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedPage(page);
                            setShowEditor(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold">{page.title}</h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    page.status
                                  )}`}
                                >
                                  {page.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {page.description || "No description"}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>Slug: /{page.slug}</span>
                                <span>
                                  Updated:{" "}
                                  {new Date(
                                    page.updatedAt
                                  ).toLocaleDateString()}
                                </span>
                                {page.publishedAt && (
                                  <span>
                                    Published:{" "}
                                    {new Date(
                                      page.publishedAt
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  publishPage(page.id);
                                }}
                                disabled={page.status === "published"}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPage(page);
                                  setShowEditor(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deletePage(page.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Page Details */}
              <div className="lg:col-span-1">
                {selectedPage ? (
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Page Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Title
                        </label>
                        <p className="text-sm">{selectedPage.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Slug
                        </label>
                        <p className="text-sm">/{selectedPage.slug}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Status
                        </label>
                        <div className="mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              selectedPage.status
                            )}`}
                          >
                            {selectedPage.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPage.tags.length > 0 ? (
                            selectedPage.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-muted text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No tags
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Created
                        </label>
                        <p className="text-sm">
                          {new Date(
                            selectedPage.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Last Updated
                        </label>
                        <p className="text-sm">
                          {new Date(
                            selectedPage.updatedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-lg border p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      Select a Page
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a page from the list to view its details and edit
                      content.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
