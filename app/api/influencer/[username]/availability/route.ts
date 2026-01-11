import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: /api/influencer2/:username/availability?start=2025-01-01&end=2025-02-01
// returns availability entries between start (inclusive) and end (exclusive)
export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = await params;
    const url = new URL(req.url);
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json({ error: "start and end query params are required" }, { status: 400 });
    }

    // find creator profile id by username
    const creator = await prisma.creatorProfile.findUnique({ where: { username } });
    if (!creator) return NextResponse.json({ error: "creator not found" }, { status: 404 });

    const startDate = new Date(start);
    const endDate = new Date(end);

    const availability = await prisma.creatorAvailability.findMany({
      where: {
        creatorId: creator.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ availability }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

// POST: upsert a single availability date
// body: { date: string, status: 'AVAILABLE' | 'UNAVAILABLE' | 'TENTATIVE', reason?: string }
export async function POST(req: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = await params;
    const body = await req.json();
    const { date, status, reason } = body;

    if (!date || !status) {
      return NextResponse.json({ error: "date and status are required" }, { status: 400 });
    }

    const creator = await prisma.creatorProfile.findUnique({ where: { username } });
    if (!creator) return NextResponse.json({ error: "creator not found" }, { status: 404 });

    // normalize date to start of day UTC to avoid mismatched timestamps
    const day = new Date(date);
    day.setUTCHours(0, 0, 0, 0);

    let upserted;
    try {
      upserted = await prisma.creatorAvailability.upsert({
        where: { creatorId_date: { creatorId: creator.id, date: day } },
        update: { status, reason },
        create: { creatorId: creator.id, date: day, status, reason },
      });
    } catch (dbErr) {
      console.error('creatorAvailability upsert error:', dbErr);
      return NextResponse.json({ error: 'DB upsert error', details: String(dbErr) }, { status: 500 });
    }

    return NextResponse.json({ availability: upserted }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to upsert availability" }, { status: 500 });
  }
}
