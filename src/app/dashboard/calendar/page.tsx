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

export default function CalendarDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, slotsRes, bookingsRes] = await Promise.all([
        fetch("/api/calendar/events?tenantId=demo-tenant"),
        fetch("/api/booking/slots?tenantId=demo-tenant"),
        fetch("/api/booking/bookings?tenantId=demo-tenant"),
      ]);

      const [eventsData, slotsData, bookingsData] = await Promise.all([
        eventsRes.json(),
        slotsRes.json(),
        bookingsRes.json(),
      ]);

      setEvents(eventsData.events || []);
      setSlots(slotsData.slots || []);
      setBookings(bookingsData.bookings || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "no_show":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800";
      case "appointment":
        return "bg-green-100 text-green-800";
      case "class":
        return "bg-purple-100 text-purple-800";
      case "event":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading calendar...</div>
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter((e) => new Date(e.startAt) > new Date());
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar & Booking</h1>
          <p className="text-gray-600">
            Manage events, booking slots, and appointments
          </p>
        </div>
        <Button>Create Event</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {upcomingEvents.length}
            </div>
            <div className="text-sm text-gray-600">Upcoming Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingBookings.length}
            </div>
            <div className="text-sm text-gray-600">Pending Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {bookings.length}
            </div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              ${totalRevenue.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Revenue</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="slots">Booking Slots</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="grid gap-6">
            {events.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No events yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first calendar event
                    </p>
                    <Button>Create Event</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {event.title}
                          <Badge className={getTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {event.description || "No description"}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>Start: {formatDateTime(event.startAt)}</div>
                        <div>End: {formatDateTime(event.endAt)}</div>
                        {event.location && <div>📍 {event.location}</div>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Owner: {event.owner?.name || "Unassigned"} • Bookings:{" "}
                        {event._count?.bookings || 0}
                      </div>
                      {event.isRecurring && (
                        <Badge variant="outline">Recurring</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="slots" className="space-y-6">
          <div className="grid gap-6">
            {slots.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No booking slots yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create booking slots for customers to book
                    </p>
                    <Button>Create Slot</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              slots.map((slot) => (
                <Card key={slot.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {slot.title}
                          <Badge
                            className={
                              slot.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {slot.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {slot.description || "No description"}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${slot.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {slot.duration} min
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-600">
                          Duration
                        </div>
                        <div>{slot.duration} minutes</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">
                          Max Bookings
                        </div>
                        <div>{slot.maxBookings}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">
                          Buffer Time
                        </div>
                        <div>{slot.bufferTime} min</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">
                          Bookings
                        </div>
                        <div>{slot._count?.bookings || 0}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="grid gap-6">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-600">
                      Customer bookings will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {booking.customerName}
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <Badge
                            className={
                              booking.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {booking.paymentStatus}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {booking.customerEmail} •{" "}
                          {booking.customerPhone || "No phone"}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${booking.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDateTime(booking.startAt)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {booking.slot && (
                        <div className="text-sm">
                          <span className="font-medium">Slot:</span>{" "}
                          {booking.slot.title}
                        </div>
                      )}
                      {booking.event && (
                        <div className="text-sm">
                          <span className="font-medium">Event:</span>{" "}
                          {booking.event.title}
                        </div>
                      )}
                      {booking.notes && (
                        <div className="text-sm">
                          <span className="font-medium">Notes:</span>{" "}
                          {booking.notes}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        Owner: {booking.owner?.name || "Unassigned"}
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
