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
      },
      include: {
        packageCollaborations: true,
      },
    });

    // Check if existing collab has an active/draft PackageCollaboration
    if (existing) {
      const activePkgCollab = existing.packageCollaborations.find(
        (pc: any) => pc.status === 'ACTIVE' || pc.status === 'DRAFT'
      );
      if (activePkgCollab) {
        return NextResponse.json({ success: true, collaboration: existing, alreadyExists: true });
      }
    }

    // Create Collaboration with PackageCollaboration entry
    const collab = await prisma.collaboration.create({
      data: {
        creatorId: creator.id,
        brandId: brand.id,
        packageId: pkg.id,
        packageTitle: pkg.title,
        // Create PackageCollaboration with DRAFT status (pending creator acceptance)
        packageCollaborations: {
          create: {
            packageId: pkg.id,
            status: 'DRAFT',
          },
        },
      },
      include: {
        packageCollaborations: true,
      },
    });

    return NextResponse.json({ success: true, collaboration: collab });
  } catch (err) {
    console.error('request-package error', err);
    return NextResponse.json({ error: String((err as any)?.message || err) }, { status: 500 });
  }
}
