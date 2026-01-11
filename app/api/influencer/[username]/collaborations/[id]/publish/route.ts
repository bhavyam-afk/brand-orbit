import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { username: string | string[] | Promise<string> | Promise<string[]>; id: string | string[] | Promise<string> | Promise<string[]>; }; }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resolvedParams: any = await params;
    const usernameRaw = resolvedParams?.username;
    const idRaw = resolvedParams?.id;

    const username = Array.isArray(usernameRaw) ? String(usernameRaw[0]) : String(usernameRaw ?? "");
    const collabId = Array.isArray(idRaw) ? String(idRaw[0]) : String(idRaw ?? "");

    if (!username || !collabId) return NextResponse.json({ error: 'Missing username or collaboration id' }, { status: 400 });

    const body = await req.json().catch(() => ({}));
    const publishedUrl = typeof body?.publishedUrl === 'string' ? body.publishedUrl.trim() : '';
    if (!publishedUrl) return NextResponse.json({ error: 'Missing publishedUrl' }, { status: 400 });

    // verify creator session
    const creator = await prisma.creatorProfile.findUnique({ where: { userId: (session.user as any).id } });
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

    const collab = await prisma.collaboration.findUnique({ where: { id: collabId }, include: { creator: true, packageCollaborations: true } });
    if (!collab) return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    if (collab.creator.username !== username) return NextResponse.json({ error: 'Unauthorized: not your collaboration' }, { status: 403 });
    if (collab.creatorId !== creator.id) return NextResponse.json({ error: 'Unauthorized: creator mismatch' }, { status: 403 });

    const packageCollab = collab.packageCollaborations?.[0];
    if (!packageCollab) return NextResponse.json({ error: 'No package collaboration found' }, { status: 400 });

    // ensure content has been approved before allowing publish
    const contentStatus = String( packageCollab?.contentStatus ?? '' ).toUpperCase();
    if (contentStatus !== 'APPROVED') {
      return NextResponse.json({ error: 'Content has not been approved yet' }, { status: 403 });
    }

    // persist published url and timestamp
    await prisma.packageCollaboration.update({
      where: { id: packageCollab.id },
      data: {
        publishedContentUrl: publishedUrl,
        publishedAt: new Date(),
      } as any,
    });

    const updated = await prisma.collaboration.findUnique({
      where: { id: collabId },
      include: { package: true, campaign: true, brand: true, packageCollaborations: true },
    });

    return NextResponse.json({ message: 'Published URL saved', collaboration: updated }, { status: 200 });
  } catch (error) {
    console.error('Publish URL error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
