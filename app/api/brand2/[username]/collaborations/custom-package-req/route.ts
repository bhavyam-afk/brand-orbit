// POST /api/brand2/[username]/collaborations/request-custom
// Brand sends custom package request to creator

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(
  req: NextRequest,
) {
  try {

    const { brandUsername, creatorUsername, title, description, budget, deliveryTimeDays, deliverables } = await req.json();

    // Validate inputs
    if (!brandUsername || !creatorUsername || !title || !budget || !deliverables) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate and convert budget to number
    const budgetNum = typeof budget === "string" ? parseFloat(budget) : budget;
    if (isNaN(budgetNum) || budgetNum <= 0) {
      return NextResponse.json(
        { error: "Budget must be a valid positive number" },
        { status: 400 }
      );
    }

    // Get brand user
    const brand = await prisma.brandProfile.findUnique({
      where: { username: brandUsername },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Brand profile not found" },
        { status: 404 }
      );
    }

    // Get creator
    const creator = await prisma.creatorProfile.findUnique({
      where: { username: creatorUsername },
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    // Create custom package request
    const customPackageRequest = await prisma.customPackageRequest.create({
      data: {
        brandId: brand.id,
        creatorId: creator.id,
        title,
        description: description && description.trim() ? description.trim() : null,
        deliverables: Array.isArray(deliverables) ? deliverables : deliverables.split(",").map((d: string) => d.trim()).filter((d: string) => d),
        price: new Decimal(budgetNum.toFixed(2)), // Convert to Decimal type with 2 decimals
        deliveryDays: parseInt(deliveryTimeDays) || 0,
        status: "REQUESTED",
      },
      include: {
        brand: true,
        creator: true,
      },
    });

    return NextResponse.json(
      {
        message: "Custom package request sent successfully",
        data: customPackageRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating custom package request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create request", details: errorMessage },
      { status: 500 }
    );
  }
}
