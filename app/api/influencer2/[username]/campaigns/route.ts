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
          where: {
            status: "COMPLETED",
          },
          take: 3,
          select: {
            id: true,
            finalCost: true,

            brand: {
              select: {
                username: true,
                logoUrl: true,
              },
            },

            campaign: {
              select: {
                name: true,
              },
            },

            package: {
              select: {
                title: true,
                thumbnailUrl: true,
              },
            },
          },
        },
      },
    });

    if (!creator) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    return NextResponse.json(
      { collaborations: creator.collaborations },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COLLAB ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
