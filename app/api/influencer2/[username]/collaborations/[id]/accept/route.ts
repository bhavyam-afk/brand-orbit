import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { username: string; id: string } }) {
  try {
    const { username, id } = params;

    // find creator by username
    const creator = await prisma.creatorProfile.findUnique({ where: { username } });
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    // find collaboration and ensure it belongs to this creator
    const collab = await prisma.collaboration.findUnique({ where: { id } });
    if (!collab) return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    if (collab.creatorId !== creator.id) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

    // only allow accepting if currently pending
    if (collab.status !== 'PENDING') {
      return NextResponse.json({ error: 'Collaboration not in pending state', collaboration: collab }, { status: 400 });
    }

    const updated = await prisma.collaboration.update({ where: { id }, data: { status: 'ACTIVE' } });

    return NextResponse.json({ success: true, collaboration: updated });
  } catch (err) {
    console.error('accept collab error', err);
    return NextResponse.json({ error: String((err as any)?.message || err) }, { status: 500 });
  }
}
