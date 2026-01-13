import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = await params;
    if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

    const creator = await prisma.creatorProfile.findUnique({ where: { username } });
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    const collabs = await prisma.collaboration.findMany({
      where: { creatorId: creator.id, collabstatus: 'PENDING' },
      include: {
        brand: true,
        package: true,
      },
      orderBy: { id: 'desc' },
    });

    const requests = collabs.map((c) => ({
      id: c.id,
      brand: c.brand ? { id: c.brand.id, username: c.brand.username, logoUrl: c.brand.logoUrl } : null,
      packageId: c.packageId,
      packageTitle: c.package?.title ?? null,
      amount: c.package?.price ?? null,
      status: c.collabstatus,
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
