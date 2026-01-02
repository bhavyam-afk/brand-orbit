import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    // Await params and normalize username
    const resolvedParams: any = await params;
    let usernameRaw: unknown = resolvedParams?.username;
    if (usernameRaw instanceof Promise) {
      usernameRaw = await usernameRaw;
    }
    const username = Array.isArray(usernameRaw) ? usernameRaw[0] : String(usernameRaw ?? '');
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    // Fetch influencer's packages
    const influencer = await prisma.creatorProfile.findUnique({
      where: { username },
      include: { packages: true },
    });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const pkgs = influencer.packages.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      // serialize Decimal safely
      price: typeof p.price === 'object' && p.price?.toString ? p.price.toString() : String(p.price ?? ''),
      deliveryTimeDays: p.deliveryTimeDays,
      thumbnailUrl: p.thumbnailUrl,
      mediaType: p.mediaType,
      deliverables: p.deliverables,
      status: p.status,
    }));

    return NextResponse.json({ packages: pkgs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
