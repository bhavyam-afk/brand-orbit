// app/api/feed/brands/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brandProfile.findMany({
      select: {
        id: true,
        username: true,
        logoUrl: true,
        bio: true,
        industryTags: true,
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

    return NextResponse.json({ brands }, { status: 200 });
  } catch (error) {
    console.error("Brand feed error", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
