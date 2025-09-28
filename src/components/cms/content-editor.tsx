"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Eye,
  Edit,
  Trash2,
  Plus,
  Upload,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  Folder,
} from "lucide-react";

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: "draft" | "published" | "archived";
  type: string;
  author: string;
  date_created: string;
  date_updated: string;
  tags?: string[];
  category?: string;
  featured_image?: string;
}

interface ContentBlock {
  id: string;
  type: string;
  content: any;
  sort: number;
  page_id: string;
}

export const ContentEditor: React.FC = () => {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      loadBlocks(selectedPage.id);
    }
  }, [selectedPage]);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cms/directus?type=pages");
      const data = await response.json();
      setPages(data.data || []);
    } catch (error) {
      console.error("Failed to load pages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlocks = async (pageId: string) => {
    try {
      const response = await fetch(
        `/api/cms/directus?type=blocks&pageId=${pageId}`
      );
      const data = await response.json();
      setBlocks(data.data || []);
    } catch (error) {
      console.error("Failed to load blocks:", error);
    }
  };

  const handleCreatePage = async () => {
    const title = prompt("Enter page title:");
    if (!title) return;

    try {
      const response = await fetch("/api/cms/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "page",
          data: {
            title,
            slug: title.toLowerCase().replace(/\s+/g, "-"),
            content: "",
            status: "draft",
            type: "page",
            author: "current-user", // TODO: Get from auth context
          },
        }),
      });

      if (response.ok) {
        loadPages();
      }
    } catch (error) {
      console.error("Failed to create page:", error);
    }
  };

  const handleSavePage = async () => {
    if (!selectedPage) return;

    try {
      const response = await fetch(`/api/cms/directus/${selectedPage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "page",
          data: selectedPage,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        loadPages();
      }
    } catch (error) {
      console.error("Failed to save page:", error);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const response = await fetch(`/api/cms/directus/${pageId}?type=page`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadPages();
        if (selectedPage?.id === pageId) {
          setSelectedPage(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || page.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Content Management</h2>
            <Button onClick={handleCreatePage} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Page
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Pages List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading pages...</p>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">No pages found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPages.map((page) => (
                <Card
                  key={page.id}
                  className={`cursor-pointer transition-colors ${
                    selectedPage?.id === page.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {page.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {page.type} • {page.status}
                        </p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(page.date_created).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePage(page.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedPage ? (
          <>
            {/* Editor Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold">
                    {selectedPage.title}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {selectedPage.slug} • {selectedPage.status}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" onClick={handleSavePage}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="blocks">Blocks</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Page Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={selectedPage.title}
                              onChange={(e) =>
                                setSelectedPage({
                                  ...selectedPage,
                                  title: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Content
                            </label>
                            <textarea
                              value={selectedPage.content}
                              onChange={(e) =>
                                setSelectedPage({
                                  ...selectedPage,
                                  content: e.target.value,
                                })
                              }
                              rows={10}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          <h1>{selectedPage.title}</h1>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: selectedPage.content,
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="blocks" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Blocks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No content blocks yet</p>
                        <Button className="mt-4" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Block
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="media" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Media Library</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No media files yet</p>
                        <Button className="mt-4" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Media
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Page Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Slug
                          </label>
                          <input
                            type="text"
                            value={selectedPage.slug}
                            onChange={(e) =>
                              setSelectedPage({
                                ...selectedPage,
                                slug: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Status
                          </label>
                          <select
                            value={selectedPage.status}
                            onChange={(e) =>
                              setSelectedPage({
                                ...selectedPage,
                                status: e.target.value as any,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Page Selected</h3>
              <p className="text-gray-500 mb-4">
                Select a page from the sidebar to start editing
              </p>
              <Button onClick={handleCreatePage}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Page
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
