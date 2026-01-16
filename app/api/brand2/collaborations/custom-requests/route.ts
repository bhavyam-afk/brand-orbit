// GET /api/brand2/[username]/collaborations/custom-requests
// Brand sees pending custom package requests they've sent

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

    // Get brand
    const brandUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { brandProfile: true },
    });

    if (!brandUser?.brandProfile) {
      return NextResponse.json(
        { error: "Brand profile not found" },
        { status: 404 }
      );
    }

    // Get query params for filtering
    const status = req.nextUrl.searchParams.get("status"); // REQUESTED, COUNTERED, ACCEPTED, REJECTED

    const where: any = { brandId: brandUser.brandProfile.id };
    if (status) {
      where.status = status;
    }

    // Get all custom requests for this brand
    const customRequests = await prisma.customPackageRequest.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
            category: true,
            niche: true,
            location: true,
            nicheTags: true,
          },
        },
        brand: {
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
