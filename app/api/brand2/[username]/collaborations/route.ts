
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { username: string } }) {
    const { username } = await params;
    if (!username) {
        return new Response(JSON.stringify({ error: 'Missing username parameter' }), { status: 400 });
    }

    try {
        const collaborations = await prisma.collaboration.findMany({
            where: { brand: { username } },
            include: {
                packageCollaborations: true,
                campaignCollaborations: true,
                creator: true,
                brand: true,
                package: true,
                campaign: true,
            },
        });

        return new Response(JSON.stringify({ collaborations }), { status: 200 });
    } catch (err) {
        console.error('Error fetching collaborations:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch collaborations' }), { status: 500 });
    }
}