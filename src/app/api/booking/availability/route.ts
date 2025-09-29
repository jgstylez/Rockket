import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const slotId = searchParams.get("slotId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!tenantId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Tenant ID, start date, and end date are required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all bookings in the date range
    const bookings = await prisma.booking.findMany({
      where: {
        tenantId,
        ...(slotId ? { slotId } : {}),
        startAt: { gte: start, lte: end },
        status: { not: "cancelled" },
      },
      include: { slot: true },
    });

    // Get booking slots
    const slots = await prisma.bookingSlot.findMany({
      where: { tenantId, isActive: true },
    });

    // Calculate availability for each slot
    const availability = slots.map((slot) => {
      const slotBookings = bookings.filter((b) => b.slotId === slot.id);
      const availableSlots = [];

      // Simple availability calculation - in a real app, this would be more sophisticated
      const slotDuration = slot.duration;
      const bufferTime = slot.bufferTime;
      const totalDuration = slotDuration + bufferTime;

      // Generate time slots based on availability rules
      for (
        let current = new Date(start);
        current < end;
        current.setMinutes(current.getMinutes() + totalDuration)
      ) {
        const slotStart = new Date(current);
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

        // Check if this slot is already booked
        const isBooked = slotBookings.some((booking) => {
          const bookingStart = new Date(booking.startAt);
          const bookingEnd = new Date(booking.endAt);
          return (
            (slotStart >= bookingStart && slotStart < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (slotStart <= bookingStart && slotEnd >= bookingEnd)
          );
        });

        if (!isBooked && slotEnd <= end) {
          availableSlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            duration: slotDuration,
            price: slot.price,
            currency: slot.currency,
          });
        }
      }

      return {
        slotId: slot.id,
        slotTitle: slot.title,
        duration: slot.duration,
        price: slot.price,
        currency: slot.currency,
        availableSlots,
      };
    });

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
