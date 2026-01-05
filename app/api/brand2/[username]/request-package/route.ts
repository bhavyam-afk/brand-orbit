import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { username: string } }) {
  try {
    const body = await request.json();
    const { creatorUsername, packageId } = body || {};
    if (!creatorUsername || !packageId) {
      return NextResponse.json({ error: 'creatorUsername and packageId are required' }, { status: 400 });
    }

    const brand = await prisma.brandProfile.findFirst({ where: { username: params.username } });
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

    const creator = await prisma.creatorProfile.findUnique({ where: { username: creatorUsername } });
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });

    // Ensure the package belongs to the creator
    if (pkg.creatorId !== creator.id) {
      return NextResponse.json({ error: 'Package does not belong to the specified creator' }, { status: 400 });
    }

    // Avoid duplicate pending collaborations for the same brand/creator/package
    const existing = await prisma.collaboration.findFirst({
      where: {
        creatorId: creator.id,
        brandId: brand.id,
        packageId: pkg.id,
        status: 'PENDING',
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, collaboration: existing, alreadyExists: true });
    }

    const collab = await prisma.collaboration.create({
      data: {
        creatorId: creator.id,
        brandId: brand.id,
        packageId: pkg.id,
        finalCost: pkg.price,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, collaboration: collab });
  } catch (err) {
    console.error('request-package error', err);
    return NextResponse.json({ error: String((err as any)?.message || err) }, { status: 500 });
  }
}
