import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = await params;

    // Find the brand by username
    const brand = await prisma.brandProfile.findFirst({
      where: { username },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Fetch all collaborations for this brand with PackageCollaboration status
    const collaborations = await prisma.collaboration.findMany({
      where: { brandId: brand.id },
      include: {
        creator: true,
        package: true,
        brand: true,
        packageCollaborations: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map collaborations to include packageCollab status for UI rendering
    const enrichedCollabs = collaborations.map(collab => ({
      ...collab,
      // Use PackageCollaboration status as the source of truth for collaboration state
      status: collab.packageCollaborations[0]?.status || 'UNKNOWN',
    }));

    return NextResponse.json({ collaborations: enrichedCollabs, success: true });
  } catch (err) {
    console.error('brand collaborations error', err);
    return NextResponse.json({ error: String((err as any)?.message || err) }, { status: 500 });
  }
}
