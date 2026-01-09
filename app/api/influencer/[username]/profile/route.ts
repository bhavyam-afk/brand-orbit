import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {

  const resolvedParams: any = await params;
  const usernameRaw = await resolvedParams?.username;
  const username = Array.isArray(usernameRaw) ? String(usernameRaw[0]) : String(usernameRaw ?? '');
  if (!username || typeof username !== "string") {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  // Fetch profile from database
  const profile = await prisma.creatorProfile.findUnique({
    where: { username },
    include: {
      transaction: true,
      collaborations: {
        include: {
          brand: true,
          package: true,
          campaign: true,
          packageCollaborations: { include: { package: true } },
          campaignCollaborations: { include: { campaign: true } },
          transactions: true,
        },
      },
    },
  });

  // Handle not found
  if (!profile) {
    return NextResponse.json(
      { error: "No Creatr found" },
      { status: 404 }
    );
  }

  const response = {
    username: profile.username,
    bio: profile.bio,
    location: profile.location,
    niche: profile.niche,
    profilePicUrl: profile.profilePicUrl,
    nicheTags: profile.nicheTags,
    category: profile.category,
    platformLinks: profile.platformLinks || {},
    rating: profile.mlScore,
    transactions: profile.transaction || [],
    collaborations: profile.collaborations || [],
  };

  return NextResponse.json(response, { status: 200 });

}