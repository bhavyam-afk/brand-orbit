import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    const resolvedParams: any = await params;
    let usernameRaw: unknown = resolvedParams?.username;
    if (usernameRaw instanceof Promise) {
      usernameRaw = await usernameRaw;
    }
    const username = Array.isArray(usernameRaw) ? usernameRaw[0] : String(usernameRaw ?? '');
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    // Fetch influencer whose package you want and then package array as the tables are linked to each other. 
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



export async function POST(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]> } }
) {
  try {
    const body = await req.json();
    const { title, description, price, deliveryTimeDays, thumbnailUrl, mediaType, deliverables, status } = body;

    const resolvedParams: any = await params;
    let usernameRaw: unknown = resolvedParams?.username;
    if (usernameRaw instanceof Promise) {
      usernameRaw = await usernameRaw;
    }
    const username = Array.isArray(usernameRaw) ? usernameRaw[0] : String(usernameRaw ?? '');
    if (!username) return NextResponse.json({ error: 'Invalid username' }, { status: 400 });


    const creator = await prisma.creatorProfile.findUnique({ where: { username } });
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

    // sanitize price: remove commas/currency symbols
    const rawPrice = price !== undefined && price !== null ? String(price) : '';
    const cleanedPrice = rawPrice.replace(/[^0-9.-]+/g, '');
    const priceForDb = cleanedPrice === '' ? '0' : cleanedPrice;

    let pkg;
    try {
      pkg = await prisma.package.create({
        data: {
          creatorId: creator.id,
          title: String(title),
          description: description ? String(description) : null,
          price: priceForDb,
          deliveryTimeDays: deliveryTimeDays !== undefined ? Number(deliveryTimeDays) : 0,
          thumbnailUrl: thumbnailUrl ? String(thumbnailUrl) : null,
          mediaType: mediaType ? String(mediaType) : 'Other',
          deliverables: Array.isArray(deliverables) ? deliverables : deliverables ? String(deliverables).split(',').map((s) => s.trim()) : [],
          // Allow client to request initial status (e.g., ACTIVE or DRAFT). Prisma will use default if omitted.
          ...(status ? { status: String(status).toUpperCase() as any } : {}),
        },
      });
    } catch (dbErr) {
      console.error('prisma create error:', dbErr);
      return NextResponse.json({ error: 'Database create error', details: String(dbErr) }, { status: 500 });
    }

    const out = {
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      price: typeof pkg.price === 'object' && pkg.price?.toString ? pkg.price.toString() : String(pkg.price ?? ''),
      deliveryTimeDays: pkg.deliveryTimeDays,
      thumbnailUrl: pkg.thumbnailUrl,
      mediaType: pkg.mediaType,
      deliverables: pkg.deliverables,
      status: pkg.status,
    };

    return NextResponse.json({ package: out }, { status: 201 });
  } catch (error) {
    console.error('create package error', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
