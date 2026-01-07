import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    const resolvedParams: any = await params;
    // Normalize & await username (handle Promise and array cases)
    let usernameRaw: any = resolvedParams?.username;
    if (usernameRaw instanceof Promise) {
      try {
        usernameRaw = await usernameRaw;
      } catch (e) {
        return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
      }
    }

    const username = Array.isArray(usernameRaw) ? usernameRaw[0] : String(usernameRaw);

    // Validate username
    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is not a string' }, { status: 400 });
    }
    
    // Fetch profile from database
    const profile = await prisma.creatorProfile.findUnique({
      where: { username },
      include: {
        packages: true,
        collaborations: true,
        transaction: true,
      },
    });

    // Handle not found
    if (!profile) {
      return NextResponse.json(
        { error: "No Creatr found" },
        { status: 404 }
      );
    }

    // DURING STORAGE TAKE CARE OF THESE STEPS NOW.  
    // Parse platformLinks if stored as string (Prisma Json field should handle this automatically)
    // let platformLinks = profile.platformLinks;
    // if (typeof platformLinks === 'string') {
    //   try {
    //     platformLinks = JSON.parse(platformLinks);
    //   } catch (error) {
    //     platformLinks = {};
    //   }
    // }

    // Normalize nicheTags to always be an array for safe mapping on the frontend
    // let nicheTags = profile.nicheTags;
    // if (!Array.isArray(nicheTags)) {
    //   nicheTags = nicheTags ? [String(nicheTags)] : [];
    // }

    // Prepare response
    const response = {
      id: profile.id,
      userId: profile.userId,
      username: profile.username,
      bio: profile.bio,
      niche: profile.niche,
      nicheTags: profile.nicheTags,
      platformLinks: profile.platformLinks || {},
      profilePic: profile.profilePicUrl,
      location: profile.location,
      rating: profile.mlScore,
      category: profile.category,
      platforms: profile.platformLinks || {},
      // followersCount: profile.follower_count || 0,

      packages: profile.packages || [],
      transactions: profile.transaction || [],
      collaborations: profile.collaborations || [],
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
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
