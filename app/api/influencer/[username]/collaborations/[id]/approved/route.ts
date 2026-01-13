import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { username: string; id: string } }) {
  try {
    const { username, id } = await params;

    // find creator by username
    const creator = await prisma.creatorProfile.findUnique({
      where: { username },
    });

    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    // find collaboration and ensure it belongs to this creator
    const collab = await prisma.collaboration.findUnique({ 
      where: { id },
      include: {
        packageCollaborations: true,
      }
    });
    if (!collab) return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    if (collab.creatorId !== creator.id) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

    // Only SUBMITTED collaborations can be accepted.
    const pkgCollab = collab.packageCollaborations[0];
    if (!pkgCollab || pkgCollab.contentStatus !== 'SUBMITTED') {
      return NextResponse.json({ error: 'No Content has been sent yet.', collaboration: collab }, { status: 400 });
    }

    const updated = await prisma.collaboration.update({ 
      where: { id }, 
      data: {
        packageCollaborations: {
          update: {
            where: { id: pkgCollab.id },
            data: { contentStatus: 'APPROVED' },
          },
        },
      }, 
      include: {
        packageCollaborations: true,
      },
    });

    return NextResponse.json({ success: true, collaboration: updated });
  } catch (err) {
    console.error('accept collab error', err);
    return NextResponse.json({ error: String((err as any)?.message || err) }, { status: 500 });
  }
}
