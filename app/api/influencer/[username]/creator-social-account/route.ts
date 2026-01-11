import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request: Request, { params }: { params: { username: string } }) {
    try {
        const { username } = await params;

        // find creator by username
        const creator = await prisma.creatorProfile.findUnique({ where: { username } });
        if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

        // check if creator has connected social account
        const socialAccount = await prisma.creatorSocialAccount.findFirst({ where: { creatorId: creator.id } });

        return NextResponse.json({ connected: Boolean(socialAccount?.connected) });
    } catch (err) {
        console.error('fetch creator social account error', err);
        return NextResponse.json({ error: String((err as any)?.message || err) }, { status: 500 });
    }
}
