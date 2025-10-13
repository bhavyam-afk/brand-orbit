import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    // Fetch influencer analytics (followers, engagement, demographics, etc.)
    const influencer = await prisma.influencerProfile.findUnique({
      where: { username },
    });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }
    // Example analytics structure
    const analytics = {
      followersCount: influencer.followersCount,
      engagementRate: influencer.rating, // Placeholder, replace with real engagement
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
