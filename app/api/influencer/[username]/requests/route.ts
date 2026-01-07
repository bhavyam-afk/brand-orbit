import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = await params;
    if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

    const creator = await prisma.creatorProfile.findUnique({ where: { username } });
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    const collabs = await prisma.collaboration.findMany({
      where: { creatorId: creator.id, status: 'PENDING' },
      include: {
        brand: true,
        package: true,
      },
      orderBy: { /* newest first */ id: 'desc' },
    });

    const requests = collabs.map((c) => ({
      id: c.id,
      brand: c.brand ? { id: c.brand.id, username: c.brand.username, logoUrl: c.brand.logoUrl } : null,
      brandName: c.brand?.username ?? null,
      packageId: c.packageId,
      packageTitle: c.package?.title ?? null,
      amount: c.finalCost ? String(c.finalCost) : null,
      status: c.status,
      // placeholders in case frontend expects these
      message: null,
      note: null,
      createdAt: c.id ? undefined : undefined,
    }));

    return NextResponse.json({ requests });
  } catch (err) {
    console.error('GET /requests error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
