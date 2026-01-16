// POST /api/creator/[username]/collaborations/[customPackageId]/reject
// Creator rejects a custom package request

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string; customPackageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customPackageId } = params;
    const { reason } = await req.json();

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

    // Get custom package request
    const customPackage = await prisma.customPackageRequest.findUnique({
      where: { id: customPackageId },
      include: { brand: true, creator: true },
    });

    if (!customPackage) {
      return NextResponse.json(
        { error: "Custom package request not found" },
        { status: 404 }
      );
    }

    // Verify creator owns this request
    if (customPackage.creatorId !== creatorUser.creatorProfile.id) {
      return NextResponse.json(
        { error: "Unauthorized - not your request" },
        { status: 403 }
      );
    }

    // Check if already processed
    if (customPackage.status !== "REQUESTED" && customPackage.status !== "COUNTERED") {
      return NextResponse.json(
        { error: `Cannot reject - request is already ${customPackage.status}` },
        { status: 400 }
      );
    }

    // Update status to REJECTED
    const updatedRequest = await prisma.customPackageRequest.update({
      where: { id: customPackageId },
      data: {
        status: "REJECTED",
      },
      include: { brand: true, creator: true },
    });

    return NextResponse.json(
      {
        message: `Custom package request rejected${reason ? ` - ${reason}` : ""}`,
        data: updatedRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting custom package request:", error);
    return NextResponse.json(
      { error: "Failed to reject request" },
      { status: 500 }
    );
  }
}
