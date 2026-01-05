import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] } }
) {
  try {
    let { username } = await params;
    if (Array.isArray(username)) username = username[0];

    let profile: any = null;

    if (username) {
      // Find brand profile by the username from the route param
      profile = await prisma.brandProfile.findFirst({ where: { username } });
    } else {
      // If no username provided, return the first brand profile as a fallback
      profile = await prisma.brandProfile.findFirst();
    }

    if (!profile) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }

    // Normalize some fields for frontend
    const industryTags = Array.isArray(profile.industryTags) ? profile.industryTags : (profile.industryTags ? [profile.industryTags] : []);
    let socialLinks = profile.socialLinks || {};
    if (typeof socialLinks === 'string') {
      try { socialLinks = JSON.parse(socialLinks); } catch (e) { socialLinks = {}; }
    }

    const response = {
      id: profile.id,
      userId: profile.userId,
      username: profile.username,
      logoUrl: profile.logoUrl,
      bio: profile.bio,
      industryTags,
      socialLinks,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[API] Error fetching brand profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
