"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Reply,
  ThumbsUp,
  Share,
  Bell,
  Settings,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  History,
  GitBranch,
  Merge,
  ArrowRight,
  Send,
  MoreHorizontal,
  Video,
  Phone,
  ScreenShare,
  Mic,
  MicOff,
  Camera,
  CameraOff,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "owner" | "admin" | "editor" | "viewer";
  status: "online" | "away" | "offline";
  currentActivity: string;
  lastSeen: string;
}

interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  timestamp: string;
  resolved: boolean;
  replies: Comment[];
  likes: number;
  elementId?: string;
}

interface LiveCollaborationProps {
  onInviteUser?: (email: string) => void;
  onCommentAdded?: (comment: Comment) => void;
  onCommentResolved?: (commentId: string) => void;
}

export function LiveCollaboration({
  onInviteUser,
  onCommentAdded,
  onCommentResolved,
}: LiveCollaborationProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    // Simulate loading team data
    setTeamMembers([
      {
        id: "1",
        name: "Sarah Chen",
        email: "sarah@company.com",
        avatar: "/avatars/sarah.jpg",
        role: "owner",
        status: "online",
        currentActivity: "Editing homepage header",
        lastSeen: "now",
      },
      {
        id: "2",
        name: "Mike Johnson",
        email: "mike@company.com",
        avatar: "/avatars/mike.jpg",
        role: "editor",
        status: "online",
        currentActivity: "Reviewing contact form",
        lastSeen: "2 min ago",
      },
      {
        id: "3",
        name: "Alex Rivera",
        email: "alex@company.com",
        avatar: "/avatars/alex.jpg",
        role: "viewer",
        status: "away",
        currentActivity: "Viewing analytics",
        lastSeen: "5 min ago",
      },
    ]);

    setComments([
      {
        id: "1",
        author: teamMembers[1] || {
          id: "2",
          name: "Mike Johnson",
          email: "mike@company.com",
          avatar: "/avatars/mike.jpg",
          role: "editor",
          status: "online",
          currentActivity: "Reviewing contact form",
          lastSeen: "2 min ago",
        },
        content:
          "The contact form looks great! Should we add a phone number field?",
        timestamp: "2 minutes ago",
        resolved: false,
        replies: [],
        likes: 2,
        elementId: "contact-form",
      },
      {
        id: "2",
        author: teamMembers[0] || {
          id: "1",
          name: "Sarah Chen",
          email: "sarah@company.com",
          avatar: "/avatars/sarah.jpg",
          role: "owner",
          status: "online",
          currentActivity: "Editing homepage header",
          lastSeen: "now",
        },
        content:
          "The header needs to be more prominent. Can we increase the font size?",
        timestamp: "5 minutes ago",
        resolved: true,
        replies: [
          {
            id: "2-1",
            author: teamMembers[1] || {
              id: "2",
              name: "Mike Johnson",
              email: "mike@company.com",
              avatar: "/avatars/mike.jpg",
              role: "editor",
              status: "online",
              currentActivity: "Reviewing contact form",
              lastSeen: "2 min ago",
            },
            content: "Done! Increased to 2.5rem",
            timestamp: "3 minutes ago",
            resolved: false,
            replies: [],
            likes: 1,
          },
        ],
        likes: 0,
        elementId: "header",
      },
    ]);
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: teamMembers[0],
      content: newComment,
      timestamp: "now",
      resolved: false,
      replies: [],
      likes: 0,
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
    onCommentAdded?.(comment);
  };

  const handleResolveComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, resolved: true } : comment
      )
    );
    onCommentResolved?.(commentId);
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "editor":
        return "bg-green-100 text-green-800 border-green-200";
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team Collaboration
          </CardTitle>
          <CardDescription>
            {teamMembers.length} team members •{" "}
            {teamMembers.filter((m) => m.status === "online").length} online
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`}
                  ></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{member.name}</span>
                    <Badge className={getRoleColor(member.role)}>
                      {member.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.currentActivity}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {member.lastSeen}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button size="sm" variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Team Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Live Communication
          </CardTitle>
          <CardDescription>
            Real-time collaboration tools and communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Button
              variant={isVideoCall ? "default" : "outline"}
              size="sm"
              onClick={() => setIsVideoCall(!isVideoCall)}
            >
              {isVideoCall ? (
                <Video className="h-4 w-4 mr-2" />
              ) : (
                <Video className="h-4 w-4 mr-2" />
              )}
              {isVideoCall ? "End Call" : "Start Call"}
            </Button>
            <Button
              variant={isScreenSharing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              <ScreenShare className="h-4 w-4 mr-2" />
              {isScreenSharing ? "Stop Share" : "Share Screen"}
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Voice Call
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>

          {isVideoCall && (
            <div className="bg-black rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Video Call Active</span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                3 participants • 15:32 duration
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments & Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Comments & Feedback
          </CardTitle>
          <CardDescription>
            {comments.length} comments •{" "}
            {comments.filter((c) => !c.resolved).length} unresolved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add Comment */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a comment or feedback..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
                rows={2}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-lg border ${comment.resolved ? "bg-green-50 border-green-200" : "bg-muted/50"}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={comment.author.avatar}
                        alt={comment.author.name}
                      />
                      <AvatarFallback>
                        {comment.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {comment.timestamp}
                        </span>
                        {comment.resolved && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mb-2">{comment.content}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleLikeComment(comment.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        {!comment.resolved && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleResolveComment(comment.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Version History
          </CardTitle>
          <CardDescription>
            Track changes and collaborate on different versions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Current Version</span>
                  <Badge className="bg-green-100 text-green-800">Live</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Updated 2 minutes ago by Sarah Chen
                </p>
              </div>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Draft Version</span>
                  <Badge className="bg-blue-100 text-blue-800">Draft</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Updated 1 hour ago by Mike Johnson
                </p>
              </div>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
