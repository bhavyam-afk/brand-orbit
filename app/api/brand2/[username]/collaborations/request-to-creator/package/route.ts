import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { username: string } }) {
  try {
    const body = await request.json();
    const { creatorUsername, packageId } = body || {};
    if (!creatorUsername || !packageId) {
      return NextResponse.json({ error: 'creatorUsername and packageId are required' }, { status: 400 });
    }

    const { username } = await params;
    if (!username) {
      console.error('Missing route param: username', { params });
      return NextResponse.json({ error: 'Missing route param: username' }, { status: 400 });
    }

    const brand = await prisma.brandProfile.findUnique({ where: { username } });
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

    const creator = await prisma.creatorProfile.findUnique({ where: { username: creatorUsername } });
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });

    // Ensure the package belongs to the creator
    if (pkg.creatorId !== creator.id) {
      return NextResponse.json({ error: 'Package does not belong to the specified creator' }, { status: 400 });
    }
    
    // Create Collaboration with PackageCollaboration entry
    const collab = await prisma.collaboration.create({
      data: {
        creatorId: creator.id,
        brandId: brand.id,
        packageId: pkg.id,
        collabstatus: 'PENDING',
        collabType: 'PACKAGE',
        packageCollaborations: {
          create: {
            packageId: pkg.id,
          },
        },
      },
      include: {
        packageCollaborations: true,
        creator: true,
        brand: true,
      },
    });

    return NextResponse.json({ success: true, collaboration: collab });
  } catch (err) {
    console.error('request-package error', err);
    return NextResponse.json({ error: String((err as any)?.message || err) }, { status: 500 });
  }
}
