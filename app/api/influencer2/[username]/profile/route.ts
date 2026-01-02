import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    // Next.js may provide `params` as a Promise-like object — await it first
    // to satisfy the App Router requirement: "params should be awaited before using its properties".
    const resolvedParams: any = await params;
    // Normalize & await username (handle Promise and array cases)
    let usernameRaw: unknown = resolvedParams?.username;
    if (usernameRaw instanceof Promise) {
      try {
        usernameRaw = await usernameRaw;
      } catch (e) {
        console.error('[API] Error awaiting username param', e);
        return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
      }
    }
    const username = Array.isArray(usernameRaw) ? usernameRaw[0] : String(usernameRaw ?? '');

    // Validate username
    if (!username || typeof username !== 'string') {
      console.log('[API] Invalid username parameter');
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    console.log("[API] Fetching influencer profile for username:", username);
    console.log("[API] Before Prisma query");
    
    // Fetch profile from database
    const profile = await prisma.creatorProfile.findUnique({
      where: { username },
      include: {
        packages: true,
        collaborations: true,
        transaction: true,
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

    // Normalize nicheTags to always be an array for safe mapping on the frontend
    let nicheTags = profile.nicheTags;
    if (!Array.isArray(nicheTags)) {
      nicheTags = nicheTags ? [String(nicheTags)] : [];
    }

    // Prepare response
    const response = {
      id: profile.id,
      userId: profile.userId,
      username: profile.username,
      name: profile.username, // Use username as name (no name field in schema)
      bio: profile.bio,
      niche: profile.niche,
      nicheTags: nicheTags,
      // followersCount: profile.followersCount,
      platformLinks: platformLinks || {},
      profilePic: profile.profilePicUrl,
      avatarUrl: profile.profilePicUrl, // Alias for compatibility
      location: profile.location,
      rating: profile.mlScore,
      packages: profile.packages || [],
      offers: profile.collaborations || [],
      payments: profile.transaction || [],
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