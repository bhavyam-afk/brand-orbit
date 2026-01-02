import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    const resolvedParams: any = await params;
    let usernameRaw: unknown = resolvedParams?.username;
    if (usernameRaw instanceof Promise) usernameRaw = await usernameRaw;
    const username = Array.isArray(usernameRaw) ? usernameRaw[0] : String(usernameRaw ?? "");

    if (!username) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    console.log("[API] followers request for username:", username);
    const profile = await prisma.creatorProfile.findUnique({ where: { username } });
    if (!profile) {
      console.log("[API] followers: profile not found for", username);
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // 1️⃣ Build last 5 months (oldest → newest)
    const now = new Date();
    const monthLabels: string[] = [];
    const monthEnds: Date[] = [];

    for (let i = 4; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      monthLabels.push(start.toLocaleString("en-US", { month: "short" }));
      monthEnds.push(end);
    }

    // 2️⃣ Fetch ALL snapshots up to now
    let snapshots: any[] = [];
    try {
      snapshots = await prisma.creatorFollowerSnapshot.findMany({
        where: { creatorId: profile.id },
        orderBy: { recordedAt: "asc" },
      });
      console.log("[API] followers: snapshots count:", snapshots.length, "for creatorId", profile.id);
    } catch (dbErr) {
      console.error("[API] followers DB error:", dbErr);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    let lastKnown = 0;

    const totals = monthEnds.map(end => {
      const snapshot = [...snapshots]
        .reverse()
        .find((s: any) => new Date(s.recordedAt).getTime() <= end.getTime());

      if (snapshot) lastKnown = Number(snapshot.followers || lastKnown);

      return lastKnown;
    });

    return NextResponse.json({ months: monthLabels, totals }, { status: 200 });
  } catch (error) {
    console.error("[API] followers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
