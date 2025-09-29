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

export default function CommunicationsDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [calls, setCalls] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [messagesRes, callsRes, webhooksRes] = await Promise.all([
        fetch("/api/sms/messages?tenantId=demo-tenant"),
        fetch("/api/voice/calls?tenantId=demo-tenant"),
        fetch("/api/sms/webhooks?tenantId=demo-tenant"),
      ]);

      const [messagesData, callsData, webhooksData] = await Promise.all([
        messagesRes.json(),
        callsRes.json(),
        webhooksRes.json(),
      ]);

      setMessages(messagesData.messages || []);
      setCalls(callsData.calls || []);
      setWebhooks(webhooksData.webhooks || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
      case "queued":
      case "initiated":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "undelivered":
      case "busy":
      case "no-answer":
        return "bg-red-100 text-red-800";
      case "ringing":
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case "inbound":
        return "bg-blue-100 text-blue-800";
      case "outbound":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading communications...</div>
        </div>
      </div>
    );
  }

  const sentMessages = messages.filter((m) => m.direction === "outbound");
  const receivedMessages = messages.filter((m) => m.direction === "inbound");
  const completedCalls = calls.filter((c) => c.status === "completed");
  const totalCost = [...messages, ...calls].reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-gray-600">
            SMS messages, voice calls, and webhook management
          </p>
        </div>
        <div className="flex gap-2">
          <Button>Send SMS</Button>
          <Button variant="outline">Make Call</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {sentMessages.length}
            </div>
            <div className="text-sm text-gray-600">Sent Messages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {receivedMessages.length}
            </div>
            <div className="text-sm text-gray-600">Received Messages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {completedCalls.length}
            </div>
            <div className="text-sm text-gray-600">Completed Calls</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              ${totalCost.toFixed(4)}
            </div>
            <div className="text-sm text-gray-600">Total Cost</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">SMS Messages</TabsTrigger>
          <TabsTrigger value="calls">Voice Calls</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid gap-6">
            {messages.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No messages yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Send your first SMS message
                    </p>
                    <Button>Send SMS</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              messages.map((message) => (
                <Card key={message.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {message.direction === "outbound" ? "→" : "←"}{" "}
                          {message.to}
                          <Badge
                            className={getDirectionColor(message.direction)}
                          >
                            {message.direction}
                          </Badge>
                          <Badge className={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          From: {message.from} •{" "}
                          {formatDateTime(message.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        {message.price && (
                          <div>${message.price.toFixed(4)}</div>
                        )}
                        {message.segments > 1 && (
                          <div>{message.segments} segments</div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Message:</span>{" "}
                        {message.body}
                      </div>
                      {message.messageId && (
                        <div className="text-sm text-gray-600">
                          ID: {message.messageId}
                        </div>
                      )}
                      {message.errorMessage && (
                        <div className="text-sm text-red-600">
                          Error: {message.errorMessage}
                        </div>
                      )}
                      {message.user && (
                        <div className="text-sm text-gray-600">
                          User: {message.user.name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="calls" className="space-y-6">
          <div className="grid gap-6">
            {calls.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">No calls yet</h3>
                    <p className="text-gray-600 mb-4">
                      Make your first voice call
                    </p>
                    <Button>Make Call</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              calls.map((call) => (
                <Card key={call.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {call.direction === "outbound" ? "→" : "←"} {call.to}
                          <Badge className={getDirectionColor(call.direction)}>
                            {call.direction}
                          </Badge>
                          <Badge className={getStatusColor(call.status)}>
                            {call.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          From: {call.from} • {formatDateTime(call.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        {call.price && <div>${call.price.toFixed(4)}</div>}
                        {call.duration > 0 && (
                          <div>{formatDuration(call.duration)}</div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {call.callId && (
                        <div className="text-sm text-gray-600">
                          Call ID: {call.callId}
                        </div>
                      )}
                      {call.recordingUrl && (
                        <div className="text-sm">
                          <span className="font-medium">Recording:</span>{" "}
                          <a
                            href={call.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Listen
                          </a>
                        </div>
                      )}
                      {call.startTime && (
                        <div className="text-sm text-gray-600">
                          Started: {formatDateTime(call.startTime)}
                        </div>
                      )}
                      {call.endTime && (
                        <div className="text-sm text-gray-600">
                          Ended: {formatDateTime(call.endTime)}
                        </div>
                      )}
                      {call.user && (
                        <div className="text-sm text-gray-600">
                          User: {call.user.name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="grid gap-6">
            {webhooks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No webhooks yet
                    </h3>
                    <p className="text-gray-600">
                      Webhook events from Twilio will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              webhooks.map((webhook) => (
                <Card key={webhook.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {webhook.eventType}
                          <Badge
                            className={
                              webhook.processed
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {webhook.processed ? "Processed" : "Pending"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {formatDateTime(webhook.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        {webhook.messageId && (
                          <div>Message: {webhook.messageId}</div>
                        )}
                        {webhook.callId && <div>Call: {webhook.callId}</div>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Payload:</span>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(webhook.payload, null, 2)}
                        </pre>
                      </div>
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
