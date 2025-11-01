import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    // Fetch influencer profile/settings
    const influencer = await prisma.creatorProfile.findUnique({
      where: { username },
      include: { packages: true },
    });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }
    // Return editable profile info, social links, pricing, notification prefs, verification
    const settings = {
      name: influencer.username,
      bio: influencer.bio,
      niche: influencer.niche,
      profilePic: influencer.profilePicUrl,
      platformLinks: influencer.platformLinks,
      location: influencer.location,
      pricing: influencer.packages,
      // Add notification preferences if available
    };
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
