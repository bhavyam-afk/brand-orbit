import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] } }
) {
  try {
    const resolved: any = await params;
    let username: any = resolved?.username;
    if (Array.isArray(username)) username = username[0];
    if (!username) return NextResponse.json({ error: "Invalid username" }, { status: 400 });

    // Find brand profile
    const brand = await prisma.brandProfile.findFirst({ where: { username } });
    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

    // Fetch collaborations for this brand (includes creator and chosen package)
    const collabs = await prisma.collaboration.findMany({
      where: { brandId: brand.id },
      include: {
        creator: {
          select: { id: true, username: true },
        },
        package: {
          select: { id: true, title: true },
        }
      },
    });

    // Return the array directly so frontend can consume it easily
    return NextResponse.json(collabs, { status: 200 });
  } catch (error) {
    console.error("[BRAND COLLABS ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
