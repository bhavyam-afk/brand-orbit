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
        id: true,
        collaborations: {
          include: {
            package: {
              select: {
                price: true,
                title:true,
              }
            },
            packageCollaborations: true,
            campaignCollaborations: true,
            brand: true,
          },
        }
      }
    });

    if (!creator) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const requests = await prisma.customPackageRequest.findMany({
      where: { creatorId: creator.id },
      include: {
        brand: true,
        creator: true,
      },
    });

    return NextResponse.json(
      { collaborations: creator.collaborations, requests },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COLLAB ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
