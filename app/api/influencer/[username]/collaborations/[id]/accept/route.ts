
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
		if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const resolvedParams: any = await params;
		const usernameRaw = resolvedParams?.username;
		const idRaw = resolvedParams?.id;

		const username = Array.isArray(usernameRaw) ? String(usernameRaw[0]) : String(usernameRaw ?? "");
		const collabId = Array.isArray(idRaw) ? String(idRaw[0]) : String(idRaw ?? "");

		if (!username || !collabId) {
			return NextResponse.json({ error: "Missing username or collaboration ID" }, { status: 400 });
		}

		// Find creator by session user id
		const creator = await prisma.creatorProfile.findUnique({ where: { userId: (session.user as any).id } });
		if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });

		const collab = await prisma.collaboration.findUnique({ where: { id: collabId } });
		if (!collab) return NextResponse.json({ error: "Collaboration not found" }, { status: 404 });

		if (collab.creatorId !== creator.id) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

		// Only allow accepting when collab is PENDING
		if (collab.collabstatus === 'ACTIVE') {
			const existing = await prisma.collaboration.findUnique({ where: { id: collabId }, include: { package: true, brand: true, creator: true, packageCollaborations: true } });
			return NextResponse.json({ success: true, collaboration: existing });
		}

		if (collab.collabstatus !== 'PENDING') {
			return NextResponse.json({ error: 'Collaboration not in pending state', collaboration: collab }, { status: 400 });
		}

		const updated = await prisma.collaboration.update({ where: { id: collabId }, data: { collabstatus: 'ACTIVE' }, include: { package: true, brand: true, creator: true, packageCollaborations: true } });

		return NextResponse.json({ success: true, collaboration: updated });
	} catch (err) {
		console.error('accept collab error', err);
		return NextResponse.json({ error: String((err as any)?.message || err) }, { status: 500 });
	}
}

