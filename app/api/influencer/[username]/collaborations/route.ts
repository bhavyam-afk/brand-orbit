import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    const creator = await prisma.creatorProfile.findUnique({
      where: { username },
      select: {
        collaborations: {
          include: {
            package: {
              select: {
                price: true,
              }
            },
            packageCollaborations: true,
          },
        }
      }
    });

    if (!creator) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    // Map collaborations to use PackageCollaboration status for UI
    const enrichedCollabs = creator.collaborations.map(collab => {
      const pkgCollabStatus = collab.packageCollaborations[0]?.status || 'UNKNOWN';
      // Map PackageStatus to DealStatus
      let dealStatus: string;
      if (pkgCollabStatus === 'DRAFT') {
        dealStatus = 'PENDING'; // Brand requested, creator hasn't accepted yet
      } else if (pkgCollabStatus === 'ACTIVE') {
        dealStatus = 'ACTIVE'; // Creator accepted, deal is active
      } else {
        dealStatus = 'COMPLETED'; // DELETED or other states
      }
      return {
        ...collab,
        status: dealStatus,
      };
    });

    return NextResponse.json(
      { collaborations: enrichedCollabs},
      { status: 200 }
    );
  } catch (error) {
    console.error("[COLLAB ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
