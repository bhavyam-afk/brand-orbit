import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {

    const { username } = params;

    // Validate username
    if (!username || typeof username !== 'string') {
      console.log("[API] Invalid username parameter");
      return NextResponse.json(
        { error: "Invalid username" },
        { status: 400 }
      );
    }

    console.log("[API] Fetching influencer profile for username:", username);
    console.log("[API] Before Prisma query");
    
    // Fetch profile from database
    const profile = await prisma.influencerProfile.findUnique({
      where: { username },
      include: {
        packages: true,
        offers: true,
        payments: true,
      },
    });

    console.log("[API] After Prisma query");
    console.log("[API] Query result:", profile ? "Found" : "Not found");

    // Handle not found
    if (!profile) {
      console.log("[API] Influencer not found for username:", username);
      return NextResponse.json(
        { error: "Influencer not found" },
        { status: 404 }
      );
    }

    // Parse platformLinks if stored as string (Prisma Json field should handle this automatically)
    let platformLinks = profile.platformLinks;
    if (typeof platformLinks === 'string') {
      try {
        platformLinks = JSON.parse(platformLinks);
      } catch (error) {
        console.error("[API] Failed to parse platformLinks:", error);
        platformLinks = {};
      }
    }

    // Prepare response
    const response = {
      id: profile.id,
      userId: profile.userId,
      username: profile.username,
      name: profile.username, // Use username as name (no name field in schema)
      bio: profile.bio,
      niche: profile.niche,
      followersCount: profile.followersCount,
      platformLinks: platformLinks || {},
      profilePic: profile.profilePic,
      avatarUrl: profile.profilePic, // Alias for compatibility
      location: profile.location,
      rating: profile.rating,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      packages: profile.packages || [],
      offers: profile.offers || [],
      payments: profile.payments || [],
      // Additional aliases if needed
      categories: profile.niche,
      platforms: platformLinks || {},
    };

    console.log("[API] Successfully returning profile for:", username);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("[API] Error fetching influencer profile:", error);
    // Handle specific Prisma errors
    if (error instanceof Error) {
      // Prisma connection errors
      if (error.message.includes('connect')) {
        return NextResponse.json(
          { error: "Database connection error" },
          { status: 503 }
        );
      }
      // Prisma query errors
      if (error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: "Invalid query parameters" },
          { status: 400 }
        );
      }
    }
    // Generic error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}