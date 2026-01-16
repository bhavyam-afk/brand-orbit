// POST /api/creator/[username]/collaborations/[customPackageId]/accept
// Creator accepts a custom package request

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string; customPackageId: string } }
) {
  try {
    const { customPackageId } = params;

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

    // Check if already processed
    if (customPackage.status !== "REQUESTED" && customPackage.status !== "COUNTERED") {
      return NextResponse.json(
        { error: `Cannot accept - request is already ${customPackage.status}` },
        { status: 400 }
      );
    }

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Package entry
      const newPackage = await tx.package.create({
        data: {
          creatorId: customPackage.creatorId,
          title: customPackage.title,
          description: customPackage.description,
          mediaType: "Custom Package",
          deliverables: customPackage.deliverables,
          deliveryTimeDays: customPackage.deliveryDays,
          price: customPackage.price,
          packagestatus: "DRAFT",
        },
      });

      // 2. Create Collaboration entry
      const collaboration = await tx.collaboration.create({
        data: {
          creatorId: customPackage.creatorId,
          brandId: customPackage.brandId,
          packageId: newPackage.id,
          collabType: "PACKAGE",
          collabstatus: "ACTIVE", // As per user spec
        },
      });

      // 3. Create PackageCollaboration entry
      await tx.packageCollaboration.create({
        data: {
          collabId: collaboration.id,
          packageId: newPackage.id,
          contentStatus: "NOT_SUBMITTED",
        },
      });

      // 4. Update CustomPackageRequest status and link collaboration
      const updatedRequest = await tx.customPackageRequest.update({
        where: { id: customPackageId },
        data: {
          status: "ACCEPTED",
          collaborationId: collaboration.id,
        },
        include: { brand: true, creator: true },
      });

      return { updatedRequest, collaboration, package: newPackage };
    });

    return NextResponse.json(
      {
        message: "Custom package request accepted successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting custom package request:", error);
    return NextResponse.json(
      { error: "Failed to accept request" },
      { status: 500 }
    );
  }
}
