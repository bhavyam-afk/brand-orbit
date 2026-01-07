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

    let snapshots: any[] = [];
    try {
      const profile = await prisma.creatorProfile.findUnique({ where: { username }, select: { id: true } });
      if (!profile) {
        return NextResponse.json({ error: "Creator not found" }, { status: 404 });
      }

      snapshots = await prisma.creatorFollowerSnapshot.findMany({
        where: { creatorId: profile.id },
        orderBy: { recordedAt: "asc" },
      });
    } catch (dbErr) {
      console.error("[API] followers DB error:", dbErr);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    return NextResponse.json({ snapshots }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
