"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VideoDashboard() {
  const [assets, setAssets] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, tokensRes, streamsRes] = await Promise.all([
        fetch("/api/video/assets?tenantId=demo-tenant"),
        fetch("/api/video/tokens?tenantId=demo-tenant"),
        fetch("/api/video/stream?tenantId=demo-tenant"),
      ]);

      const [assetsData, tokensData, streamsData] = await Promise.all([
        assetsRes.json(),
        tokensRes.json(),
        streamsRes.json(),
      ]);

      setAssets(assetsData.assets || []);
      setTokens(tokensData.tokens || []);
      setStreams(streamsData.streams || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "free":
        return "bg-green-100 text-green-800";
      case "premium":
        return "bg-blue-100 text-blue-800";
      case "course":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (bytes: bigint) => {
    const size = Number(bytes);
    if (size === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return `${(size / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading video assets...</div>
        </div>
      </div>
    );
  }

  const readyAssets = assets.filter((a) => a.status === "ready");
  const processingAssets = assets.filter((a) => a.status === "processing");
  const activeTokens = tokens.filter(
    (t) => t.isActive && new Date(t.expiresAt) > new Date()
  );
  const totalStreams = streams.length;
  const totalBytesStreamed = streams.reduce(
    (sum, s) => sum + Number(s.bytesStreamed || 0),
    0
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Secure Video</h1>
          <p className="text-gray-600">
            Manage video assets, access tokens, and streaming analytics
          </p>
        </div>
        <Button>Upload Video</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {readyAssets.length}
            </div>
            <div className="text-sm text-gray-600">Ready Assets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {processingAssets.length}
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {activeTokens.length}
            </div>
            <div className="text-sm text-gray-600">Active Tokens</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {totalStreams}
            </div>
            <div className="text-sm text-gray-600">Total Streams</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assets">Video Assets</TabsTrigger>
          <TabsTrigger value="tokens">Access Tokens</TabsTrigger>
          <TabsTrigger value="streams">Streaming Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6">
          <div className="grid gap-6">
            {assets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No video assets yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upload your first video asset
                    </p>
                    <Button>Upload Video</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              assets.map((asset) => (
                <Card key={asset.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {asset.title}
                          <Badge className={getStatusColor(asset.status)}>
                            {asset.status}
                          </Badge>
                          <Badge
                            className={getAccessLevelColor(asset.accessLevel)}
                          >
                            {asset.accessLevel}
                          </Badge>
                          {asset.drmEnabled && (
                            <Badge className="bg-red-100 text-red-800">
                              DRM
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {asset.description || "No description"}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        {asset.duration && (
                          <div>{formatDuration(asset.duration)}</div>
                        )}
                        <div>{formatFileSize(asset.fileSize)}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-600">
                            Filename
                          </div>
                          <div className="truncate">{asset.filename}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-600">
                            MIME Type
                          </div>
                          <div>{asset.mimeType}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-600">
                            Access
                          </div>
                          <div>{asset.isPublic ? "Public" : "Private"}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-600">Usage</div>
                          <div>
                            {asset._count?.tokens || 0} tokens,{" "}
                            {asset._count?.streams || 0} streams
                          </div>
                        </div>
                      </div>
                      {asset.thumbnail && (
                        <div className="mt-4">
                          <img
                            src={asset.thumbnail}
                            alt="Thumbnail"
                            className="w-32 h-20 object-cover rounded"
                          />
                        </div>
                      )}
                      {asset.lessonId && (
                        <div className="text-sm text-gray-600">
                          Linked to lesson: {asset.lessonId}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <div className="grid gap-6">
            {tokens.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No access tokens yet
                    </h3>
                    <p className="text-gray-600">
                      Access tokens will appear here when generated
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              tokens.map((token) => (
                <Card key={token.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {token.asset?.title}
                          <Badge
                            className={
                              token.isActive &&
                              new Date(token.expiresAt) > new Date()
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {token.isActive &&
                            new Date(token.expiresAt) > new Date()
                              ? "Active"
                              : "Expired"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Token: {token.token.slice(0, 16)}...
                          {token.user && ` • User: ${token.user.name}`}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>Expires: {formatDateTime(token.expiresAt)}</div>
                        <div>Created: {formatDateTime(token.createdAt)}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Permissions:</span>{" "}
                        {Object.keys(token.permissions || {}).join(", ") ||
                          "None"}
                      </div>
                      {token.ipAddress && (
                        <div className="text-sm text-gray-600">
                          IP: {token.ipAddress}
                        </div>
                      )}
                      {token.userAgent && (
                        <div className="text-sm text-gray-600">
                          User Agent: {token.userAgent.slice(0, 50)}...
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="streams" className="space-y-6">
          <div className="grid gap-6">
            {streams.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No streaming data yet
                    </h3>
                    <p className="text-gray-600">
                      Streaming analytics will appear here when users watch
                      videos
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              streams.map((stream) => (
                <Card key={stream.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {stream.asset?.title}
                          <Badge className="bg-blue-100 text-blue-800">
                            {stream.quality}
                          </Badge>
                          {stream.endTime && (
                            <Badge className="bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Session: {stream.sessionId}
                          {stream.user && ` • User: ${stream.user.name}`}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>
                          Duration: {formatDuration(stream.duration || 0)}
                        </div>
                        <div>
                          Data:{" "}
                          {formatFileSize(BigInt(stream.bytesStreamed || 0))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Started:</span>{" "}
                        {formatDateTime(stream.startTime)}
                      </div>
                      {stream.endTime && (
                        <div className="text-sm">
                          <span className="font-medium">Ended:</span>{" "}
                          {formatDateTime(stream.endTime)}
                        </div>
                      )}
                      {stream.ipAddress && (
                        <div className="text-sm text-gray-600">
                          IP: {stream.ipAddress}
                        </div>
                      )}
                      {stream.userAgent && (
                        <div className="text-sm text-gray-600">
                          User Agent: {stream.userAgent.slice(0, 50)}...
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
