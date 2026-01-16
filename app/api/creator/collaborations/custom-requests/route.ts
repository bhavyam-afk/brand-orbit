// GET /api/creator/[username]/collaborations/custom-requests
// Creator sees custom package requests sent to them

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get creator
    const creatorUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { creatorProfile: true },
    });

    if (!creatorUser?.creatorProfile) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      );
    }

    // Get query params for filtering
    const status = req.nextUrl.searchParams.get("status"); // REQUESTED, COUNTERED, ACCEPTED, REJECTED

    const where: any = { creatorId: creatorUser.creatorProfile.id };
    if (status) {
      where.status = status;
    }

    // Get all custom requests for this creator
    const customRequests = await prisma.customPackageRequest.findMany({
      where,
      include: {
        brand: {
          select: {
            id: true,
            username: true,
            logoUrl: true,
            bio: true,
            industryTags: true,
          },
        },
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        data: customRequests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching custom requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
