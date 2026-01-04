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
          // return all collaborations regardless of status
          select: {
            id: true,
            status: true,
            finalCost: true,

            // Brand who requested/paid
            brand: {
              select: {
                id: true,
                username: true,
                logoUrl: true,
              },
            },

            // Associated campaign (if any)
            campaign: {
              select: {
                id: true,
                name: true,
                budget: true,
                startDate: true,
                endDate: true,
              },
            },

            // Package details
            package: {
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                deliveryTimeDays: true,
                price: true,
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
