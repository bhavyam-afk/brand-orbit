// POST /api/creator/[username]/collaborations/[customPackageId]/counter
// Creator counters a custom package request with modified terms

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Decimal } from "@prisma/client/runtime/library";

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
    const { counterPrice, counterDeliverables, counterMessage } = await req.json();

    // Validate inputs
    if (!counterPrice && !counterDeliverables && !counterMessage) {
      return NextResponse.json(
        { error: "Please provide at least one counter field" },
        { status: 400 }
      );
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

    // Check if can be countered
    if (customPackage.status !== "REQUESTED" && customPackage.status !== "COUNTERED") {
      return NextResponse.json(
        { error: `Cannot counter - request is already ${customPackage.status}` },
        { status: 400 }
      );
    }

    // Update with counter offer
    const updatedRequest = await prisma.customPackageRequest.update({
      where: { id: customPackageId },
      data: {
        status: "COUNTERED",
        counterPrice: counterPrice ? new Decimal(counterPrice) : null,
        counterDeliverables: counterDeliverables || null,
        counterMessage: counterMessage || null,
      },
      include: { brand: true, creator: true },
    });

    return NextResponse.json(
      {
        message: "Counter offer sent to brand",
        data: updatedRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error countering custom package request:", error);
    return NextResponse.json(
      { error: "Failed to send counter offer" },
      { status: 500 }
    );
  }
}
