"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  Pin,
  Lock,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";

interface Forum {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  threads: ForumThread[];
  _count: {
    threads: number;
  };
}

interface ForumThread {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  lastReplyAt?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  forum: {
    id: string;
    name: string;
    slug: string;
  };
  replies: ForumReply[];
  _count: {
    replies: number;
  };
}

interface ForumReply {
  id: string;
  content: string;
  isSolution: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface CommunityMember {
  id: string;
  userId: string;
  role: string;
  reputation: number;
  badges: string[];
  joinedAt: string;
  lastActiveAt?: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export default function CommunityPage() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("forums");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [forumsRes, threadsRes, membersRes] = await Promise.all([
        fetch("/api/community/forums?tenantId=demo-tenant"),
        fetch("/api/community/threads?tenantId=demo-tenant"),
        fetch("/api/community/members?tenantId=demo-tenant"),
      ]);

      const forumsData = await forumsRes.json();
      const threadsData = await threadsRes.json();
      const membersData = await membersRes.json();

      setForums(forumsData.forums || []);
      setThreads(threadsData.threads || []);
      setMembers(membersData.members || []);
    } catch (error) {
      console.error("Failed to load community data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      case "member":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <AlertCircle className="h-4 w-4" />;
      case "moderator":
        return <CheckCircle className="h-4 w-4" />;
      case "member":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const stats = {
    totalForums: forums.length,
    totalThreads: threads.length,
    totalMembers: members.length,
    activeMembers: members.filter(
      (m) =>
        m.lastActiveAt &&
        new Date(m.lastActiveAt) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Community</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Forum
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-4 border-b border-gray-200">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="forums">Forums</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading...</p>
            </div>
          ) : activeTab === "forums" ? (
            <div className="space-y-2">
              {forums.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">No forums found</p>
                </div>
              ) : (
                forums.map((forum) => (
                  <Card
                    key={forum.id}
                    className="cursor-pointer hover:border-gray-300"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {forum.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {forum.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <span className="mr-2">
                              {forum._count.threads} threads
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <Card
                  key={member.id}
                  className="cursor-pointer hover:border-gray-300"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {member.user.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {member.reputation} reputation
                        </p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}
                          >
                            {member.role}
                          </span>
                          <span className="ml-2">
                            {member.badges.length} badges
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
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
        {/* Header with Stats */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Community Dashboard</h1>
              <p className="text-sm text-gray-500">
                Manage your community forums and members
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalForums}
                </div>
                <div className="text-xs text-gray-500">Forums</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalThreads}
                </div>
                <div className="text-xs text-gray-500">Threads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.activeMembers}
                </div>
                <div className="text-xs text-gray-500">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.totalMembers}
                </div>
                <div className="text-xs text-gray-500">Total Members</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="forums">Forums</TabsTrigger>
              <TabsTrigger value="threads">Recent Threads</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Forums
                    </CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalForums}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Community forums
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Threads
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalThreads}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Discussion threads
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Members
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.activeMembers}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active in last 7 days
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="forums" className="mt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Community Forums</h3>
                <p className="text-gray-500 mb-4">
                  Create and manage discussion forums
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Forum
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="threads" className="mt-6">
              <div className="space-y-4">
                {threads.slice(0, 10).map((thread) => (
                  <Card key={thread.id} className="hover:border-gray-300">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {thread.isPinned && (
                              <Pin className="h-4 w-4 text-yellow-500" />
                            )}
                            {thread.isLocked && (
                              <Lock className="h-4 w-4 text-red-500" />
                            )}
                            <h3 className="font-medium text-sm truncate">
                              {thread.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            by {thread.author.name} in {thread.forum.name}
                          </p>
                          <div className="flex items-center text-xs text-gray-400 space-x-4">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {thread.viewCount} views
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {thread._count.replies} replies
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(thread.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Community Members
                </h3>
                <p className="text-gray-500 mb-4">
                  Manage community members and their roles
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Members
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
