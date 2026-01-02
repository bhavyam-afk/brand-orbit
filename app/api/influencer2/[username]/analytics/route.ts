import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    const resolvedParams: any = await params;
    let usernameRaw: unknown = resolvedParams?.username;
    if (usernameRaw instanceof Promise) {
      usernameRaw = await usernameRaw;
    }
    const username = Array.isArray(usernameRaw) ? usernameRaw[0] : String(usernameRaw ?? '');
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    // Fetch influencer analytics (followers, engagement, demographics, etc.)
    const influencer = await prisma.creatorProfile.findUnique({
      where: { username },
    });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }
    // Example analytics structure
    const analytics = {
      // followersCount: influencer.followersCount,
      engagementRate: influencer.mlScore, // Placeholder, replace with real engagement
      demographics: {
        location: influencer.location,
        niche: influencer.niche,
      },
      // Add more analytics fields as needed
    };
    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


