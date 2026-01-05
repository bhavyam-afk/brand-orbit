import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const creators = await prisma.creatorProfile.findMany({
      select: {
        id: true,
        username: true,
        profilePicUrl: true,
        category: true,
        niche: true,
        nicheTags: true,
        location: true,
        user: {
          select: {
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
    });

    return NextResponse.json({ creators }, { status: 200 });
  } catch (error) {
    console.error("Creator feed error", error);
    return NextResponse.json(
      { error: "Failed to fetch creators" },
      { status: 500 }
    );
  }
}
